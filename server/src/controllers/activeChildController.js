import User from "../models/User.js";
import Child from "../models/Child.js";

export const getActiveChild = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("activeChild");

    res.json({
      success: true,
      data: user.activeChild,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
};

export const setActiveChild = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { childId } = req.body;

    const child = await Child.findOne({
      _id: childId,
      parentId: userId,
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "الطفل غير موجود",
      });
    }

    await User.findByIdAndUpdate(userId, {
      activeChild: childId,
    });

    res.json({
      success: true,
      data: child,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
};