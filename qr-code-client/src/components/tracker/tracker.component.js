import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { baseUrl, clientUrl } from "../../constants/api";

const Tracker = () => {
  const [currentQr, setCurrentQr] = useState();
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(params?.id);

    const fetchQRCodes = async () => {
      const response = await fetch(`${baseUrl}/api/qrcodes`);
      const data = await response.json();
      let currentQr_ = data?.find((x) => x.id === params?.id);
      setCurrentQr(currentQr_);
      axios
        .post(`${baseUrl}/api/scan/${params?.id}`)
        .then((result) => {
          console.log("result", result, window.location, currentQr_);
          //   navigate(`https://${currentQr_.redirectUrl}`);
          window.open(`https://${currentQr_.redirectUrl}`);
        })
        .catch((err) => {
          console.log("error", err);
        });
    };
    fetchQRCodes();
  }, []);
  return (
    <div>
      {currentQr && (
        <div key={currentQr?.id}>
          <QRCode
            value={`${clientUrl}/track/${currentQr?.id}`}
            size={258}
            fgColor={currentQr.squareColor}
            eyeColor={currentQr.eyeColor}
          />
          <p>ID: {currentQr.id}</p>
          <p>Redirecting to {currentQr.redirectUrl}</p>
          <hr />
        </div>
      )}
    </div>
  );
};

export default Tracker;
