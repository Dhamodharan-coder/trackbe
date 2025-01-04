import express from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/authmodel.js"
import dotenv from "dotenv"
const router = express.Router()

dotenv.config()

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields are required" });
  
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
  
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  });
  
  // User login
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields are required" });
  
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  });
  

  router.post("/api/reset-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
  
    const user = await User.findOne({ username: email });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
  
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${process.env.CLIENT_URL}/reset-password/${token}">here</a> to reset your password.</p>`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Password reset email sent" });
    });
  });
  
  
  router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  });

  export default router