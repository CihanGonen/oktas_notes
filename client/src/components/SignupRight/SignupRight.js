import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import FormInput from "../FormInput/FormInput";
import CustomButton from "../CustomButton/CustomButton";

import "./SignupRight.css";

export default function SigninSignupRight() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const [cancel, setCancel] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useAuthContext();

  useEffect(() => {
    // unmount operations
    return () => {
      setCancel(true);
    };
  }, []);

  const onSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    if (!email || !password) {
      setSignupError("Lütfen tüm alanları doldurunuz");
      return;
    }
    const signupValues = { email, password };
    try {
      fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupValues),
      }).then((res) => {
        if (cancel) return;
        res.json().then((userInfos) => {
          if (cancel) return;
          if (userInfos.token) {
            localStorage.setItem("token", userInfos.token);
            dispatch({ type: "LOGIN", payload: userInfos.user });
            navigate("/");
          } else {
            console.log(userInfos);
            setSignupError(userInfos);
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
    <div className="sign-up-wrapper">
      <div className="sign-up-sub-wrapper">
        <h2 className="title">Kayıt Ol</h2>
        <div
          className="cizgi"
          style={{ background: "#00a2ff", width: "21%" }}
        ></div>
        <form onSubmit={onSignupSubmit}>
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
            handleChange={(e) => setPassword(e.target.value)}
            label="Şifre"
            required
          />

          <CustomButton type="submit">KAYIT OL</CustomButton>

          {signupError && (
            <p style={{ marginTop: "1rem", color: "red", fontSize: "16px" }}>
              {signupError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}