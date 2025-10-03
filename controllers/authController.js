const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register

exports.register = async (req, res) => {
  try {
    console.log("Received data:", req.body);   

    const { fname, lname, email, phone, password, confirmpassword, gender, country, terms } = req.body;

    if (!fname || !lname || !email || !phone || !password || !confirmpassword || !gender || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!terms) {
      return res.status(400).json({ message: "You must accept terms & conditions" });
    }

    if (password !== confirmpassword) {
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
    avatarUrl: "",
    });


    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  } 
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Username or Password" });
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
        gender: user.gender,
        country: user.country,
        avatarUrl: user.avatarUrl,
     
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const { fname, lname, email, phone, password, gender, country } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    if (req.file) {
      user.avatarUrl = `/uploads/${req.file.filename}`;
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

console.log( user.avatarUrl)
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
       avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get User by ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete User