import React from "react";
import { Link } from "react-router-dom";

function LandingPagescreen() {
  return (
    <div className="row landing justify-content-center">
      <div
        className="col-md-9 my-auto text-center"
        style={{ borderRight: "8px solid white" }}
      >
        <h2 style={{ color: "white", fontSize: "130px" }}>SheyRooms</h2>
        <h1 style={{ color: "white" }}>There is only one Boss. The Guest</h1>

        <Link to="/home">
          <button
            className="landing-btn"
            style={{ color: "black", background: "white" }}
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPagescreen;