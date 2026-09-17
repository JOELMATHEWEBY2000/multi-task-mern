const express = require("express");

const {
    registerUser,
    loginUser,
    getUsers
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
    "/",
    protect,
    authorize("admin","manager"),
    getUsers
);

module.exports = router;