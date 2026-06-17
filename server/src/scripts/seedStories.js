import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Story from "../models/Story.js";

dotenv.config();

const sampleStories = [
  {
    title: "رحلة إلى الفضاء",
    topic: "فضاء",
    character: "رائد فضاء",
    content: "كان يا مكان في قديم الزمان رائد فضاء شجاع...",
    views: 120,
  },
  {
    title: "الأسد والغابة",
    topic: "حيوانات",
    character: "أسد",
    content: "في غابة كبيرة عاش أسد لطيف...",
    views: 95,
  },
  {
    title: "مغامرة في البحر",
    topic: "بحر",
    character: "سمكة",
    content: "سبحت سمكة صغيرة في أعماق البحر...",
    views: 80,
  },
  {
    title: "نجمة في السماء",
    topic: "فضاء",
    character: "نجمة",
    content: "كانت هناك نجمة صغيرة تحلم أن تزور الفضاء...",
    views: 65,
  },
  {
    title: "الأرنب السريع",
    topic: "حيوانات",
    character: "أرنب",
    content: "تسابق أرنب مع السلحفاة في الغابة...",
    views: 150,
  },
];

const seedStories = async () => {
  await connectDB();

  const existingCount = await Story.countDocuments();
  if (existingCount > 0) {
    console.log(`Skipping seed: ${existingCount} stories already exist.`);
    process.exit(0);
  }

  await Story.insertMany(sampleStories);
  console.log(`Seeded ${sampleStories.length} stories successfully.`);
  process.exit(0);
};

seedStories().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
