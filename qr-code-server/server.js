const express = require("express");
const sql = require("mssql");
const QRCode = require("qrcode");
const geoip = require("geoip-lite");
const macaddress = require("macaddress");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");

var cors = require("cors");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT | 5000;

// Configure Multer for file upload
app.use(
  cors({
    origin: "*",
  }),
  bodyParser.json()
);

// // Endpoint to handle PDF upload and send it via email
// app.post("/send-pdf", upload.single("file"), (req, res) => {
//   const { file, email } = req;

//   // Create a transporter object using the default SMTP transport
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: "hi.hamza.dev@gmail.com",
//       pass: "ydsf hvvk kyfk bunv", // Make sure to use an app password or environment variable for security
//     },
//   });

//   // Email options
//   const mailOptions = {
//     from: "hi.hamza.dev@gmail.com",
//     to: email,
//     subject: "Your Calorie and Macros Report",
//     text: "Please find attached your report.",
//     attachments: [
//       {
//         filename: file.originalname,
//         path: path.join(__dirname, file.path),
//       },
//     ],
//   };

//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       return res.status(500).send("Error sending email");
//     }

//     // Remove the file after sending
//     fs.unlinkSync(file.path);

//     res.send("Email sent successfully!");
//   });
// });

// Log QR Code scan
app.post("/api/scan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ip = requestIp.getClientIp(req);
    console.log(ip);
    const userAgent = req.headers["user-agent"];
    const scanDate = new Date();

    // Get geolocation
    const geo = geoip.lookup(ip);
    const country = geo ? geo.country : "Unknown";
    const city = geo ? geo.city : "Unknown";

    // Get MAC address (Note: This may not work in all environments)
    const macAddress = await new Promise((resolve) => {
      macaddress.one((err, mac) => {
        resolve(mac || "Unknown");
      });
    });

    // // Log scan to database
    // await sql.query`
    //   INSERT INTO QRScans (QRCodeId, ScanDate, Device, Country, City, MacAddress)
    //   VALUES (${id}, ${scanDate}, ${userAgent}, ${country}, ${city}, ${macAddress})
    // `;

    // // Get redirect URL
    // const result =
    //   await sql.query`SELECT RedirectUrl FROM QRCodes WHERE Id = ${id}`;
    // const redirectUrl = result.recordset[0].RedirectUrl;
    console.log(
      "Id",
      id,
      "\n",
      "ip:",
      ip,
      "\n useragent:",
      userAgent,
      "\n scanDate",
      scanDate,
      "\n geo",
      country,
      city,
      macAddress
    );
    res.json({
      message: "success",
      // data: {
      //   req,
      //   ip,
      //   macAddress,
      //   // geo: JSON.stringify(geo),
      //   scanDate,
      //   userAgent,
      // },
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
