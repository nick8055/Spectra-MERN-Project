const mongoose = require('mongoose');

// Define the schema for Internship
const internshipSchema = new mongoose.Schema({
    batch: Number,
    company_name: String,
    position: String,
    stipend: String,
    eligibility: String,
    mode: String,
    location: String,
    duration: String,
    application_deadline: Date,
    application_link: String,
    logo: String // Add image field to store the image URL
  });

module.exports = mongoose.model('Internships', internshipSchema);