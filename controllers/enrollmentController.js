const nodemailer = require("nodemailer");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("Mailer Error:", error);
  } else {
    console.log("Mailer Ready ✅");
  }
});

// Create Enrollment
const createEnrollment = async (req, res) => {
  const {
    fullName,
    email,
    mobile,
    city,
    qualification,
    batch,
    paymentType,
    experience,
    courseId,
    courseName,
    coursePrice,
    courseImage,
    courseDuration,
  } = req.body;

  const enrollmentId =
    "ENR" + Date.now().toString().slice(-8);

  const sql = `
    INSERT INTO enrollments (
      enrollment_id,
      full_name,
      email,
      mobile,
      city,
      qualification,
      batch,
      payment_type,
      experience,
      course_id,
      course_name,
      course_price,
      course_image,
      course_duration
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    enrollmentId,
    fullName,
    email,
    mobile,
    city,
    qualification,
    batch,
    paymentType,
    experience,
    courseId,
    courseName,
    coursePrice,
    courseImage,
    courseDuration,
  ];

   db.query(sql, values, async (err, result) => {
    if (err) {
      console.error("Enrollment Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to save enrollment",
      });
     }
     
    // ==========================
    // CHECK USER
    // ==========================
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (checkErr, users) => {
        if (checkErr) {
          console.log(checkErr);
        } else {
          if (users.length > 0) {
            // Update Enrollment ID
            db.query(
              `UPDATE users
               SET enrollment_id = ?
               WHERE email = ?`,
              [enrollmentId, email],
              (updateErr) => {
                if (updateErr) {
                  console.log(updateErr);
                } else {
                  console.log(
                    "Enrollment ID updated successfully"
                  );
                }
              }
            );
          } else {
            // Create New User
            const hashedPassword =
              await bcrypt.hash("123456", 10);

            db.query(
              `INSERT INTO users
              (
                full_name,
                email,
                phone,
                password,
                enrollment_id
              )
              VALUES (?, ?, ?, ?, ?)`,
              [
                fullName,
                email,
                mobile,
                hashedPassword,
                enrollmentId,
              ],
              (insertErr) => {
                if (insertErr) {
                  console.log(insertErr);
                } else {
                  console.log(
                    "User inserted successfully"
                  );
                }
              }
            );
          }
        }


  // ==========================
        // SEND EMAIL
        // ==========================
        try {
          const info =
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: email,
              subject:
                "Payment Submitted Successfully",
              html: `
              <h2>Payment Submitted Successfully</h2>

              <p>Dear ${fullName},</p>

              <p>Your payment has been received successfully and is under verification.</p>

              <p><strong>Enrollment ID:</strong> ${enrollmentId}</p>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Amount:</strong> ₹${coursePrice}</p>

              <p>
                Login Here:
                <a href="https://easylearner.in/login">
                  https://easylearner.in/login
                </a>
              </p>

               <p>
                Password Update:
                <a href="https://easylearner.in/forgot-password">
                  https://easylearner.in/forgot-password
                </a>
              </p>

              <p>
                Temporary Password:
                <strong>123456</strong>
              </p>

              <br/>
              <p>Easy Learner Team</p>
            `,
            });

          console.log(
            "Email Sent:",
            info.messageId
          );
        } catch (mailError) {
          console.log(
            "Mail Error:",
            mailError
          );
        }

        return res.status(201).json({
          success: true,
          message:
            "Enrollment Saved Successfully",
          enrollmentId,
          insertId: result.insertId,
        });
      }
    );
  });
};


// ==========================
// GET ENROLLMENT BY ID
// ==========================
const getEnrollmentById = (req, res) => {
  const { enrollmentId } = req.params;

  db.query(
    "SELECT * FROM enrollments WHERE enrollment_id = ?",
    [enrollmentId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Enrollment Not Found",
        });
      }

      res.status(200).json({
        success: true,
        data: result[0],
      });
    }
  );
};

module.exports = {
  createEnrollment,
  getEnrollmentById,
};