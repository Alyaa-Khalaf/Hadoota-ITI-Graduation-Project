import Story from "../models/Story.js";
import Favorite from "../models/favoriteModel.js";

const DEFAULT_LIMIT = 10;

export const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildSearchQuery = (q) => {
  if (!q || !q.trim()) {
    return {};
  }

  const term = escapeRegex(q.trim());
  const pattern = { $regex: term, $options: "i" };

  // Regex on title/topic — works reliably with Arabic (unlike $text inside $or).
  return {
    $or: [{ title: pattern }, { topic: pattern }, { character: pattern }],
  };
};

export const buildFilterQuery = ({ character, topic, fromDate, toDate }) => {
  const query = {};

  if (character?.trim()) {
    query.character = { $regex: escapeRegex(character.trim()), $options: "i" };
  }

  if (topic?.trim()) {
    query.topic = { $regex: escapeRegex(topic.trim()), $options: "i" };
  }

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) {
      query.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  return query;
};

export const fetchStoriesWithSort = async (query, { sort, skip, limit }) => {
  if (sort === "favorites") {
    const [results, totalResult] = await Promise.all([
      Story.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "favorites",
            localField: "_id",
            foreignField: "storyId",
            as: "favorites",
          },
        },
        {
          $addFields: {
            favoriteCount: { $size: "$favorites" },
          },
        },
        { $sort: { favoriteCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            favorites: 0,
          },
        },
      ]),
      Story.countDocuments(query),
    ]);

    return { stories: results, total: totalResult };
  }

  const sortMap = {
    latest: { createdAt: -1 },
    views: { views: -1, createdAt: -1 },
  };

  const sortOption = sortMap[sort] || sortMap.latest;

  const [stories, total] = await Promise.all([
    Story.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    Story.countDocuments(query),
  ]);

  return { stories, total };
};

export const getFavoriteStoryIds = async (childId, storyIds) => {
  const favorites = await Favorite.find({
    childId,
    storyId: { $in: storyIds },
  }).select("storyId");

  return new Set(favorites.map((item) => item.storyId.toString()));
};

export const attachFavoriteFlag = (stories, favoriteIds) =>
  stories.map((story) => ({
    ...story,
    isFavorite: favoriteIds.has(story._id.toString()),
  }));
