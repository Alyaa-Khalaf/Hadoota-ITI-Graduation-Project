import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "child",
      required: true,
      index: true,
    },
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "story",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ childId: 1, storyId: 1 }, { unique: true });

const Favorite = mongoose.model("favorite", favoriteSchema);

export default Favorite;
