import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css"; // Ensure styles are correctly imported

const Navbar = ({ isSticky, handleLogout }) => {
  return (
    <header className={`header ${isSticky ? "sticky" : ""}`}>
      <div className="navbar">
        <div className="logo-container">
          <h2 className="logo">DeepMind</h2>
          <p className="header-tagline">Detect Deepfakes with Unmatched Accuracy </p>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <a href="#">Pricing</a>
          <a href="#">About</a>
          <Link to="/dashboard">Dashboard</Link> {/* Link to Dashboard */}
          <a href="#">Contact</a>
          <a onClick={handleLogout} className="login-button">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
