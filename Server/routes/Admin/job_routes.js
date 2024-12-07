const express = require('express');
const Job = require('../../models/Admin/job_model');
const multer = require('multer');
const router = express.Router();
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, 'images/jobs/');
    },
    filename: function (req, file, cb){
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage: storage });

// Define an endpoint to fetch job data
router.get('/data', async (req, res) => {
    try 
    {
      // Fetch all job data from the database
      const jobs = await Job.find({});
      res.status(200).json(jobs); // Send the fetched data as JSON response
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send('Server Error');
    }
});

// Get a job by ID
router.get('/data/:id', async (req, res) => {
    try 
    {
        const all_jobs_byID = await Job.findById(req.params.id);
        if (!all_jobs_byID) return res.status(404).json({ message: 'Job not found' });
        res.json(all_jobs_byID);
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
  });


  // Update a Job
router.put('/data/:id', upload.single('logo'), async (req, res) => {
    try 
    {
      // Extract text data from req.body
      const updatedData = {
        batch: req.body.batch,
        company_name: req.body.company_name,
        position: req.body.position,
        salary: req.body.salary,
        eligibility: req.body.eligibility,
        mode: req.body.mode,
        location: req.body.location,
        application_deadline: req.body.application_deadline,
        application_link: req.body.application_link,
      };
  
      // If an image was uploaded, add it to the update
      if (req.file) {
        updatedData.logo = req.file.filename;  // Store file path or use another storage logic
      }
  
      // Update the job in the database
      const update_job = await Job.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
      if (!update_job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      res.json(update_job);
    } 
    catch (err) 
    {
      console.error('Error updating job:', err);
      res.status(500).json({ message: err.message });
    }
  });

  // Delete a Job
router.delete('/data/:id', async (req, res) => 
{
    try 
    {
        const delete_job = await Job.findByIdAndDelete(req.params.id);
        if (!delete_job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
}
);
  
//Endpoint to handle adding a new job
router.post('/add', upload.single('logo'), async (req, res) => {
    try 
    {
      const 
      { 
        batch, 
        company_name, 
        position, 
        salary, 
        eligibility, 
        mode,
        location, 
        application_deadline, 
        application_link,
      } = req.body; 
  
      const newJob = new Job({ 
        batch, 
        company_name, 
        position, 
        salary, 
        eligibility, 
        mode,
        location, 
        application_deadline, 
        application_link,
        logo: req.file ? req.file.filename : null, // Save the image filename if uploaded 
      });
  
      await newJob.save();
      res.status(201).send(newJob);
    } 
    catch(error) 
    {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  //Endpoint to count documents in 'jobs' collection
router.get('/count', async (req, res) => 
{
    try 
    {
      const currentDate = new Date();
  
      const expired_counts_jobs = await Job.countDocuments({ application_deadline: { $lt: currentDate } });
      const new_counts_jobs = await Job.countDocuments({ application_deadline: { $gte: currentDate } });
  
      res.status(200).json({ expired_counts_jobs, new_counts_jobs});
    } 
    catch (error) 
    {
      res.status(500).json({ message: error.message });
    }
});
  
  module.exports = router;