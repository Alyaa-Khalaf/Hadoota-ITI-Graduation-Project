import Personalization from '../models/Personalization.js'; 

// @desc    Get child personalization profile
// @route   GET /api/personalization/:childId
export const getPersonalizationProfile = async (req, res) => { 
  try {
    let profile = await Personalization.findOne({ childId: req.params.childId });
    
    // لو الطفل لسه جديد ومالهوش بروفايل، هنكاريته ليه فوراً بالـ Defaults
    if (!profile) {
      profile = await Personalization.create({ childId: req.params.childId });
    }

    const isEngineActive = profile.storiesListenedCount >= 3;

    res.status(200).json({
      success: true,
      isEngineActive, // الـ Front-end يقدر يعرف منها الـ Engine اشتغل ولا لسه
      data: profile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update child personalization profile (بناءً على تحليل الـ Patterns)
// @route   PUT /api/personalization/:childId
export const updatePersonalizationProfile = async (req, res) => { // ✅ التعديل لـ export const
  try {
    // تحديث ذكي: بنستخدم $set و $inc لزيادة عداد الحواديت وتحديث الـ arrays
    const updatedProfile = await Personalization.findOneAndUpdate(
      { childId: req.params.childId },
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};