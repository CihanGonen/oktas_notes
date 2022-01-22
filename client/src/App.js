import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import { useEffect } from "react";

import "./App.css";

function App() {
  const { user, authIsReady, dispatch } = useAuthContext();

  const checkAuthenticated = async () => {
    const token = localStorage.token;
    if (token) {
      try {
        const res = await fetch("http://localhost:5000/verifyUser", {
          method: "POST",
          headers: { token },
        });

        const parseRes = await res.json();
        if (parseRes) {
          dispatch({ type: "AUTH_IS_READY", payload: parseRes.user });
        } else {
          dispatch({ type: "AUTH_IS_READY", payload: null });
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      dispatch({ type: "AUTH_IS_READY", payload: null });
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
          
            <Route
              path="/signup"
              element={user ? <Navigate replace to="/" /> : <Signup />}
            />
            <Route
              path="/signin"
              element={user ? <Navigate replace to="/" /> : <Signin />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
