import "./Home.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

import Card from "../Card/Card";

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
          <div className="click">
            <span className="fa fa-star-o"></span>
            <div className="ring"></div>
            <div className="ring2"></div>
          </div>
        </div>
      </div>
      <div className="home-right">
        <div className="cards">
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}
