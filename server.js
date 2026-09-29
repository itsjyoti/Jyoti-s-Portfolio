require("dotenv").config();
const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname)); // serves index.html and assets

// Gmail SMTP (use an App Password, not your normal password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Max 5 messages per 15 minutes per visitor (stops spam)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

app.post("/api/contact", limiter, async (req, res) => {
  const { name = "", email = "", message = "" } = req.body || {};

  if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || !message.trim()) {
    return res.status(400).json({ error: "Name, valid email and message are required." });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio message from ${name.slice(0, 80)}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message.slice(0, 2000)}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Mail error:", err.message);
    res.status(500).json({ error: "Could not send the message. Please try again later." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
