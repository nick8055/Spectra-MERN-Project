const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Nodemailer transport configuration
const transporter = nodemailer.createTransport
({
    service: 'gmail',  // You can use another service like Outlook or set SMTP directly
    auth: 
    {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD 
    }
});

// API route to handle email sending
router.post('/send-emails', (req, res) => 
{
    const { students } = req.body;

    if (!students || students.length === 0) 
    {
        return res.status(400).send('No students found in the file.');
    }

    const emailPromises = students.map((student) => 
    {
        const mailOptions = 
        {
            from: process.env.EMAIL,
            to: student.email,
            subject: 'Registration Link for SPECRTA STUDENT PORTAL AIML',
            text: `Dear ${student.name},\n\nPlease complete your registration using the following link:\n\nhttp://localhost:3001/signup?regNo=${student.regNo}&name=${encodeURIComponent(student.name)}&email=${encodeURIComponent(student.email)}\n\nThank you,\nDr. J Dinesh Peter\nProfessor and Head\nDivision of AIML`
        };

        return transporter.sendMail(mailOptions);
    });

    Promise.all(emailPromises)
        .then(() => res.status(200).send('Emails sent successfully!'))
        .catch((error) => 
        {
            console.error('Error sending emails:', error);
            res.status(500).send('Failed to send emails.');
        });
});

module.exports = router;