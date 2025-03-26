const Vet = require('../model/Vet');
const User = require('../model/User');

// controllers/vetController.js
exports.setAvailability = async (req, res) => {
    try {
      const { updates } = req.body; // Array of { day, startTime, endTime }
      const userId = req.user._id;
  
      if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Provide updates array: { day, startTime, endTime }' 
        });
      }
  
      // Find vet (or create with defaults)
      let vet = await Vet.findOne({ user: userId });
      if (!vet) {
        vet = new Vet({ user: userId });
        await vet.save(); // Triggers default availability
      }
  
      // Update existing days (no deletions)
      updates.forEach(update => {
        const { day, startTime, endTime } = update;
        const slotIndex = vet.availability.findIndex(s => s.day === day);
  
        if (slotIndex !== -1) {
          vet.availability[slotIndex] = { 
            day, 
            startTime, 
            endTime, 
            isAvailable: true // Force true (frontend handles hiding)
          };
        }
        // Else: Ignore invalid days (or add them? Adjust as needed)
      });
  
      await vet.save();
  
      res.status(200).json({ 
        success: true, 
        data: vet.availability 
      });
  
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  };




exports.getAvailability = async (req, res) => {
  try {
    const vet = await Vet.findOne({ user: req.user._id });
    res.status(200).json({
      success: true,
      data: vet?.availability || []
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};