const Appointment = require("../models/Appointment");
const Schedule = require("../models/Schedule");
const Pet = require("../models/Pets"); // Import Pet model
const { formatTime, parseTime } = require("../Utils/timeUtils");

exports.bookAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, petId, reason, concern } =
      req.body;
    const vetId = req.params.vetId;

    // Find the pet and get clientId
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    const clientId = pet.clientId;

    // Find the vet's schedule
    const schedule = await Schedule.findOne({ user: vetId });
    if (!schedule) {
      return res.status(404).json({ message: "Vet schedule not found" });
    }

    const appointmentDay = new Date(appointmentDate).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

    let slotFound = false;
    let matchedSlot = null;

    schedule.availability.forEach((day) => {
      if (day.day === appointmentDay && day.isActive) {
        day.slots.forEach((slot) => {
          if (
            formatTime(slot.startTime) === appointmentTime &&
            slot.isAvailable === "true"
          ) {
            slotFound = true;
            slot.isAvailable = "booked";
            matchedSlot = slot;
          }
        });
      }
    });

    if (!slotFound || !matchedSlot) {
      return res
        .status(400)
        .json({ message: "Slot is already booked or unavailable" });
    }

    const vetRate = schedule.vetDetails.ratePerHour;
    const appointmentDuration = calculateDuration(
      matchedSlot.startTime,
      matchedSlot.endTime
    );
    const paymentAmount = vetRate * appointmentDuration;

    const newAppointment = new Appointment({
      clientId,
      vetId,
      petId,
      scheduleId: schedule._id,
      paymentStatus: "pending",
      paymentAmount,
      vetRate,
      appointmentDate,
      appointmentTime: matchedSlot.startTime,
      endTime: matchedSlot.endTime,
      reason,
      concern,
    });

    await newAppointment.save();

    schedule.markModified("availability");
    await schedule.save();

    const appointmentMessage = `Appointment = ${paymentAmount} (${vetRate} x ${appointmentDuration}hr)`;

    res.status(201).json({
      message: `Appointment booked successfully. ${appointmentMessage}`,
      appointment: newAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error booking appointment",
      error: error.message,
    });
  }
};

const calculateDuration = (startTime, endTime) => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const durationInMinutes = (end - start) / 1000 / 60;
  return durationInMinutes / 60;
};
