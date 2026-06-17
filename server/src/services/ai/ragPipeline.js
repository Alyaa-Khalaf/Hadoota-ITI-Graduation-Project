import dotenv from "dotenv/config";
import { getEmbedding } from "../../config/ai.js";
import KnowledgeBase from "../../models/KnowledgeBase.js";

// Add document to knowledge base
export const addDocument = async ({
  title,
  content,
  category,
  ageRange,
  tags,
  source,
}) => {
  try {
    console.log("Adding document:", { title, category });

    // Generate embedding
    const embedding = await getEmbedding(content);

    const values = (
      Array.isArray(embedding)
        ? embedding
        : embedding?.values || Object.values(embedding)
    ).map(Number);

    // Save to MongoDB with embedding
    const doc = await KnowledgeBase.create({
      title,
      content,
      category,
      ageRange,
      tags,
      source,
      embedding: values,
    });

    console.log("✅ Saved successfully:", doc._id);
    return doc;
  } catch (error) {
    throw new Error(`فشل إضافة المستند: ${error.message}`);
  }
};

// Search similar documents using cosine similarity with age filtering
export const searchSimilarDocs = async (query, { limit = 5, childAge = null } = {}) => {
  try {
    const queryEmbedding = await getEmbedding(query);

    const queryValues = (
      Array.isArray(queryEmbedding)
        ? queryEmbedding
        : queryEmbedding?.values || Object.values(queryEmbedding)
    ).map(Number);

    // Filter by age range if provided
    const filter = { embedding: { $exists: true, $ne: [] }, isActive: true };
    if (childAge) {
      filter['ageRange.min'] = { $lte: childAge };
      filter['ageRange.max'] = { $gte: childAge };
    }

    const docs = await KnowledgeBase.find(filter, {
      title: 1, content: 1, category: 1, tags: 1, source: 1, embedding: 1,
    });

    // Calculate cosine similarity
    const cosineSimilarity = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (magA * magB);
    };

    const results = docs
      .map((doc) => ({
        doc,
        score: cosineSimilarity(queryValues, doc.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  } catch (error) {
    throw new Error(`فشل البحث: ${error.message}`);
  }
};

// Get context for story generation — passes childAge for age-appropriate filtering
export const getStoryContext = async (topic, childAge) => {
  try {
    const matches = await searchSimilarDocs(topic, { limit: 5, childAge });

    if (matches.length === 0) return "";

    const context = matches
      .map(({ doc, score }) => `[${doc.category}] ${doc.title}:\n${doc.content}`)
      .join("\n\n---\n\n");

    return context;
  } catch (error) {
    console.error("RAG context error:", error);
    return "";
  }
};
