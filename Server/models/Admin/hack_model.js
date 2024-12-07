const mongoose = require('mongoose');

// Define schema for hackathon
const hackathonSchema = new mongoose.Schema({
    batch: Number,
    event_name: String,
    organizer: String,
    event_description: String,
    mode: String,
    location: String,
    prize_money: String,
    application_deadline: Date,
    application_link: String,
    logo: String // Add image field to store the image URL
  })

module.exports = mongoose.model('Hackathons', hackathonSchema);