import { useState } from "react";
import "./ReadFullPopUp.css";

export default function PopUp({ ClosePopUp, baslik, text }) {
  const [aciklama, setAciklama] = useState("");
  const [aciklamaError, setAciklamaError] = useState("");

  return (
    <div className="popup-wrapper">
      <div className="close-btn-wrapper">
        <button onClick={() => ClosePopUp(false)} className="close-btn">
          x
        </button>
      </div>
      <div className="popup-bottom">
        <h2>{baslik}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}
