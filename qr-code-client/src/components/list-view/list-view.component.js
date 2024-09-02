import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import axios from "axios";

const ListView = () => {
  let qrCode = {
    redirectUrl: "http://localhost:5000/api/scan/5",
    title: "Test QR code",
    squareColor: "black",
    eyeColor: "white",
  };
  useEffect(() => {
    axios
      .post(qrCode.redirectUrl)
      .then((result) => {
        console.log("result", result);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);
  return (
    <div>
      <h1>{qrCode.title}</h1>
      <QRCode
        title={"Access Data"}
        value={qrCode.redirectUrl}
        size={128}
        bgColor={qrCode.squareColor}
        fgColor={qrCode.eyeColor}
      />
    </div>
  );
};

export default ListView;
