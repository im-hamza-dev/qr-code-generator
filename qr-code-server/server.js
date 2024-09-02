const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

var cors = require("cors");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT | 5000;

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" });
app.use(cors());

// Endpoint to handle PDF upload and send it via email
app.post("/send-pdf", upload.single("file"), (req, res) => {
  const { file, email } = req;

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "hi.hamza.dev@gmail.com",
      pass: "ydsf hvvk kyfk bunv", // Make sure to use an app password or environment variable for security
    },
  });

  // Email options
  const mailOptions = {
    from: "hi.hamza.dev@gmail.com",
    to: email,
    subject: "Your Calorie and Macros Report",
    text: "Please find attached your report.",
    attachments: [
      {
        filename: file.originalname,
        path: path.join(__dirname, file.path),
      },
    ],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error sending email");
    }

    // Remove the file after sending
    fs.unlinkSync(file.path);

    res.send("Email sent successfully!");
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
