import React, { useState, useEffect } from "react";
import { landingHeroSlides } from "../services/Constants";
import { useNavigate } from "react-router";

const LandingHero = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % landingHeroSlides.length);
  };

  // useEffect(() => {
  //   const timer = setInterval(nextSlide, 5000);
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <div className="landing-hero-container">
      {landingHeroSlides.map((slide, index) => (
        <div
          key={index}
          className={`landing-hero-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.url})` }}
        >
          <div className="landing-hero-overlay">
            <div key={current} className="landing-hero-content">
              <p className="landing-hero-subtitle">{slide.subTitle}</p>
              <h1 className="landing-hero-title">{slide.title}</h1>
              <p className="landing-hero-description">{slide.description}</p>
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="landing-page-cta"
              >
                Start Journey
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingHero;
