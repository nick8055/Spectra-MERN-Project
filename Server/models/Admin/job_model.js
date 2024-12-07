const mongoose = require('mongoose');

// Define the schema for Job
const jobSchema = new mongoose.Schema({
    batch: Number,
    company_name: String,
    position: String,
    salary: String,
    eligibility: String,
    mode: String,
    location: String,
    application_deadline: Date,
    application_link: String,
    logo: String // Add image field to store the image URL
  });

  module.exports = mongoose.model('Jobs', jobSchema);