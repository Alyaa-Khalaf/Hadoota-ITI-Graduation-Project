import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const rewardHistorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["star", "badge"],
      required: true,
    },
    amount: {
      type: Number,
      default: 1,
    },
    badgeName: {
      type: String,
      default: "",
    },
    reason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const gamificationSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "child",
      required: true,
      unique: true,
      index: true,
    },
    stars: {
      type: Number,
      default: 0,
      min: 0,
    },
    badges: {
      type: [badgeSchema],
      default: [],
    },
    rewardHistory: {
      type: [rewardHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Gamification = mongoose.model("gamification", gamificationSchema);

export default Gamification;
