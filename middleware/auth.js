const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(401).json({ msg: "No token, authorization denied" });
  }
};

module.exports = auth;
