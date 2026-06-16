import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    nextSceneIndex: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const sceneSchema = new mongoose.Schema(
  {
    sceneIndex: { type: Number, required: true, min: 0 },
    text: { type: String, required: true },
    imageFileId: { type: mongoose.Schema.Types.ObjectId },
    audioFileId: { type: mongoose.Schema.Types.ObjectId },
    choices: { type: [choiceSchema], default: [] },
  },
  { _id: false }
);

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    character: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      default: "",
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "child",
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      enum: ["generating", "ready", "failed"],
      default: "ready",
    },
    scenes: {
      type: [sceneSchema],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

storySchema.index({ title: "text", topic: "text" });
storySchema.index({ createdAt: -1 });
storySchema.index({ views: -1 });

const Story = mongoose.model("story", storySchema);

export default Story;
