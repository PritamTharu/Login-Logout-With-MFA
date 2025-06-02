const mongoose = require('mongoose');

const MFASchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  totpSecret: { type: String, required: true }, 
});

module.exports = mongoose.model('Mfamodel', MFASchema);
