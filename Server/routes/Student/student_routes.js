const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const Student = require('../../models/Student/student_model');
const auth = require('../../middleware/student_auth');

const router = express.Router();
const { check, validationResult } = require('express-validator');

// Temporary in-memory storage for unverified users
let tempStudents = {};

// Get Authenticated Student
router.get('/getStudent', auth, async (req, res) =>
{
    try 
    {
      const student = await Student.findById(req.student.id).select('-password');
      res.status(200).json({student});
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
      subject: 'SPECTRA Student Portal OTP Code for Registration/Credential Resetting',
      html: `
        <p>Dear Student,</p>
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

// Register Temporary Student
router.post('/register-temp', async (req, res) => {

  const { name, universityRegId, email, mobile, password } = req.body;

  // Name pattern to validate
  const namePattern = /^[a-zA-Z\s]+$/;
  // Validate name against the pattern
  if (!namePattern.test(name)) {
      return res.status(400).json({
        msg: 'Name must contain only alphabets.'
      });
  }

  // Username pattern to validate
  const regIdPattern = /^(URK|ULK|UTK)\d{2}CS[57]\d{3}$/;
  // Validate universityRegId against the pattern
  if (!regIdPattern.test(universityRegId)) {
      return res.status(400).json({
        msg: 'University Reg ID is invalid/not part of AIML department'
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

  if (tempStudents[universityRegId]) {
    return res.status(400).json({ msg: 'Registration already in progress. Verify OTP or wait for it to expire.' });
  }

  const existingStudent = await Student.findOne({ universityRegId });
  if (existingStudent) {
    return res.status(400).json({ msg: 'Student already exists' });
  }

  const otp = generateOTP();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  tempStudents[universityRegId] = {
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



// Verify OTP and Register Student
router.post('/verify-otp', async (req, res) => {
  const { universityRegId, otp } = req.body;

  const tempStudent = tempStudents[universityRegId];
  if (!tempStudent) {
    return res.status(400).json({ msg: 'No registration found for this universityRegId' });
  }

  if (tempStudent.otp !== otp || tempStudent.otpExpires < Date.now()) {
    return res.status(400).json({ msg: 'OTP is invalid or expired' });
  }

  try {
    const newStudent = new Student({
      name: tempStudent.name,
      universityRegId,
      email: tempStudent.email,
      mobile: tempStudent.mobile,
      password: tempStudent.password
    });

    await newStudent.save();
    delete tempStudents[universityRegId];
    res.json({ msg: 'Student registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Resend OTP
router.post('/resend-otp', async (req, res) => {
  const { universityRegId } = req.body;

  const tempStudent = tempStudents[universityRegId];
  if (!tempStudent) {
    return res.status(400).json({ msg: 'No registration found for this universityRegId' });
  }

  const otp = generateOTP();
  tempStudent.otp = otp;
  tempStudent.otpExpires = Date.now() + 300000; // Extend OTP validity

  try {
    await sendEmailOTP(tempStudent.email, otp);
    res.json({ msg: 'OTP resent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error resending OTP');
  }
});

// Login Student
router.post('/login', async (req, res) => {
  const { universityRegId, password } = req.body;

  try {
    const student = await Student.findOne({ universityRegId });
      
    if (!student) {
       return res.status(400).json({ msg: 'Invalid credentials' });
    }
      
    const isMatch = await bcrypt.compare(password, student.password);
      
    if (!isMatch){
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
      
    const payload = {
      student: {
        id: student.id
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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    student.otp = otp;
    student.otpExpires = Date.now() + 3600000; // OTP valid for 1 hour

    await sendEmailOTP(student.email, otp); // Using your existing sendEmailOTP function
    await student.save();

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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    if (student.otp !== otp || student.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'OTP is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP and expiration after successful password reset
    student.otp = undefined;
    student.otpExpires = undefined;

    await student.save();

    res.json({ msg: 'Password reset successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});







// // Register Student
// router.post('/register', 
// [
//     check('name').matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only alphabets'),
//     check('universityRegId').matches(/^(URK|ULK|UTK)\d{2}CS[57]\d{3}$/).withMessage('Only AIML Students can register'),
//     check('email').isEmail().withMessage('Enter a valid email'),
//     check('mobile').matches(/^\+91\d{10}$/).withMessage('Enter a valid mobile number'),
//     check('password')
//     .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{12,}$/)
//     .withMessage('Password must be at least 12 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character')
// ],

// async (req, res) =>

// {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) 
//     {
//       return res.status(400).json({ errors: errors.array() });
//     }
  
//     const { name, universityRegId, email, mobile, password } = req.body;
  
//     try 
//     {
//       let student = await Student.findOne({ universityRegId });
//       if (student) 
//       {
//         return res.status(400).json({ msg: 'Student already exists' });
//       }
  
//       student = new Student
//       ({
//         name,
//         universityRegId,
//         email,
//         mobile,
//         password
//       });
  
//       const salt = await bcrypt.genSalt(10);
//       student.password = await bcrypt.hash(password, salt);
  
//       const otp = generateOTP();
//       student.otp = otp;
//       student.otpExpires = Date.now() + 3600000; // 1 hour
  
//        await sendEmailOTP(email, otp);
//       //await sendSMSOTP(mobile, otp);
  
//       await student.save();
  
//       res.json({ msg: 'Registration successful, verify OTP sent to email and mobile' });
//     } 
//     catch (err) 
//     {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
// });


// // Verify OTP
// router.post('/verify-otp', async (req, res) => {

//     const { universityRegId, otp } = req.body;
  
//     try 
//     {
//       const student = await Student.findOne({ universityRegId });
  
//       if (!student)
//       {
//         return res.status(400).json({ msg: 'Invalid University Registration ID' });
//       }
  
//       if (student.otp !== otp || student.otpExpires < Date.now()) 
//       {
//         return res.status(400).json({ msg: 'OTP is invalid or has expired' });
//       }
  
//       student.otp = undefined;
//       student.otpExpires = undefined;
//       student.emailVerified = true;
//       student.mobileVerified = true;
  
//       await student.save();
  
//       res.json({ msg: 'OTP verified successfully' });
//     } 

//     catch (err) 
//     {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
// });


// // Login Student
// router.post('/login', async (req, res) => 
// {
//     const { universityRegId, password } = req.body;
  
//     try 
//     {
//       const student = await Student.findOne({ universityRegId });
  
//       if (!student) 
//       {
//         return res.status(400).json({ msg: 'Invalid credentials' });
//       }
  
//       const isMatch = await bcrypt.compare(password, student.password);
  
//       if (!isMatch) 
//       {
//         return res.status(400).json({ msg: 'Invalid credentials' });
//       }
  
//       const payload = 
//       {
//         student: 
//         {
//           id: student.id
//         }
//       };
  
//       jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => 
//       {
//         if (err) throw err;
//         res.json({ token });
//       });
//     }
    
//     catch (err) 
//     {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
// });

// // Password Reset
// router.post('/reset-password', async (req, res) => {

//     const { universityRegId, otp, newPassword } = req.body;
  
//     try 
//     {
//       const student = await Student.findOne({ universityRegId });
  
//       if (!student) {
//         return res.status(400).json({ msg: 'Invalid University Registration ID' });
//       }
  
//       if (student.otp !== otp || student.otpExpires < Date.now()) 
//       {
//         return res.status(400).json({ msg: 'OTP is invalid or has expired' });
//       }
  
//       const salt = await bcrypt.genSalt(10);
//       student.password = await bcrypt.hash(newPassword, salt);
//       student.otp = undefined;
//       student.otpExpires = undefined;
  
//       await student.save();
  
//       res.json({ msg: 'Password reset successfully' });
//     } 

//     catch (err) 
//     {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
// });


module.exports = router;
  