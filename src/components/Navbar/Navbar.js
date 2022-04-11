import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// import hooks
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

// styles & images
import "./navbar.css";
import Temple from "../../assets/temple.svg";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const [theme, setTheme] = useState("light-theme");

  const toggleTheme = () => {
    if (theme === "light-theme") {
      setTheme("dark-theme");
    } else {
      setTheme("light-theme");
    }
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <Link to={"/"}>
            <img src={Temple} alt="dojo logo" />
          </Link>
          <span>The Dojo</span>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
        {user && (
          <>
            <li>hello, {user.displayName}</li>
            <li>
              {!isPending && (
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              )}
              {isPending && (
                <button className="btn" disabled onClick={logout}>
                  Logging Out...
                </button>
              )}
            </li>
          </>
        )}
        <li>
          <button className="toggle-btn" onClick={toggleTheme}>
            Toggle
          </button>
        </li>
      </ul>
    </div>
  );
}
