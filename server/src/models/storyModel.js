import mongoose from "mongoose";

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
