import React from "react";
import image from "../assets/todolist.jpg";
import "./Home.css";

function Home() {
  return (
    <div className="body-wrap">
      <header className="site-header">
        <div className="container">
          <div className="site-header-inner">
            <div className="brand header-brand">
              <h1 className="m-0">
                <a href="#">
                  <img
                    className="header-logo-image"
                    src="dist/images/logo.svg"
                    alt="Logo"
                  />
                </a>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-copy">
                <h1 className="hero-title mt-0">
                  Landing template for startups
                </h1>
                <p className="hero-paragraph">
                  Our landing page template works on all devices, so you only
                  have to set it up once, and get beautiful results forever.
                </p>
                <div className="hero-cta">
                  <a className="button button-primary" href="#">
                    Pre order now
                  </a>
                  <a className="button" href="#">
                    Get in touch
                  </a>
                </div>
              </div>
              <div className="hero-figure anime-element">
                <img src={image}></img>
              </div>
            </div>
          </div>
        </section>

        {/* Other sections like features, pricing, and CTA go here */}
      </main>
    </div>
  );
}

export default Home;
