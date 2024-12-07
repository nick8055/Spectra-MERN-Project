const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const Admin = require("../../models/Admin/admin_model")
const auth = require('../../middleware/admin_auth');

const router = express.Router();
const { check, validationResult } = require('express-validator');

// Temporary in-memory storage for unverified users
let tempAdmins = {};

// Get Authenticated Admin
router.get('/getAdmin', auth, async (req, res) =>
    {
        try 
        {
          const admin = await Admin.findById(req.admin.id).select('-password');
          res.status(200).json({admin});
        } 
        catch (err) 
        {
          console.error(err.message);
          res.status(500).send('Server error');
        }
});
    
    
// Send OTP via Email
const sendEmailOTP = async (email, otp) => 
{
        const transporter = nodemailer.createTransport
        ({
          service: 'gmail',
          auth: 
          {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
          }
        });
      
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'SPECTRA Admin Portal OTP Code for Registration/Credential Resetting',
          html: `
            <p>Dear User,</p>
            <p>Your OTP code is <strong>${otp}</strong>. Kindly do not share this code with anybody else.</p>
            <p>Thank you.</p>
            <p>Dr J Dinesh Peter<br>
            Portal Administrator and Head of Division, AIML<br>
            Karunya Institute of Technology and Sciences</p>
          `
        };
      
        await transporter.sendMail(mailOptions);
};
    
// Send OTP via SMS
const sendSMSOTP = async (mobile, otp) => 
{
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create
        ({
          body: `Your OTP code is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: mobile
        });
    };
    
    // Generate OTP
    const generateOTP = () => 
    {
        return Math.floor(100000 + Math.random() * 900000).toString();
};
    

// Register Temporary Admin
router.post('/register-temp', async (req, res) => {

  const { name, username, email, mobile, password } = req.body;

  // Name pattern to validate
  const namePattern = /^[a-zA-Z\s]+$/;
  // Validate name against the pattern
  if (!namePattern.test(name)) {
      return res.status(400).json({
        msg: 'Name must contain only alphabets.'
      });
  }

  // Username pattern to validate
  const usernamePattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  // Validate username against the pattern
  if (!usernamePattern.test(username)) {
      return res.status(400).json({
        msg: 'Username must be alphanumeric and min. 6 characters.'
      });
  }

  // Email pattern to validate
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Validate email against the pattern
  if (!emailPattern.test(email)) {
      return res.status(400).json({
        msg: 'Enter a valid email.'
      });
  }

  // Password pattern to validate
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  // Validate password against the pattern
  if (!passwordPattern.test(password)) {
      return res.status(400).json({
        msg: 'Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character.'
      });
  }

  if (tempAdmins[username]) {
    return res.status(400).json({ msg: 'Registration already in progress. Verify OTP or wait for it to expire.' });
  }

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    return res.status(400).json({ msg: 'Admin already exists' });
  }

  const otp = generateOTP();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  tempAdmins[username] = {
    name,
    email,
    mobile,
    password: hashedPassword,
    otp,
    otpExpires: Date.now() + 300000 // OTP valid for 5 minutes
  };

  try {
    await sendEmailOTP(email, otp);
    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error sending OTP');
  }
});

// Verify OTP and Register Admin
router.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body;

  const tempAdmin = tempAdmins[username];
  if (!tempAdmin) {
    return res.status(400).json({ msg: 'No registration found for this username' });
  }

  if (tempAdmin.otp !== otp || tempAdmin.otpExpires < Date.now()) {
    return res.status(400).json({ msg: 'OTP is invalid or expired' });
  }

  try {
    const newAdmin = new Admin({
      name: tempAdmin.name,
      username,
      email: tempAdmin.email,
      mobile: tempAdmin.mobile,
      password: tempAdmin.password
    });

    await newAdmin.save();
    delete tempAdmins[username];
    res.json({ msg: 'Admin registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  const { username } = req.body;

  const tempAdmin = tempAdmins[username];
  if (!tempAdmin) {
    return res.status(400).json({ msg: 'No registration found for this username' });
  }

  const otp = generateOTP();
  tempAdmin.otp = otp;
  tempAdmin.otpExpires = Date.now() + 300000; // Extend OTP validity

  try {
    await sendEmailOTP(tempAdmin.email, otp);
    res.json({ msg: 'OTP resent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error resending OTP');
  }
});



// Login Admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
      
    if (!admin) {
       return res.status(400).json({ msg: 'Invalid credentials' });
    }
      
    const isMatch = await bcrypt.compare(password, admin.password);
      
    if (!isMatch){
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
      
    const payload = {
      admin: {
        id: admin.id
      }
    };
      
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  }
        
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Request OTP for Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 3600000; // OTP valid for 1 hour

    await sendEmailOTP(admin.email, otp); // Using your existing sendEmailOTP function
    await admin.save();

    res.json({ msg: 'OTP sent to your registered email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Request OTP for Forgot Username
router.post('/forgot-username', async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 3600000; // OTP valid for 1 hour

    await sendEmailOTP(admin.email, otp); // Using your existing sendEmailOTP function
    await admin.save();

    res.json({ msg: 'OTP sent to your registered email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Password pattern to validate
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{12,}$/;

  // Validate new password against the pattern
  if (!passwordPattern.test(newPassword)) {
    return res.status(400).json({
      msg: 'Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character.'
    });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    if (admin.otp !== otp || admin.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'OTP is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP and expiration after successful password reset
    admin.otp = undefined;
    admin.otpExpires = undefined;

    await admin.save();

    res.json({ msg: 'Password reset successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Reset Username
router.post('/reset-username', async (req, res) => {
  const { email, otp, newUsername } = req.body;

  // Password pattern to validate
  const usernamePattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

  // Validate new password against the pattern
  if (!usernamePattern.test(newUsername)) {
      return res.status(400).json({
        msg: 'Username must be strictly alphanumeric and minimum 6 characters long.'
      });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    if (admin.otp !== otp || admin.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'OTP is invalid or has expired' });
    }

    admin.username = await newUsername;

    admin.otp = undefined;
    admin.otpExpires = undefined;

    await admin.save();

    res.json({ msg: 'Username reset successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
      