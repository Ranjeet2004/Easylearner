const express = require("express");
const router = express.Router();
const db = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/contact", (req, res) => {
    const { fullName, email, phone, message } = req.body;
    

     // Check email already submitted
  db.query(
    "SELECT * FROM contacts WHERE email = ?",
    [email],
      (err, checkResult) => {
        
      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (checkResult.length > 0) {
        return res.status(400).json({
          message: "You have already submitted a message.",
        });
    }
        
// save contacts
    db.query(
    "INSERT INTO contacts (full_name,email,phone,message) VALUES (?,?,?,?)",
    [fullName, email, phone, message],
        async (err, result) => {
        
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database Error",
        });
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: "New Contact Form Submission",
          html: `
            <h2>New Contact Message</h2>

            <p><b>Name:</b> ${fullName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>Message:</b> ${message}</p>
          `,
        });

        res.status(200).json({
          success: true,
          message: "Message Sent Successfully",
        });

      } catch (error) {
        console.log(error);

        res.status(500).json({
          message: "Email Sending Failed",
             });
          }
        }
      );
    }
  );
});

module.exports = router;