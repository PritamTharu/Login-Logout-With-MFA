const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    index: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: Buffer,
  },
  refreshToken: {
    type:String,
    default: ''
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  isMfaConfigured:{
    type: Boolean,
    default: false
  }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);
