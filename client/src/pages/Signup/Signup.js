import SigninSignupLeft from "../../components/SigninSignupLeft/SigninSignupLeft";
import SignupRight from "../../components/SignupRight/SignupRight";

import "./Signup.css";

export default function Signup() {
  const header = "9oktas.com Sitesine Hoşgeldiniz";
  const paragraphs = [
    "Notlarınızı güvenle saklayabilmek için en ideal web sitesi.",
    "Şimdi üye olun ve notlarınızı 9oktas farkıyla saklamaya başlayın.",
    "Zaten bir hesabın var mı ?",
  ];

  return (
    <div className="sign-up-container">
      <div className="sign-up-left">
        <SigninSignupLeft
          header={header}
          paragraphs={paragraphs}
          btnText="GİRİŞ YAP"
          btnLinksTo="signin"
        />
      </div>
      <div className="sign-up-right">
        <SignupRight />
      </div>
    </div>
  );
}
