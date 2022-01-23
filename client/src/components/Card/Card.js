import "./Card.css";

import ReadFullPopUp from "../ReadFullPopUp/ReadFullPopUp";
import { useState } from "react";

export default function Card({ note }) {
  const [showReadFull, setShowReadFull] = useState(false);

  const getDate = (dateObj) => {
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    return day + "." + month + "." + year;
  };

  return (
    <div style={{ width: "40%", margin: "0 auto" }}>
      {showReadFull && (
        <ReadFullPopUp
          ClosePopUp={setShowReadFull}
          baslik={note.baslik}
          text={note.icerik}
        />
      )}
      <div className="card">
        <div className="noteContent">
          <h4>{note.baslik}</h4>
          <div>
            <p>
              {note.icerik.length > 100
                ? note.icerik.substring(0, 100) + "..."
                : note.icerik}
            </p>
            <h5
              onClick={() => setShowReadFull(true)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Read full
            </h5>
          </div>
          <h6 className="card-time">{getDate(new Date(note.created_at))}</h6>
        </div>
      </div>
    </div>
  );
}
