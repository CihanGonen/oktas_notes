import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";

import FormInput from "../FormInput/FormInput";
import CustomButton from "../CustomButton/CustomButton";

import "./SigninRight.css";

export default function SigninSignupRight() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [cancel, setCancel] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useAuthContext();

  useEffect(() => {
    // unmount operations
    return () => {
      setCancel(true);
    };
  }, []);

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!email || !password) {
      setLoginError("Lütfen tüm alanları doldurunuz");
      return;
    }
    const loginValues = { email, password };
    try {
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginValues),
      }).then((res) => {
        if (cancel) return;
        res.json().then((userInfos) => {
          if (cancel) return;
          if (userInfos.token) {
            localStorage.setItem("token", userInfos.token);
            dispatch({ type: "LOGIN", payload: userInfos.user });
            navigate("/");
          } else {
            setLoginError(userInfos);
          }
        });
      });
    } catch (err) {
      console.log("buradan yazıldı");
    }
    setPassword("");
    setEmail("");
  };

  return (
    <div className="sign-in-wrapper">
      <div className="sign-in-sub-wrapper">
        <h2 className="title">Giriş Yap</h2>
        <div
          className="cizgi"
          style={{ background: "#00a2ff", width: "21%" }}
        ></div>
        <form onSubmit={onLoginSubmit}>
          <FormInput
            name="email"
            type="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
            label="Email"
            required
          />
          <FormInput
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Şifre"
            required
          />

          <CustomButton type="submit">GİRİŞ YAP</CustomButton>

          {loginError && (
            <p style={{ marginTop: "1rem", color: "red", fontSize: "16px" }}>
              {loginError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
