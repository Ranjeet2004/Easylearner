const express = require("express");
const router = express.Router();

const db = require("../config/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpStore = {};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




// ======================
// REGISTER ROUTE
// ======================
router.post("/register", async (req, res) => {
  console.log("REGISTER HIT");
  console.log(req.body);

  const {
    fullName,
    email,
    phone,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  try {
    // Check Email Exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Database Error",
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already registered",
          });
        }

        // Hash Password
     router.post("/register", async (req, res) => {
  console.log("REGISTER HIT");
  console.log(req.body);

  const {
    fullName,
    email,
    phone,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Database Error",
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already registered",
          });
        }

        const hashedPassword = await bcrypt.hash(
          password,
          10
        );

        const enrollmentId =
          "EL" + Date.now().toString().slice(-8);

        
        db.query(
  `INSERT INTO enrollments
  (
    enrollment_id,
    full_name,
    email,
    mobile,
    city,
    qualification,
    batch
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    enrollmentId,
    full_name,
    email,
    mobile,
    city,
    qualification,
    batch
  ],
  (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Enrollment Failed"
      });
    }

    // Users Table Insert
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
        full_name,
        email,
        mobile,
        "123456", // default password
        enrollmentId
      ],
      (err2) => {

        if (err2) {
          console.log(err2);
        }

        res.status(201).json({
          success: true,
          enrollmentId
        });
      }
    );
  }
);
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
            phone,
            hashedPassword,
            enrollmentId,
          ],
          (err, result) => {
            if (err) {
              console.log(err);

              return res.status(500).json({
                success: false,
                message: "Registration Failed",
              });
            }

            res.status(201).json({
              success: true,
              enrollmentId,
              message: "Account Created Successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }

        if (err) {
          return res.status(500).json({
            message: "Registration Failed",
          });
        }

        res.status(201).json({
          success: true,
          message: "Account Created Successfully",
        });
      }
    );
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// ======================
// LOGIN ROUTE
// ======================
router.post("/login", (req, res) => {
  const { login, password } = req.body;

  console.log("LOGIN INPUT:", login);

  db.query(
    `SELECT * FROM users
     WHERE email = ? OR enrollment_id = ?`,
    [login, login],
    async (err, result) => {

      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      console.log("DB RESULT:", result);

      if (result.length === 0) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }

      const user = result[0];

      const validPassword = await bcrypt.compare(
        password,
        user.password
      );

      console.log("PASSWORD MATCH:", validPassword);

      if (!validPassword) {
        return res.status(401).json({
          message: "Wrong Password",
        });
      }

      res.status(200).json({
        success: true,
        message: "Login Successful",
        user,
      });
    }
  );
});

// SEND OTP ROUTE
// router.post("/send-otp", (req, res) => {
//   const { email } = req.body;

//   console.log("OTP request for:", email);

//   res.status(200).json({
//     success: true,
//     message: "OTP Sent Successfully",
//   });
// });

// SEND OTP ROUTE
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(
    100000 + Math.random() * 900000
  );

    // Save OTP
  otpStore[email] = otp;

  console.log("Generated OTP:", otp);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "EasyLearner Password Reset OTP",
      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
});


// veriy oTP

// router.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (otpStore[email] == otp) {
//     return res.json({
//       success: true,
//       message: "OTP Verified",
//     });
//   }

//   res.status(400).json({
//     message: "Invalid OTP",
//   });
// });

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {

    delete otpStore[email];

    return res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
    });
  }

  res.status(400).json({
    message: "Invalid OTP",
  });
});

// Password Update

router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Database Error",
          });
        }

        res.status(200).json({
          success: true,
          message: "Password Updated Successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});



router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Database Error",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "User Not Found",
          });
        }

        res.status(200).json({
          success: true,
          message: "Password Updated Successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});



module.exports = router;