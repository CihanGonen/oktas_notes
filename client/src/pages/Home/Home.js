import "./Home.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import CustomButton from "../../components/CustomButton/CustomButton";
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
      {<div className="profile-card">
      <form>
           <FormInput placeholder="yeni şifre"/>
            <FormInput placeholder="yeni şifre tekrar"/>
            <CustomButton type="submit">Onayla</CustomButton>
            <CustomButton type="submit">Hesabımı sil</CustomButton>
          </form>
          </div>
          /*  <div className="cardhome">
          <button onClick={logout}>logout</button>
          <label>not ekle : </label>
          <div>
            <textarea className="textarea" rows="21" />
          </div>
          <CustomButton type="submit">Kaydet</CustomButton>
          <div className="click">
            <span className="fa fa-star-o"></span>
            <div className="ring"></div>
            <div className="ring2"></div>
          </div>
        </div>*/}
      </div>
  
      <div className="home-right">
        <div className="cards">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}
