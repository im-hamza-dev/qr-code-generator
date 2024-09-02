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
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

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
