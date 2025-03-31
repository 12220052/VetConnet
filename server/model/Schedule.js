// model/Schedule.js
const mongoose = require('mongoose');

// Sub-schema for availability (previously in Vet.js)
const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: {
      values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      message: '{VALUE} is not a valid day. Must be Monday-Sunday'
    },
    required: true
  },
  startTime: { 
    type: String, 
    default: "09:00 AM" 
  },
  endTime: { 
    type: String, 
    default: "05:00 PM" 
  },
  isActive: {
    type: Boolean,
    default: true
  }
});



// Sub-schema for slots (from original Schedule.js)
const slotSchema = new mongoose.Schema({
  startTime: String,
  endTime: String,
  isAvailable: Boolean
});

// Sub-schema for day slots (from original Schedule.js)
const daySlotsSchema = new mongoose.Schema({
  day: String,
  slots: [slotSchema],
  updatedAt: Date
}, { _id: false });



// Main Schedule schema (from original Schedule.js)
const scheduleSchema = new mongoose.Schema({
  vet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vet',
    required: true,
    unique: true 
  },
  days: {
    type: Map,
    of: daySlotsSchema,
    default: {}
  }
}, { timestamps: true });




const vetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  availability: {
    type: [new mongoose.Schema({
      day: {
        type: String,
        required: true,
        enum: {
          values: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          message: '{VALUE} is not a valid weekday'
        },
        validate: {
          validator: function(v) {
            return [
              'Monday','Tuesday','Wednesday',
              'Thursday','Friday','Saturday','Sunday'
            ].includes(v);
          },
          message: props => `${props.value} is not a valid weekday`
        }        
      },
      startTime: {
        type: String,
        default: '09:00 AM',
        validate: {
          validator: v => /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(v),
          message: 'Invalid time format (use HH:MM AM/PM)'
        }
      },
      endTime: {
        type: String,
        default: '05:00 PM',
        validate: {
          validator: v => /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(v),
          message: 'Invalid time format (use HH:MM AM/PM)'
        }
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }, { _id: false })],
    default: () => ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
      .map(day => ({ day })),
    validate: {
      validator: function(arr) {
        // Check for duplicates and invalid days
        const days = arr.map(a => a.day?.toUpperCase());
        const validDays = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
        return days.every(day => validDays.includes(day)) && 
               new Set(days).size === days.length;
      },
      message: 'Invalid or duplicate days in availability'
    }
  }
}, { 
  timestamps: true,
  strict: 'throw'
});

// Pre-save hook to normalize data
vetSchema.pre('save', function(next) {
  // Remove duplicates
  const seen = new Set();
  this.availability = this.availability.filter(entry => {
    if (seen.has(entry.day)) {
      return false;
    }
    seen.add(entry.day);
    return true;
  });
  next();
});


// Export both models
module.exports = {
  Vet: mongoose.model('Vet', vetSchema),
  Schedule: mongoose.model('Schedule', scheduleSchema)
};