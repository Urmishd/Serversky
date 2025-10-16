
const express = require("express");
<<<<<<< HEAD
const { addProduct, getAllProducts, getProductById,deleteProduct } = require("../controllers/productController");
=======
const { addProduct, getAllProducts, getProductById, deleteProduct,updateProduct} = require("../controllers/productController");
>>>>>>> ec85c75bae4f2427705c7a789ad8716aeef4958f
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/add", upload.single("photo"), addProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/update/:id", upload.single("photo"), updateProduct);


module.exports = router;
