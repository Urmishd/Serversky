const express = require("express");
const { register, login,updateUser,getUser,getAllUsers,deleteUser } = require("../controllers/authController");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.put("/updateuser/:id", upload.single("avatar"), updateUser);
router.get("/user/:id", getUser);     
router.get("/users", getAllUsers); 
router.delete("/user/:id", deleteUser);

module.exports = router;