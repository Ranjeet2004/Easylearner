const express = require("express");
const router = express.Router();

const {
  createEnrollment,
  getEnrollmentById,
} = require("../controllers/enrollmentController");

router.post("/create", createEnrollment);

router.get(
  "/:enrollmentId",
  getEnrollmentById
);

module.exports = router;