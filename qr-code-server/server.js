const express = require("express");
const sql = require("mssql");
const QRCode = require("qrcode");
const geoip = require("geoip-lite");
const macaddress = require("macaddress");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
const fs = require("fs");

var cors = require("cors");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT | 5000;

// Configure Multer for file upload
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.options("*", cors());
let localDb = [];
// Create QR Code
app.post("/api/qrcodes", async (req, res) => {
  try {
    const { id, redirectUrl, squareColor, eyeColor } = req.body;

    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(redirectUrl, {
      color: {
        dark: squareColor,
        light: "#ffffff00", // Transparent background
      },
      width: 256,
      margin: 1,
    });

    localDb.push({
      id,
      redirectUrl,
      squareColor,
      eyeColor,
      qrCodeDataUrl,
    });
    // // Save to database
    // await sql.query`
    //   INSERT INTO QRCodes (Id, RedirectUrl, SquareColor, EyeColor, QRCodeImage)
    //   VALUES (${id}, ${redirectUrl}, ${squareColor}, ${eyeColor}, ${qrCodeDataUrl})
    // `;

    res.json({ success: true, qrCodeUrl: qrCodeDataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all QR Codes
app.get("/api/qrcodes", async (req, res) => {
  try {
    let result = localDb;
    // const result = await sql.query`SELECT * FROM QRCodes`;
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/scan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ip = requestIp.getClientIp(req);
    console.log(ip);
    const userAgent = req.headers["user-agent"];
    const scanDate = new Date();

    // Get geolocation
    const geo = null; // geoip.lookup(ip);
    const country = geo ? geo.country : "Unknown";
    const city = geo ? geo.city : "Unknown";

    const macAddress = await new Promise((resolve) => {
      macaddress.one((err, mac) => {
        resolve(mac || "Unknown");
      });
    });

    res.json({
      message: "success",
      ip,
      macAddress: macAddress,
      scanDate: scanDate,
      userAgent: userAgent,
      country: country,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
