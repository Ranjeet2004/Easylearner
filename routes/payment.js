router.post("/test-success", (req, res) => {
  const { enrollmentId, transactionId } = req.body;

  const sql = `
    UPDATE enrollments
    SET
      payment_status='paid',
      enrollment_status='active',
      transaction_id=?
    WHERE enrollment_id=?
  `;

  db.query(
    sql,
    [transactionId, enrollmentId],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Test Payment Successful",
      });
    }
  );
});