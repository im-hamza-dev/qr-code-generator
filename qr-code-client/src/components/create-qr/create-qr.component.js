import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "./create-qr.scss";
import { useNavigate } from "react-router-dom";

const CreateQR = () => {
  const [id, setId] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [squareColor, setSquareColor] = useState("#000000");
  const [eyeColor, setEyeColor] = useState("#000000");
  const [qrCode, setQrCode] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/qrcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, redirectUrl, squareColor, eyeColor }),
    });
    const data = await response.json();
    console.log(data);
    setQrCode(true);
  };

  return (
    <div className="create-wrapper">
      <h2>Create QR Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
        />
        <input
          type="text"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
          placeholder="Redirect URL"
        />
        <input
          type="color"
          value={squareColor}
          onChange={(e) => setSquareColor(e.target.value)}
        />
        <input
          type="color"
          value={eyeColor}
          onChange={(e) => setEyeColor(e.target.value)}
        />
        <button type="submit">Generate QR Code</button>
      </form>
      <br />
      <button
        onClick={() => {
          navigate("/list");
        }}
      >
        View All
      </button>
      <br />
      {qrCode && (
        <QRCode
          value={redirectUrl}
          size={256}
          fgColor={squareColor}
          eyeColor={eyeColor}
        />
      )}
    </div>
  );
};

export default CreateQR;
