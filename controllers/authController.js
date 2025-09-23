const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { fname, lname, email, phone, password, conformpassword, gender, country } = req.body;

    if (password !== conformpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existUser) {
      return res.status(400).json({ message: "Email or Phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      email,
      phone,
      password: hashedPassword,
      gender,
      country,
    });

    await newUser.save();
    res.status(201).json({ message: " User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: " Server error", error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

    res.status(200).json({
      message: " Login successful",
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // userId from URL
    const { fname, lname, email, phone, password, gender, country } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate email or phone (only if updated)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      user.email = email;
    }

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone already exists" });
      }
      user.phone = phone;
    }

    // Update other fields
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (gender) user.gender = gender;
    if (country) user.country = country;

    // If password provided, hash it
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        country: user.country,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
