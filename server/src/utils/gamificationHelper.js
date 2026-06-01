import Gamification from "../models/gamificationModel.js";

export const getOrCreateGamification = async (childId) => {
  let gamification = await Gamification.findOne({ childId });

  if (!gamification) {
    gamification = await Gamification.create({ childId });
  }

  return gamification;
};
