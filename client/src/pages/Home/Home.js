import "./Home.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const { user, dispatch } = useAuthContext();

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

  return (
    <div className="home-container">
      <div className="home-left">
        <div className="cardhome">
          <button onClick={logout}>logout</button>
          <label>not ekle : </label>
          <div>
            <textarea className="textarea" rows="18" />
          </div>
          <input className="button" type="submit" value="Submit" />
          <div class="click">
            <span class="fa fa-star-o"></span>
            <div class="ring"></div>
            <div class="ring2"></div>
          </div>
        </div>
      </div>
      <div className="home-right">
        <div class="cards">
          <div class="card">
            <div class="content">
              <h1>Ace of Cups</h1>
              <p>
                The cup represents the vessel of your subconscious mind; the
                five streams are your five senses and the abundant emotion and
                intuition flowing from within you.
              </p>
              <a href="">Read full</a>
              <h4 class="card-time">01.03.2022</h4>
            </div>
          </div>
          <div class="card">
            <div class="content">
              <h1>Ace of Cups</h1>
              <p>
                The cup represents the vessel of your subconscious mind; the
                five streams are your five senses and the abundant emotion and
                intuition flowing from within you. The cup represents the vessel
                of your subconscious mind; the five streams are your five senses
                and the abundant emotion and intuition flowing from within you.
                The cup represents the vessel of your subconscious mind; the
                five streams are your five senses and the abundant emotion and
                intuition flowing from within you.
              </p>
              <h4>01.03.2022</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
