import mongoose from "mongoose";

const storySessionSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "child",
      required: true,
      index: true,
    },
    storyId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    topic: {
      type: String,
      default: "general",
      trim: true,
    },
    durationSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

storySessionSchema.index({ childId: 1, readAt: -1 });

const StorySession = mongoose.model("storySession", storySessionSchema);

export default StorySession;
