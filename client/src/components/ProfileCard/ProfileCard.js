import React, { useEffect, useState } from "react";
import FormInput from "../../components/FormInput/FormInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import PopUp from "../PopUp/PopUp";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import UserIcon from "../../user.png";

import "./ProfileCard.css";

export default function ProfileCard() {
  const { user, dispatch } = useAuthContext();
  const [cancel, setCancel] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPasss] = useState("");
  const [changePassError, setChangePassError] = useState("");

  const [showHesapKapatPopUp, setShowHesapKapatPopUp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // unmount operations
    return () => {
      setCancel(true);
    };
  }, []);

  const onPasswordChange = (e) => {
    e.preventDefault();
    setChangePassError("");
    const changePassValues = { email: user.email, oldPass, newPass };
    try {
      fetch("http://localhost:5000/change_pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changePassValues),
      }).then((res) => {
        if (cancel) return;
        res.json().then((result) => {
          if (cancel) return;
          if (result.err) {
            setChangePassError(result.err);
          } else {
            setChangePassError("");
            setOldPass("");
            setNewPasss("");
            window.location.reload();
          }
        });
      });
    } catch (err) {
      console.log("buradan yazıldı");
    }
  };

  const deleteAccount = async () => {
    try {
      const deletedAcc = await fetch(
        `http://localhost:5000/account_delete/${user.user_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      navigate("/signin");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="profile-card">
      {showHesapKapatPopUp && (
        <PopUp
          ClosePopUp={setShowHesapKapatPopUp}
          onButtonClick={deleteAccount}
        />
      )}
      <div className="user">
        <img width="50px" src={UserIcon} alt="userIcon" />
        <p style={{ fontSize: "18px" }}>{user.email}</p>
      </div>
      <form onSubmit={onPasswordChange}>
        <FormInput
          type="password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          placeholder="eski şifre"
        />
        <FormInput
          type="password"
          value={newPass}
          onChange={(e) => setNewPasss(e.target.value)}
          placeholder="yeni şifre"
        />
        {changePassError && (
          <p style={{ marginTop: "1rem", color: "red", fontSize: "16px" }}>
            {changePassError}
          </p>
        )}
        <div className="user-buttons">
          <CustomButton type="submit">Şifreyi Değiştir</CustomButton>
        </div>
      </form>
      <CustomButton
        onClick={() => setShowHesapKapatPopUp(true)}
        style={{ backgroundColor: "red", width: "100%", marginTop: "1rem" }}
        type="submit"
      >
        Hesabımı sil
      </CustomButton>
    </div>
  );
}
