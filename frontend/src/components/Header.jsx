import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <header style={{
      background: "var(--surface-color)",
      borderBottom: "1px solid var(--border-color)",
      padding: "1rem 0",
      marginBottom: "2rem"
    }}>
      <nav className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🔗</span> URL Shortener
        </Link>

        <div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>
                Hello, <strong style={{ color: "var(--text-primary)" }}>{user.username}</strong>
              </span>
              <button
                onClick={logoutUser}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
