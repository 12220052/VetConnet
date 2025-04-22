const mongoose = require("mongoose");
const {
  generateTimeSlots,
  validateTime,
  parseTime,
  formatTime,
} = require("../Utils/timeUtils");

// ====================== SCHEMA DEFINITION ======================
const slotSchema = new mongoose.Schema(
  {
    startTime: String,
    endTime: String,
    isAvailable: {
      type: String,
      enum: ["true", "booked", "rescheduled", "false"],
      default: "available",
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    startTime: {
      type: String,
      default: "09:00 AM",
    },
    endTime: {
      type: String,
      default: "05:00 PM",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    slots: {
      type: [slotSchema],
      default: function () {
        return this.isActive
          ? generateTimeSlots(this.startTime, this.endTime)
          : [];
      },
    },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vetDetails: {
      email: String,
      name: String,
      ratePerHour: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    availability: {
      type: [availabilitySchema],
      required: true,
      default: () => [
        {
          day: "Monday",
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          isActive: true,
        },
        {
          day: "Tuesday",
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          isActive: true,
        },
        {
          day: "Wednesday",
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          isActive: true,
        },
        {
          day: "Thursday",
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          isActive: true,
        },
        {
          day: "Friday",
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          isActive: true,
        },
        {
          day: "Saturday",
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          isActive: true,
        },
        {
          day: "Sunday",
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          isActive: true,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// ====================== PRE-SAVE HOOK ======================
// Platform fee that gets added to the vet's rate
const PLATFORM_FEES = 100; // Fixed platform fee

scheduleSchema.pre("save", function (next) {
  // Ensure availability exists
  if (!this.availability || this.availability.length === 0) {
    this.availability = [
      {
        day: "Monday",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        isActive: true,
      },
      {
        day: "Tuesday",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        isActive: true,
      },
      {
        day: "Wednesday",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        isActive: true,
      },
      {
        day: "Thursday",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        isActive: true,
      },
      {
        day: "Friday",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        isActive: true,
      },
      {
        day: "Saturday",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        isActive: true,
      },
      {
        day: "Sunday",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        isActive: true,
      },
    ];
  }

  // Check if vet's rate is provided
  if (this.vetDetails && this.vetDetails.ratePerHour) {
    const vetRate = this.vetDetails.ratePerHour;
    // Add platform fee to the vet's rate
    const totalRate = vetRate + PLATFORM_FEES;

    // Optionally store or use the total rate for calculations in appointment logic
    this.vetDetails.totalRate = totalRate;
  } else {
    // Default vet rate if not provided (this could be an error handling case as well)
    this.vetDetails.ratePerHour = 100; // Example default rate
  }

  // Generate slots for each day
  this.availability.forEach((day) => {
    try {
      if (day.isActive) {
        // Validate times
        if (!validateTime(day.startTime)) day.startTime = "09:00 AM";
        if (!validateTime(day.endTime)) day.endTime = "05:00 PM";
        day.slots = generateTimeSlots(day.startTime, day.endTime);
      } else {
        day.slots = [];
        day.startTime = "";
        day.endTime = "";
      }
    } catch (err) {
      console.error(`Error processing ${day.day}:`, err);
      day.slots = [];
    }
  });

  next();
});

scheduleSchema.methods.revertExpiredOverrides = async function () {
  const now = new Date();
  let modified = false;

  if (this.dateOverrides) {
    for (const [date, override] of Object.entries(this.dateOverrides)) {
      if (override.overrideDate < now) {
        // Find the day in availability
        const dayName = override.overrideDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayIndex = this.availability.findIndex((d) => d.day === dayName);

        if (dayIndex !== -1 && override.originalSlots) {
          this.availability[dayIndex].slots = override.originalSlots;
          delete this.dateOverrides[date];
          modified = true;
        }
      }
    }
  }

  if (modified) {
    await this.save();
  }
};

module.exports = mongoose.model("Schedule", scheduleSchema);
