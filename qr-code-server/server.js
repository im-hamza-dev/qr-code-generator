const express = require("express");
const sql = require("mssql");
const QRCode = require("qrcode");
// const geoip = require("geoip-lite");
const macaddress = require("macaddress");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
const fs = require("fs");
const geoip = require("fast-geoip");

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

var config = sql.connect({
  user: "QRUser",
  password: "2024QrUser",
  port: 19411,
  server: "mssql-66596-0.cloudclusters.net",
  database: "QRDatabase",
  options: {
    encrypt: false, // Disable encryption
  },
});

// Connect to SQL Server
sql.connect(config, (err) => {
  if (err) {
    throw err;
  }
  console.log("Connection DB Successful!");
});
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
    let total = await new sql.Request().query`SELECT * FROM QRCodes`;
    total = total.recordset.length + 1;
    // Save to database
    console.log("total length", total);
    await new sql.Request().query`
       INSERT INTO QRCodes (QRCodeId, RedirectUrl, SquareColor, EyeColor)
       VALUES (${id},${redirectUrl}, ${squareColor}, ${eyeColor})
     `;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all QR Codes
app.get("/api/qrcodes", async (req, res) => {
  try {
    // const result = localDb;
    const result = await new sql.Request().query`SELECT * FROM QRCodes`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all QR Codes
app.get("/api/qrscans", async (req, res) => {
  try {
    // const result = localDb;
    const result = await new sql.Request().query`SELECT * FROM QRScans`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/scan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ip = requestIp.getClientIp(req);
    const userAgent = req.headers["user-agent"];
    const scanDate = new Date();

    // Get geolocation
    const geo = await geoip.lookup(ip);

    // const geo = null; // geoip.lookup(ip);
    const country = geo ? geo.country : "Unknown";
    const city = geo ? geo.city : "Unknown";

    const macAddress = await new Promise((resolve) => {
      macaddress.one((err, mac) => {
        resolve(mac || "Unknown");
      });
    });

    // Log scan to database
    await new sql.Request().query`
       INSERT INTO QRScans (QRCodeId, ScanDateTime, DeviceDetails, Country, City, MacAddress)
       VALUES (${id}, ${scanDate}, ${userAgent}, ${country}, ${city}, ${macAddress})
     `;

    res.json({
      message: "success",
      ip,
      macAddress: macAddress,
      scanDate: scanDate,
      userAgent: userAgent,
      country: country,
      city: city,
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
