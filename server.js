require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("EasyLearner API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);


    
const contactRoutes = require("./routes/contact");

  app.use("/api", contactRoutes);
  
});


const enrollmentRoutes = require(
  "./routes/enrollRoutes"
);

app.use(
  "/api/enrollments",
  enrollmentRoutes
);


const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/payment", paymentRoutes);

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
