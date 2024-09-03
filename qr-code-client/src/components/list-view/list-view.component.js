import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";

let localUrl = "http://localhost:5000/api/scan/5";
let prodUrl = "https://qr-code-generator-v2-api.vercel.app/api/scan/5";

const ListView = () => {
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    const fetchQRCodes = async () => {
      const response = await fetch("http://localhost:5000/api/qrcodes");
      const data = await response.json();
      setQrCodes(data);
    };
    fetchQRCodes();
  }, []);

  return (
    <div>
      <h2>All QR Codes</h2>
      {qrCodes.map((qrCode) => (
        <div key={qrCode.id}>
          <QRCode
            value={`http://localhost:3000/track/${qrCode.id}`}
            size={258}
            fgColor={qrCode.squareColor}
            eyeColor={qrCode.eyeColor}
          />
          <p>ID: {qrCode.id}</p>
          <p>Redirect URL: {qrCode.redirectUrl}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ListView;
