const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const offerRoutes = require("./routes/offers");
const pickupRoutes = require("./routes/pickups");
const walletRoutes = require("./routes/wallet");
const ratingRoutes = require("./routes/ratings");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) =>
  res.json({ message: "E-Waste Platform API Running" }),
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
