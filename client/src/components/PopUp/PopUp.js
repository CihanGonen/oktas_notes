import { useState } from "react";
import "./PopUp.css";

export default function PopUp({ ClosePopUp, onButtonClick }) {
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
        <h3>İşleme devam etmek istiyor musunuz?</h3>
        <button
          style={{
            padding: "1rem 2rem",
            outline: "none",
            border: "1px",
            backgroundColor: "red",
            color: "white",
            cursor: "pointer",
          }}
          onClick={onButtonClick}
        >
          Evet
        </button>
      </div>
    </div>
  );
}
