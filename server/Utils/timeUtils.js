// utils/timeUtils.js

// 1. Time Validation
function validateTime(timeStr) {
  if (!timeStr) return false;
  return /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/i.test(timeStr);
}

// 2. Time Parsing
function parseTime(timeStr) {
  if (!validateTime(timeStr)) {
    console.error("Invalid time format:", timeStr);
    return new Date(NaN); // Return invalid date
  }

  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Convert to 24-hour format
  if (period.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

  return new Date(1970, 0, 1, hours, minutes);
}

// 3. Time Formatting
function formatTime(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date object:", date);
    return "09:00 AM"; // Fallback default
  }

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

// 4. Slot Generation
function generateTimeSlots(startTime, endTime) {
  try {
    // Validate inputs with fallbacks
    if (!validateTime(startTime)) startTime = "09:00 AM";
    if (!validateTime(endTime)) endTime = "05:00 PM";

    const slots = [];
    let current = parseTime(startTime);
    const end = parseTime(endTime);

    // Generate slots in 1-hour increments
    while (current < end) {
      const slotEnd = new Date(current.getTime() + 60 * 60 * 1000);
      if (slotEnd > end) break;

      slots.push({
        startTime: formatTime(current),
        endTime: formatTime(slotEnd),
        isAvailable: true,
      });

      current = slotEnd;
    }

    return slots;
  } catch (err) {
    console.error("Slot generation failed:", err);
    return []; // Return empty array on error
  }
}

// 5. Export all functions
module.exports = {
  validateTime,
  parseTime,
  formatTime,
  generateTimeSlots,
};
