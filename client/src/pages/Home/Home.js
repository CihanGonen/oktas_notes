import "./Home.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import Card from "../../components/Card/Card";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, dispatch } = useAuthContext();
  const [leftSide, setLeftSide] = useState("addnote");
  const [baslik, setBaslik] = useState("");
  const [not, setNot] = useState("");
  const [notError, setNotError] = useState("");
  const [notesPending, setNotesPending] = useState(false);
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      navigate("/signin");
    } catch (err) {
      console.error(err.message);
    }
  };

  const onNotSubmit = async (e) => {
    e.preventDefault();
    setNotError("");
    const userId = user.user_id;
    if (!baslik || !not) {
      setNotError("Lütfen iki alanı da doldurunuz");
      return;
    }
    const notValues = { baslik, not, userId };
    try {
      let res = await fetch("http://localhost:5000/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notValues),
      });
      let result = await res.json();
      if (result.notExists) {
        setNotError(
          "Bu başlıkta not bulunmakta lütfen başka bir başlık giriniz."
        );
      } else {
        fetchNotes();
      }
    } catch (err) {
      console.log("buradan yazıldı");
      console.log(err.message);
    }
    setNot("");
    setBaslik("");
  };

  const fetchNotes = async () => {
    setNotesPending(true);
    const user_id = user.user_id;
    try {
      let res = await fetch(`http://localhost:5000/note/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let result = await res.json();
      setNotes(result);
      setNotesPending(false);
    } catch (err) {
      console.log("buradan yazıldı");
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="home-container">
      <div className="home-left">
        <div className="navbar">
          <button onClick={logout}>Log out</button>

          <button
            style={{
              backgroundColor: leftSide === "profile" ? "#ffebb3" : "white",
            }}
            onClick={() => {
              setLeftSide("profile");
            }}
          >
            Profile
          </button>

          <button
            style={{
              backgroundColor: leftSide === "addnote" ? "#ffebb3" : "white",
            }}
            onClick={() => {
              setLeftSide("addnote");
            }}
          >
            Add note
          </button>
        </div>
        {leftSide === "profile" ? (
          <ProfileCard />
        ) : (
          <div className="cardhome">
            <h3 style={{ textAlign: "center" }}>Not Ekle</h3>
            <form onSubmit={onNotSubmit}>
              <label>
                başlık:
                <input
                  className="header-input"
                  value={baslik}
                  onChange={(e) => {
                    setBaslik(e.target.value);
                  }}
                  type="text"
                />
              </label>
              <label style={{ marginTop: "1rem" }}>
                not:
                <textarea
                  style={{ padding: "0.5rem" }}
                  className="textarea"
                  value={not}
                  onChange={(e) => {
                    setNot(e.target.value);
                  }}
                  rows="18"
                />
              </label>
              {notError && (
                <p
                  style={{ marginTop: "1rem", color: "red", fontSize: "16px" }}
                >
                  {notError}
                </p>
              )}
              <CustomButton style={{ marginTop: "1rem" }} type="submit">
                Kaydet
              </CustomButton>
            </form>
          </div>
        )}
      </div>

      <div className="home-right">
        {notesPending ? (
          <h2>yükleniyor...</h2>
        ) : notes.length < 1 ? (
          <h2>not bulunamadı</h2>
        ) : (
          <div className="cards">
            {notes.map((note) => (
              <Card key={note.baslik} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
