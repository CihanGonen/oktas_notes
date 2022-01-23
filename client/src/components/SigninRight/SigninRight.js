import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useVerifCode } from "../../hooks/useVerifCode";

import FormInput from "../FormInput/FormInput";
import CustomButton from "../CustomButton/CustomButton";

import "./SigninRight.css";

export default function SigninSignupRight() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [verifCode, setVerifCode] = useState("");
  const [pending, setPending] = useState(false);

  const [cancel, setCancel] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useAuthContext();
  const { generateAndSendCode, isSent, setIsSent, sentCode } = useVerifCode();

  useEffect(() => {
    // unmount operations
    return () => {
      setCancel(true);
    };
  }, []);

  const onLoginSubmit = async () => {
    setLoginError("");
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

  const checkInformations = async () => {
    const signupValues = { email, password };
    try {
      let res = await fetch("http://localhost:5000/check_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupValues),
      });
      let result = await res.json();
      return result;
    } catch (err) {
      console.log("buradan yazıldı");
      console.log(err.message);
    }
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!email || !password) {
      setLoginError("Lütfen tüm alanları doldurunuz");
      return;
    }
    let result = await checkInformations();
    if (result.err) {
      setLoginError(result.err);
    } else if (result.okey === true) {
      setPending(true);
      generateAndSendCode(email);
    }
  };

  const checkCode = async (verifCode) => {
    if (verifCode === sentCode) {
      onLoginSubmit();
      setPending(false);
    } else {
      setLoginError("Wrong Code");
      setIsSent(false);
      setPending(false);
      navigate("/signin");
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    checkCode(verifCode);
    setVerifCode("");
  };

  return (
    <div className="sign-in-wrapper">
      {isSent ? (
        <div className="code-form">
          <form onSubmit={handleCodeSubmit}>
            <FormInput
              type="number"
              name="verifcode"
              value={verifCode}
              handleChange={(e) => setVerifCode(e.target.value)}
              label="Doğrulama Kodu"
              required
            />
            <CustomButton type="submit">Onayla</CustomButton>
          </form>
        </div>
      ) : (
        <div className="sign-in-sub-wrapper">
          <h2 className="title">Giriş Yap</h2>
          <div
            className="cizgi"
            style={{ background: "#00a2ff", width: "21%" }}
          ></div>
          <form onSubmit={sendCode}>
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

            {pending ? (
              <CustomButton disabled={true} type="submit">
                loading...
              </CustomButton>
            ) : (
              <CustomButton type="submit">Giriş Yap</CustomButton>
            )}

            {loginError && (
              <p style={{ marginTop: "1rem", color: "red", fontSize: "16px" }}>
                {loginError}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
