// controllers/productController.js
const Product = require("../models/Product");
const path = require("path");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    let photoFilename = "";
    if (req.file) {
      photo = req.file.filename; 
    }

 
    const newProduct = new Product({
      name,
      description,
      price,
      photo: photoFilename,
    });

    await newProduct.save();


    const photoUrl = photoFilename
      ? `${req.protocol}://${req.get("host")}/uploads/${photoFilename}`
      : "";

    res.status(201).json({
      message: "Product added successfully",
      product: {
        ...newProduct.toObject(),
        photo: photoUrl, 
      },
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const formatted = products.map((p) => ({
      ...p.toObject(),
      photo: p.photo
        ? `${req.protocol}://${req.get("host")}/uploads/${p.photo}`
        : "",
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const formatted = {
      ...product.toObject(),
      photo: product.photo
        ? `${req.protocol}://${req.get("host")}/uploads/${product.photo}`
        : "",
    };

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
