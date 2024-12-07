const express = require('express');
const Hackathon = require('../../models/Admin/hack_model');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage
({
    destination: function (req, file, cb) 
    {
      cb(null, 'images/hackathons');
    },
    filename: function (req, file, cb) 
    {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Define an endpoint to fetch hackathon data
router.get('/data', async (req, res) => 
{
    try 
    {
      // Fetch all hackathon data from the database
      const hackathons = await Hackathon.find({});
      res.status(200).json(hackathons); // Send the fetched data as JSON response
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send('Server Error');
    }
}
);

// Get a hackathon by ID
router.get('/data/:id', async (req, res) => 
{
  try 
  {
      const all_hackathons_byID = await Hackathon.findById(req.params.id);
      if (!all_hackathons_byID) return res.status(404).json({ message: 'Hackathon not found' });
      res.json(all_hackathons_byID);
  } 
  catch (err) 
  {
      res.status(500).json({ message: err.message });
  }
});


// Update an Hackathon
router.put('/data/:id', upload.single('logo'), async (req, res) => 
  {
      try 
      {
        // Extract text data from req.body
        const updatedData = 
        {
          batch: req.body.batch,
          event_name: req.body.event_name,
          organizer: req.body.organizer,
          event_description: req.body.event_description,
          mode: req.body.mode,
          location: req.body.location,
          prize_money: req.body.prize_money,
          application_deadline: req.body.application_deadline,
          application_link: req.body.application_link,
        };
    
        // If a logo was uploaded, add it to the update
        if (req.file) 
        {
          updatedData.logo = req.file.filename;  // Store file path or use another storage logic
        }
    
        // Update the hackathon in the database
        const update_hackathon = await Hackathon.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    
        if (!update_hackathon) 
        {
          return res.status(404).json({ message: 'Hackathon not found' });
        }
    
        res.json(update_hackathon);
      } 
      
      catch (err) 
      {
        console.error('Error updating hackathon:', err);
        res.status(500).json({ message: err.message });
      }
  
  });


// Delete a Hackathon
router.delete('/data/:id', async (req, res) => 
{
  try 
  {
      const delete_hackathon = await Hackathon.findByIdAndDelete(req.params.id);
      if (!delete_hackathon) return res.status(404).json({ message: 'Hackathon not found' });
      res.json({ message: 'Hackathon deleted successfully' });
  } 
  catch (err) 
  {
      res.status(500).json({ message: err.message });
  }
});


//Endpoint to count documents in Hackathon Collection
router.get('/count', async (req, res) => 
{
    try 
    {
      const currentDate = new Date();

      const expired_counts_hacks = await Hackathon.countDocuments({ application_deadline: { $lt: currentDate } });
      const new_counts_hacks = await Hackathon.countDocuments({ application_deadline: { $gte: currentDate } });

      res.status(200).json({ expired_counts_hacks, new_counts_hacks});
    } 
    catch (error) 
    {
      res.status(500).json({ message: error.message });
    }
});

//Endpoint to handle adding a new hackathon
router.post('/add', upload.single('logo'), 
  async (req, res) => {
  try 
  {
    const 
    {
        batch, 
        event_name, 
        organizer, 
        event_description,
        mode, 
        location, 
        prize_money, 
        application_deadline, 
        application_link
    } = req.body; 

    const newHackathon = new Hackathon
    ({ 
        batch, 
        event_name, 
        organizer, 
        event_description,
        mode, 
        location, 
        prize_money, 
        application_deadline, 
        application_link,
        logo: req.file ? req.file.filename : null, // Save the image filename if uploaded 
    });

    await newHackathon.save();
    res.status(201).send(newHackathon);
  } catch(error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;