import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useVerifCode } from "../../hooks/useVerifCode";

import FormInput from "../FormInput/FormInput";
import CustomButton from "../CustomButton/CustomButton";

import "./SignupRight.css";

export default function SigninSignupRight() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");
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

  const onSignupSubmit = async () => {
    setSignupError("");
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
    setEmail("");
    setPassword("");
  };

  const checkInformations = async () => {
    const signupValues = { email, password };
    try {
      let res = await fetch("http://localhost:5000/check_signup", {
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
    setSignupError("");
    if (!email || !password) {
      setSignupError("Lütfen tüm alanları doldurunuz");
      return;
    }
    let result = await checkInformations();
    if (result.err) {
      setSignupError(result.err);
    } else if (result.emailExists === true) {
      setSignupError("This email exists");
    } else {
      setPending(true);
      generateAndSendCode(email);
    }
  };

  const checkCode = async (verifCode, displayName) => {
    if (verifCode === sentCode) {
      onSignupSubmit();
      setPending(false);
    } else {
      setSignupError("Wrong Code");
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
    <div className="sign-up-wrapper">
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
        <div className="sign-up-sub-wrapper">
          <h2 className="title">Kayıt Ol</h2>
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
              handleChange={(e) => setPassword(e.target.value)}
              label="Şifre"
              required
            />

            {pending ? (
              <CustomButton disabled={true} type="submit">
                loading...
              </CustomButton>
            ) : (
              <CustomButton type="submit">Kayıt Ol</CustomButton>
            )}

            {signupError && (
              <p style={{ marginTop: "1rem", color: "red", fontSize: "16px" }}>
                {signupError}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
