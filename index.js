const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const path = require("path");

const productRoutes = require("./routes/productRoutes");
const path = require("path");


const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
