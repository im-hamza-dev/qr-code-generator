import React from "react";
import QRCode from "react-qr-code";

const ListView = () => {
  let qrCode = {
    redirectUrl: "www.shapepowered.com",
    title: "Test QR code",
    squareColor: "black",
    eyeColor: "white",
  };
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
