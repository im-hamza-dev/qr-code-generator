import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { baseUrl, clientUrl } from "../../constants/api";

let localUrl = "http://localhost:5000/api/scan/5";
let prodUrl = "https://qr-code-generator-v2-api.vercel.app/api/scan/5";

const ListView = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [qrScans, setQrScans] = useState([]);

  useEffect(() => {
    const fetchQRCodes = async () => {
      const response = await fetch(`${baseUrl}/api/qrcodes`);
      const data = await response.json();
      setQrCodes(data);
    };
    fetchQRCodes();
    const fetchQRScans = async () => {
      const response = await fetch(`${baseUrl}/api/qrscans`);
      const data = await response.json();
      setQrScans(data);
    };
    fetchQRCodes();
    fetchQRScans();
  }, []);

  return (
    <div>
      <h2>All QR Codes</h2>
      {qrCodes.map((qrCode) => (
        <div key={qrCode.Id}>
          <QRCode
            value={`${clientUrl}/track/${qrCode.Id}`}
            size={258}
            fgColor={qrCode.SquareColor}
            eyeColor={qrCode.EyeColor}
          />
          <p>ID: {qrCode.Id}</p>
          <p>QR Code Id: {qrCode.QRCodeId}</p>
          <p>Redirect URL: {qrCode.RedirectUrl}</p>
          {qrScans && (
            <>
              <hr />
              <div>
                {qrScans?.map((x) =>
                  x.QRCodeId == qrCode.Id ? (
                    <div>
                      <div>
                        Country: {x.Country}, {x.City}
                      </div>
                      <div>Timestamp: {x.ScanDateTime}</div>
                      <div>MacAddress: {x.MacAddress}</div>
                      <div>Agent: {x.DeviceDetails}</div>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ListView;
