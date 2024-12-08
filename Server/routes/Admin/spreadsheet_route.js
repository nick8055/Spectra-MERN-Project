const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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
        const mailOptions = {
            from: process.env.EMAIL,
            to: student.email,
            subject: 'Registration Link for SPECRTA STUDENT PORTAL AIML',
            html: `
                <p>Dear <strong>${student.name}</strong>,</p>
                <p>Please complete your registration using the following link:</p>
                <p>
                    <a href="${process.env.STUDENT_APP_URL}/signup?regNo=${student.regNo}&name=${encodeURIComponent(student.name)}&email=${encodeURIComponent(student.email)}" style="color: blue; text-decoration: underline;">
                        Complete Registration
                    </a>
                </p>
                <p>Thank you,</p>
                <p>Dr. J Dinesh Peter<br>Professor and Head<br>Division of AIML</p>
            `
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