const mongoose = require('mongoose');
const { Vet } = require('./model/Schedule');

async function resetAllVets() {
  await mongoose.connect('mongodb://localhost:27017/vetconnet');

  const defaultAvailability = [
    'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday', 'Sunday'
  ].map(day => ({
    day,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    isActive: true
  }));

  await Vet.updateMany(
    {},
    { $set: { availability: defaultAvailability } },
    { bypassDocumentValidation: true }
  );

  console.log('All vets reset to default availability');
  process.exit(0);
}

resetAllVets().catch(err => {
  console.error('Reset failed:', err);
  process.exit(1);
});