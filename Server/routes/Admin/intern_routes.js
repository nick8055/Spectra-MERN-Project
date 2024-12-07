const express = require('express');
const Internship = require('../../models/Admin/intern_model');
const multer = require('multer');
const router = express.Router();
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage
({
    destination: function (req, file, cb) 
    {
      cb(null, 'images/internships');
    },
    filename: function (req, file, cb) 
    {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Define an endpoint to fetch internship data
router.get('/data', async (req, res) => 
{
    try 
    {
      // Fetch all internship data from the database
      const internships = await Internship.find({});
      res.status(200).json(internships); // Send the fetched data as JSON response
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send('Server Error');
    }
});

// Get an internship by ID
router.get('/data/:id', async (req, res) => 
{
    try 
    {
        const all_internships_byID = await Internship.findById(req.params.id);
        if (!all_internships_byID) return res.status(404).json({ message: 'Internship not found' });
        res.json(all_internships_byID);
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
});

// Update an Internship
router.put('/data/:id', upload.single('logo'), async (req, res) => 
{
    try 
    {
      // Extract text data from req.body
      const updatedData = 
      {
        batch: req.body.batch,
        company_name: req.body.company_name,
        position: req.body.position,
        stipend: req.body.stipend,
        eligibility: req.body.eligibility,
        mode: req.body.mode,
        location: req.body.location,
        duration: req.body.duration,
        application_deadline: req.body.application_deadline,
        application_link: req.body.application_link,
      };
  
      // If a logo was uploaded, add it to the update
      if (req.file) 
      {
        updatedData.logo = req.file.filename;  // Store file path or use another storage logic
      }
  
      // Update the internship in the database
      const update_internship = await Internship.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
      if (!update_internship) 
      {
        return res.status(404).json({ message: 'Internship not found' });
      }
  
      res.json(update_internship);
    } 
    
    catch (err) 
    {
      console.error('Error updating internship:', err);
      res.status(500).json({ message: err.message });
    }

});

// Delete an internship
router.delete('/data/:id', async (req, res) => 
{
    try 
    {
        const delete_internship = await Internship.findByIdAndDelete(req.params.id);
        if (!delete_internship) return res.status(404).json({ message: 'Internship not found' });
        res.json({ message: 'Internship deleted successfully' });
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
});
  
  
//Endpoint to count documents in 'internships' collection
router.get('/count', async (req, res) => 
{
    try 
    {
        const currentDate = new Date();
  
        const expired_counts = await Internship.countDocuments({ application_deadline: { $lt: currentDate } });
        const new_counts = await Internship.countDocuments({ application_deadline: { $gte: currentDate } });
  
        res.status(200).json({ expired_counts, new_counts});
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
});

  
//Endpoint to handle adding a new internship
router.post('/add', upload.single('logo'),
    async (req, res) => {
    try 
    {
      const 
      { 
        batch, 
        company_name, 
        position, 
        stipend, 
        eligibility, 
        mode, 
        location, 
        duration, 
        application_deadline, 
        application_link 
      } = req.body; 
  
      const newInternship = new Internship
      ({ 
        batch, 
        company_name, 
        position, 
        stipend, 
        eligibility, 
        mode, 
        location, 
        duration, 
        application_deadline, 
        application_link,
        logo: req.file ? req.file.filename : null, // Save the image filename if uploaded 
      });
  
      await newInternship.save();
      res.status(201).send(newInternship);
    } 
    catch(error) 
    {
      console.error(error);
      res.status(500).send('Server Error');
    }

});


  module.exports = router;