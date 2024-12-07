const express = require('express');
const Job = require('../../models/Admin/job_model');
const Hackathon = require('../../models/Admin/hack_model');
const Internship = require('../../models/Admin/intern_model')
const router = express.Router();

router.get('/count', async (req, res) => {
    try {
        const currentDate = new Date();
        const { batch } = req.query; // Get the batch year from query parameters

        // const batchFilter = batch ? { batch: parseInt(batch) } : {}; // Build batch filter
        const batchFilter = batch ? { batch: { $in: [parseInt(batch), 1] } } : {};

        // Count jobs with expired application deadlines for the specified batch
        const expired_counts_jobs = await Job.countDocuments({
            ...batchFilter,
            application_deadline: { $lt: currentDate }
        });

        const expired_counts_hackathons = await Hackathon.countDocuments({
            ...batchFilter,
            application_deadline: { $lt: currentDate }
        });

        const expired_counts_internships = await Internship.countDocuments({
            ...batchFilter,
            application_deadline: { $lt: currentDate }
        });

        // Count jobs with active application deadlines for the specified batch
        const new_counts_jobs = await Job.countDocuments({
            ...batchFilter,
            application_deadline: { $gte: currentDate }
        });

        const new_counts_hackathons = await Hackathon.countDocuments({
            ...batchFilter,
            application_deadline: { $gte: currentDate }
        });

        const new_counts_internships = await Internship.countDocuments({
            ...batchFilter,
            application_deadline: { $gte: currentDate }
        });


        res.status(200).json({ 
            expired_counts_jobs, new_counts_jobs, 
            expired_counts_hackathons, new_counts_hackathons, 
            expired_counts_internships, new_counts_internships });
            
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;