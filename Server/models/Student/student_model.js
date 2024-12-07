const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s]+$/, 'Invalid Name: Only letters and spaces are allowed']
  },

  universityRegId: {
    type: String,
    required: true,
    unique: true,
    match: [/^(URK|ULK|UTK)\d{2}CS[57]\d{3}$/, 'Only Students from AIML department can register into this portal']
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid Email: Please enter a valid email address']
  },

  mobile: {
    type: String,
    required: true,
    match: [/^\+91\d{10}$/, 'Invalid Mobile Number: Must be a 10-digit number starting with +91']
  },

  password: {
    type: String,
    required: true,
    match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d+)(?=.*[\W_]).{12,}$/, 'Invalid Password: Must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 12 characters long']
  },

  otp: String,
  otpExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },

  mobileVerified: {
    type: Boolean,
    default: false
  }
  
});

module.exports = mongoose.model('Students', studentSchema);
