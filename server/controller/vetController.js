//vetController.js
const { Vet, Schedule } = require('../model/Schedule');

const DEFAULT_AVAILABILITY = [
  { day: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM', isActive: true },
  { day: 'Tuesday', startTime: '09:00 AM', endTime: '05:00 PM', isActive: true },
  { day: 'Wednesday', startTime: '09:00 AM', endTime: '05:00 PM', isActive: true },
  { day: 'Thursday', startTime: '09:00 AM', endTime: '05:00 PM', isActive: true },
  { day: 'Friday', startTime: '09:00 AM', endTime: '05:00 PM', isActive: true },
  { day: 'Saturday', startTime: '09:00 AM', endTime: '05:00 PM', isActive: true },
  { day: 'Sunday', startTime: '09:00 AM', endTime: '05:00 PM', isActive: true }
];



// utils/timeUtils.js
const validateTimeString = (time) => {
  if (typeof time !== 'string') return false;
  return /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i.test(time);
};

const to24Hour = (time12h) => {
  if (!validateTimeString(time12h)) {
    throw new Error(`Invalid time format: ${time12h}. Expected format like "09:00 AM"`);
  }

  const [time, modifier] = time12h.toUpperCase().split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
  
  return `${hours.padStart(2, '0')}:${minutes}`;
};

const to12Hour = (time24h) => {
  if (!validateTimeString(time24h.replace(/(AM|PM)/i, '').trim())) {
    throw new Error(`Invalid time format: ${time24h}. Expected format like "13:00"`);
  }

  const [hours, minutes] = time24h.split(':');
  const hourNum = parseInt(hours, 10);
  const modifier = hourNum >= 12 ? 'PM' : 'AM';
  const displayHours = hourNum % 12 || 12;
  
  return `${displayHours}:${minutes} ${modifier}`;
};
const generateTimeSlots = (startTime, endTime) => {
  try {
    const slots = [];
    let current = new Date(`1970-01-01 ${to24Hour(startTime)}`);
    const end = new Date(`1970-01-01 ${to24Hour(endTime)}`);
    
    while (current < end) {
      const slotEnd = new Date(current.getTime() + 60 * 60 * 1000);
      if (slotEnd > end) break;
      
      slots.push({
        startTime: to12Hour(current.toTimeString().substring(0, 5)),
        endTime: to12Hour(slotEnd.toTimeString().substring(0, 5)),
        isAvailable: true
      });
      
      current = slotEnd;
    }
    
    return slots;
  } catch (err) {
    console.error(`Slot generation failed: ${err.message}`);
    return [];
  }
};




// Initialize vet with default availability
exports.initializeVet = async (userId) => {
const vet = new Vet({ 
  user: userId,
  availability: DEFAULT_AVAILABILITY // Set default availability on creation
});
return await vet.save();
};




// Get current availability
exports.getAvailability = async (req, res) => {
  try {
    const vet = await Vet.findOne({ user: req.user._id });
    if (!vet) return res.status(404).json({ success: false, message: 'Vet not found' });

    if (vet.availability.length === 0) {
      return res.status(200).json({
        success: true,
        data: DEFAULT_AVAILABILITY
      });
    }
    
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

// In your vetController.js
exports.clearAvailability = async (req, res) => {
  try {
    const vet = await Vet.findOneAndUpdate(
      { user: req.user._id }, // Finds the vet by user ID
      { 
        $set: { 
          availability: [] // Sets availability to an empty array
        } 
      },
      { new: true } // Returns the updated document
    );

    res.status(200).json({
      success: true,
      message: "Availability cleared successfully",
      data: vet.availability // Will return an empty array
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    
    if (!Array.isArray(availability) || availability.length !== 7) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability data. Expected an array of 7 days."
      });
    }
    
    for (const day of availability) {
      if (!day.day || typeof day.isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: "Each day must have a valid 'day' and 'isActive' status."
        });
      }
      
      if (day.isActive) {
        if (!validateTimeString(day.startTime) || !validateTimeString(day.endTime)) {
          return res.status(400).json({
            success: false,
            message: `Invalid time format for ${day.day}. Expected format like '09:00 AM'`
          });
        }
      } else {
        day.startTime = "N/A";
        day.endTime = "N/A";
      }
    }

    const vet = await Vet.findOneAndUpdate(
      { user: req.user._id },
      { $set: { availability } },
      { new: true }
    );
    
    if (!vet) {
      return res.status(404).json({ success: false, message: "Vet not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: vet.availability
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




exports.getDayAvailability = async (req, res) => {
  try {
    const { day } = req.params;
    const vet = await Vet.findOne({ user: req.user._id });
    
    // Validate day
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day. Must be a full day name (e.g., "Monday")'
      });
    }

    // Get day config
    let dayConfig = vet?.availability.find(d => d.day === day);
    if (!dayConfig) {
      dayConfig = DEFAULT_AVAILABILITY.find(d => d.day === day);
    }

    // Generate slots with validation
    let slots = [];
    if (dayConfig.isActive) {
      try {
        slots = generateTimeSlots(dayConfig.startTime, dayConfig.endTime);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Invalid time format in availability: ${err.message}`
        });
      }
    }

    res.status(200).json({
      success: true,
      availability: {
        day,
        startTime: dayConfig.startTime,
        endTime: dayConfig.endTime,
        isActive: dayConfig.isActive,
        slots
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// Update day availability
exports.updateDayAvailability = async (req, res) => {
  try {
    const { day } = req.params;
    const { startTime, endTime, isActive } = req.body;

    let vet = await Vet.findOne({ user: req.user._id });
    if (!vet) vet = await this.initializeVet(req.user._id);

    // Start with current availability or default if empty
    const currentAvailability = vet.availability.length > 0 
      ? [...vet.availability] 
      : [...DEFAULT_AVAILABILITY];

    // Find the day to update
    const dayIndex = currentAvailability.findIndex(d => d.day === day);
    
    // Update or add the day configuration
    if (dayIndex !== -1) {
      currentAvailability[dayIndex] = { 
        ...currentAvailability[dayIndex],
        day,
        startTime: startTime || currentAvailability[dayIndex].startTime,
        endTime: endTime || currentAvailability[dayIndex].endTime,
        isActive: isActive !== undefined ? isActive : currentAvailability[dayIndex].isActive
      };
    } else {
      currentAvailability.push({
        day,
        startTime: startTime || DEFAULT_AVAILABILITY.find(d => d.day === day)?.startTime || '09:00 AM',
        endTime: endTime || DEFAULT_AVAILABILITY.find(d => d.day === day)?.endTime || '05:00 PM',
        isActive: isActive !== undefined ? isActive : true
      });
    }

    // Update the vet's availability with the complete set
    vet.availability = currentAvailability;
    await vet.save();
    
    // Return updated availability for all days
    res.status(200).json({
      success: true,
      availability: vet.availability
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};









exports.bulkUpdateAvailability = async (req, res) => {
  try {
    const { updates } = req.body;
    const userId = req.user._id;

    // 1. Validate input
    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Payload must be an array'
      });
    }

    // 2. Check for duplicate days in request
    const requestDays = updates.map(u => u.day);
    if (new Set(requestDays).size !== requestDays.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate days in request'
      });
    }

    // 3. Get or create vet
    let vet = await Vet.findOne({ user: userId }) || 
             await this.initializeVet(userId);

    // 4. Create new availability map
    const availabilityMap = new Map();
    vet.availability.forEach(entry => availabilityMap.set(entry.day, entry));

    // 5. Apply updates
    for (const update of updates) {
      if (!update.day || ![
        'Monday','Tuesday','Wednesday',
        'Thursday','Friday','Saturday','Sunday'
      ].includes(update.day)) {
        continue; // Skip invalid
      }

      availabilityMap.set(update.day, {
        day: update.day,
        startTime: update.startTime || availabilityMap.get(update.day)?.startTime || '09:00 AM',
        endTime: update.endTime || availabilityMap.get(update.day)?.endTime || '05:00 PM',
        isActive: update.isActive !== undefined ? update.isActive : 
                 (availabilityMap.get(update.day)?.isActive ?? true)
      });
    }

    // 6. Convert back to array
    vet.availability = Array.from(availabilityMap.values());

    // 7. Save with validation
    await vet.save();

    return res.status(200).json({
      success: true,
      availability: vet.availability
    });

  } catch (err) {
    console.error('Update failed:', err);
    return res.status(400).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: Object.values(err.errors).map(e => e.message) })
    });
  }
};

module.exports = exports;