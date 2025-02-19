import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    text: "iFund has made saving so easy for me. The group feature has helped me stay consistent, and I love how transparent everything is.",
    image: "./female.jpeg",
    name: "Sarah O.",
  },
  {
    text: "I love how easy it is to track my savings goals. The interface is simple, and I can withdraw my money anytime without stress.",
    image: "./male.jpeg",
    name: "James D.",
  },
  {
    text: "Community savings on iFund have helped me and my friends reach our financial goals faster. It's a game-changer!",
    image: "./female.jpeg",
    name: "Anita K.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="container-fluid p-0">
{/* Background Wrapper */}
<div
  style={{
    background: "linear-gradient(135deg, #ECF0F3, #ffffff)",
    minHeight: "100vh",
    paddingBottom: "50px",
  }}
>
  {/* Navigation Bar */}
  <nav
    className="navbar navbar-expand-lg navbar-light py-3 px-4 w-100"
    style={{
      backgroundColor: "transparent", /* Transparent by default */
    }}
  >
    <div className="container">
      {/* Brand Label for Mobile */}
      <a className="navbar-brand fw-bold fs-3 text-success" href="#">
        iFund
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse d-flex justify-content-between w-100">
      {/* Add data-bs-dismiss="offcanvas" to each link to close the nav on click */}
      <ul className="navbar-nav d-none d-lg-flex mx-auto">
        <li className="nav-item">
          <a className="nav-link" href="#features">
            Features
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#testimonials">
            Testimonials
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#how-it-works" >
            About
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#need-help" data-bs-dismiss="offcanvas">
            FAQs
          </a>
        </li>
      </ul>
      <div className="d-none d-lg-flex ms-auto">
        <button
          className="btn btn-outline-success me-2 rounded-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn btn-success rounded-pill px-4"
          onClick={() => navigate("/register/step-1")}
        >
          Sign Up
        </button>
      </div>
    </div>
    </div>
  </nav>

  {/* Offcanvas Navigation (for mobile) */}
  <div
    className="offcanvas offcanvas-start"
    tabIndex="-1"
    id="offcanvasNavbar"
    aria-labelledby="offcanvasNavbarLabel"
    style={{
      width: "100%", /* 90% width of the screen */
    }}
  >
    <div className="offcanvas-header">
      {/* Make the mobile label a clickable link with same styling as desktop */}
      <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
        <a className="navbar-brand fw-bold fs-3 text-success" data-bs-dismiss="offcanvas" href="#features">
          iFund
        </a>
      </h5>
      <button
        type="button"
        className="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div className="offcanvas-body">
      {/* Add data-bs-dismiss="offcanvas" to each link to close the nav on click */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a data-bs-dismiss="offcanvas" className="nav-link" href="#features">
            Features
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#testimonials">
            Testimonials
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#how-it-works">
            About
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#need-help">
            FAQs
          </a>
        </li>
      </ul>
      <div className="d-flex flex-column">
        <button
          className="btn btn-outline-success me-2 rounded-pill px-3 mb-2"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn btn-success rounded-pill px-4"
          onClick={() => navigate("/register/step-1")}
        >
          Sign Up
        </button>
      </div>
    </div>
  </div>

  {/* Hero Section */}
  <div
    className="container text-center text-md-start py-5 d-flex align-items-center"
    style={{ minHeight: "100vh" }}
  >
    <div className="row align-items-center w-100">
      {/* Left Content */}
      <div className="col-md-6" data-aos="fade-right">
        <h1 className="display-4 fw-bold text-dark">
          Save Together,{" "}
          <span className="text-success">Prosper Together.</span>
        </h1>
        <p className="lead text-muted">
          Manage savings effortlessly with individual & community accounts,
          goal tracking, and flexible loans.
        </p>
        <button
          onClick={() => navigate("/register/step-1")}
          className="btn btn-success rounded-pill px-4 py-2 mt-3"
        >
          Get Started <i className="bi bi-arrow-up-right ms-2" />
        </button>
      </div>

      {/* Right Image (Centered) */}
      <div className="col-md-6 text-center" data-aos="fade-left">
        <img
          src="./landing.png"
          alt="Savings"
          className="img-fluid"
          style={{
            maxWidth: "500px",
            animation: "float 4s ease-in-out infinite",
            width: "100%" /* Ensuring image adjusts to screen size */,
            height: "auto",
          }}
        />
      </div>
    </div>
  </div>
</div>

{/* Floating Animation */}
<style>
  {`
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @media (max-width: 768px) {
      .offcanvas-start {
        width: 100%; /* 90% width for mobile */
      }
    }
  `}
</style>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center">Why Choose iFund?</h2>
          <p className="text-muted text-center">
            Discover the key benefits of our platform.
          </p>
          <div className="row mt-4">
            <div className="col-md-4" data-aos="fade-up">
              <div className="card shadow-sm p-4 text-start">
                <i className="bi bi-bar-chart fs-1 text-success"></i>
                <h5 className="fw-bold mt-3">Smart Goal Tracking</h5>
                <p>Set and achieve financial goals with automated tracking.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card shadow-sm p-4 text-start">
                <i className="bi bi-people fs-1 text-success"></i>
                <h5 className="fw-bold mt-3">Community Savings</h5>
                <p>Join savings groups to grow wealth together.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
              <div className="card shadow-sm p-4 text-start">
                <i className="bi bi-cash-stack fs-1 text-success"></i>
                <h5 className="fw-bold mt-3">Flexible Withdrawals</h5>
                <p>Withdraw your savings anytime with ease.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="py-5"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <div className="container">
          <h2 className="text-center fw-bold mb-5" data-aos="fade-up">
            What Our Users Say
          </h2>

          <div className="row">
            {/* Left: Testimonials */}
            <div className="col-md-8 position-relative">
              <div
                className="p-4 bg-white shadow rounded"
                data-aos="fade-right"
              >
                <p className="fs-5 text-dark">
                  {testimonials[activeIndex].text}
                </p>
                <div className="text-center mt-3">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={`User ${activeIndex + 1}`}
                    className="rounded-circle"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <h5 className="fw-bold mt-2">
                    {testimonials[activeIndex].name}
                  </h5>
                </div>
              </div>

              {/* Dots (Bottom Left) & Arrows (Bottom Right) */}
              <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                {/* Dots */}
                <div className="d-flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${activeIndex === index ? "active" : ""}`}
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="d-flex gap-2">
                  <button className="custom-arrow" onClick={prevSlide}>
                    <i className="bi bi-arrow-left"></i>
                  </button>
                  <button className="custom-arrow" onClick={nextSlide}>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Stats */}
            <div
              className="col-md-4 d-flex flex-column justify-content-center text-center text-md-start"
              data-aos="fade-left"
            >
              <h3 className="fw-bold text-success">95%+</h3>
              <p className="text-muted">Users achieve their savings goals.</p>
              <h3 className="fw-bold text-success">90%+</h3>
              <p className="text-muted">Users find the platform easy to use.</p>
              <h3 className="fw-bold text-success">85%+</h3>
              <p className="text-muted">Users recommend iFund to friends.</p>
            </div>
          </div>
        </div>

        {/* Custom CSS */}
        <style>{`
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #ccc;
            border: none;
            transition: background-color 0.3s ease-in-out;
            cursor: pointer;
          }

          .dot.active {
            background-color: #28a745;
          }

          .custom-arrow {
            background: none;
            border: none;
            font-size: 20px;
            color: #333;
            cursor: pointer;
            transition: color 0.3s ease-in-out;
            padding: 5px;
          }

          .custom-arrow:hover {
            color: #28a745;
          }
        `}</style>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4" data-aos="fade-up">
            How it Works
          </h2>

          <div className="row g-4">
            {/* Step 1 */}
            <div className="col-12 col-md-6">
              <div
                className="p-4 rounded d-flex align-items-center flex-column flex-md-row"
                style={{ backgroundColor: "#e3f2fd" }}
                data-aos="fade-right"
              >
                <img
                  src="./signup.jpeg"
                  alt="Sign Up"
                  className="img-fluid rounded mb-3 mb-md-0 me-md-3"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <div className="text-center text-md-start">
                  <h5 className="fw-bold">Sign Up</h5>
                  <p className="text-muted">
                    Create a free iFund account and set up your savings profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-12 col-md-6">
              <div
                className="p-4 rounded d-flex align-items-center flex-column flex-md-row"
                style={{ backgroundColor: "#e8f5e9" }}
                data-aos="fade-left"
              >
                <img
                  src="./saving.jpeg"
                  alt="Start Saving"
                  className="img-fluid rounded mb-3 mb-md-0 me-md-3"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <div className="text-center text-md-start">
                  <h5 className="fw-bold">Start Saving</h5>
                  <p className="text-muted">
                    Set savings goals, contribute funds, and track your
                    progress.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-12 col-md-6">
              <div
                className="p-4 rounded d-flex align-items-center flex-column flex-md-row"
                style={{ backgroundColor: "#fbe9e7" }}
                data-aos="fade-right"
              >
                <img
                  src="./withdraw.jpeg"
                  alt="Withdraw Anytime"
                  className="img-fluid rounded mb-3 mb-md-0 me-md-3"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <div className="text-center text-md-start">
                  <h5 className="fw-bold">Withdraw Anytime</h5>
                  <p className="text-muted">
                    Withdraw your funds securely whenever you need them.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-12 col-md-6">
              <div
                className="p-4 rounded d-flex align-items-center flex-column flex-md-row"
                style={{ backgroundColor: "#fff3cd" }}
                data-aos="fade-left"
              >
                <img
                  src="./communities.jpeg"
                  alt="Join Communities"
                  className="img-fluid rounded mb-3 mb-md-0 me-md-3"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <div className="text-center text-md-start">
                  <h5 className="fw-bold">Join Communities</h5>
                  <p className="text-muted">
                    Collaborate with others to reach shared financial goals
                    faster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="need-help" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            {/* Need Help Section */}
            <div className="col-md-5" data-aos="fade-right">
              <h2 className="fw-bold">Need Help?</h2>
              <p className="text-muted">
                If you have any questions or need assistance, feel free to reach
                out to our support team. We're here to help you make the most of
                iFund.
              </p>
              <button className="btn btn-success">Contact Support</button>
            </div>

            {/* FAQ Section */}
            <div className="col-md-7" data-aos="fade-left">
              <h2 className="fw-bold">Frequently Asked Questions</h2>
              <div className="accordion mt-4" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq1"
                    >
                      How does iFund work?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show">
                    <div className="accordion-body">
                      iFund allows users to save money individually or in groups
                      while tracking their financial goals.
                    </div>
                  </div>
                </div>

                <div
                  className="accordion-item"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq2"
                    >
                      Is my money safe?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      Yes, iFund ensures security with encrypted transactions
                      and trusted financial partners.
                    </div>
                  </div>
                </div>

                <div
                  className="accordion-item"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq3"
                    >
                      Can I withdraw my savings anytime?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      Yes, you can withdraw your savings anytime, subject to the
                      withdrawal rules of your savings plan.
                    </div>
                  </div>
                </div>

                <div
                  className="accordion-item"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq4"
                    >
                      How do community savings work?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      Community savings allow members to pool funds together,
                      helping each other reach financial goals faster.
                    </div>
                  </div>
                </div>

                <div
                  className="accordion-item"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq5"
                    >
                      Does iFund charge any fees?
                    </button>
                  </h2>
                  <div id="faq5" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      iFund has minimal fees for certain transactions, but basic
                      savings and goal tracking are free.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-dark py-5" data-aos="fade-up">
        <div className="container">
          <div className="row text-center text-md-start">
            {/* Brand & About */}
            <div className="col-md-4 mb-4" data-aos="fade-right">
              <h4 className="fw-bold text-success">iFund</h4>
              <p className="text-muted">
                Empowering individuals and communities through smart savings and
                financial growth.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <h5 className="fw-bold text-dark">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="#features"
                    className="text-muted text-decoration-none fw-medium"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-muted text-decoration-none fw-medium"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-muted text-decoration-none fw-medium"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    className="text-muted text-decoration-none fw-medium"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="col-md-4" data-aos="fade-left">
              <h5 className="fw-bold text-dark">Stay Updated</h5>
              <p className="text-muted">
                Subscribe to our newsletter for financial tips and updates.
              </p>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
                <button className="btn btn-success fw-bold">Subscribe</button>
              </div>
            </div>
          </div>

          <hr className="border-secondary my-4" data-aos="zoom-in" />

          {/* Social Media & Copyright */}
          <div
            className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center"
            data-aos="fade-up"
          >
            <p className="mb-0 text-muted fw-medium">
              &copy; 2025 iFund. All rights reserved.
            </p>
            <div>
              <a href="#" className="text-success mx-2">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="#" className="text-success mx-2">
                <i className="bi bi-whatsapp fs-4"></i>
              </a>
              <a href="#" className="text-success mx-2">
                <i className="bi bi-twitter-x fs-4"></i>
              </a>
              <a href="#" className="text-success mx-2">
                <i className="bi bi-linkedin fs-4"></i>
              </a>
              <a href="#" className="text-success mx-2">
                <i className="bi bi-facebook fs-4"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
