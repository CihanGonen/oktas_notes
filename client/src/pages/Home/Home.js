import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
export default function Home() {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      navigate("/signin");
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <div>
      {user && (
        <button className="btn" onClick={logout}>
          Log out
        </button>
      )}
    </div>
  );
}
