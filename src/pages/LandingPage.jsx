import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Header */}
      <div className="position-absolute top-0 start-0 p-3 p-md-4 p-lg-5">
        <h1
          style={{
            maxWidth: "150px",
            color: "#1FC17B",
            fontFamily: "Playwrite AU QLD Guides",
            fontWeight: 600,
            fontSize: "52px",
          }}
        >
          iFund
        </h1>
      </div>

      {/* Main Content */}
      <div className="container h-100 d-flex align-items-center justify-content-center">
        <div className="row align-items-center w-100">
          {/* Left Column: Text */}
          <div className="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
            <h1 className="display-5 fw-bold">Save Together, Prosper Together.</h1>
            <p className="lead text-muted">
              Simplify your savings journey with individual and community accounts, goal tracking, and flexible loans.
            </p>
            <button
              onClick={handleGetStarted}
              className="btn d-inline-flex align-items-center"
              style={{
                backgroundColor: "#1FC17B",
                color: "#fff",
                fontSize: "18px",
                padding: "12px 24px",
                border: "none",
                borderRadius: "99px",
              }}
            >
              Get Started <i className="bi bi-arrow-up-right ms-2" />
            </button>
          </div>

          {/* Right Column: Image */}
          <div className="col-12 col-md-6 text-center">
            <img
              src="./landing.png"
              alt="Savings Illustration"
              className="img-fluid w-100"
              style={{ maxWidth: "600px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
