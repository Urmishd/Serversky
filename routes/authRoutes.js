const express = require("express");
const { register, login,updateUser,getUser,getAllUsers,deleteUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/user/:id", updateUser);
router.get("/user/:id", getUser);     
router.get("/users", getAllUsers); 
router.delete("/user/:id", deleteUser); 


module.exports = router;
