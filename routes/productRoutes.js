const express = require("express");
const { addProduct, getAllProducts, getProductById ,deleteProduct} = require("../controllers/productController");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/add", upload.single("photo"), addProduct);  
router.get("/all", getAllProducts);                     
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);                      

module.exports = router;
