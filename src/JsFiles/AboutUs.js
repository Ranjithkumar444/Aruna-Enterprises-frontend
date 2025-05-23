import React, { useEffect, useRef } from "react";
import "../CssFiles/AboutUs.css";

const AboutUs = () => {
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    [visionRef, missionRef, statsRef, teamRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [visionRef, missionRef, statsRef, teamRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <div className="about-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">About Aruna Enterprises</h1>
          <p className="hero-subtitle">
            Crafting packaging solutions with precision since 2006
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <section className="about-section">
          <div className="about-content">
            <h2 className="section-title">Our Story</h2>
            <p className="about-text">
              Established in <strong>2006</strong>, Aruna Enterprises has grown from a small
              packaging workshop to a trusted manufacturer and supplier of
              high-quality corrugated boxes. What began as a modest operation
              with a single machine has flourished into a thriving business that
              serves clients across multiple industries.
            </p>
            <p className="about-text">
              Over the years, we've invested in cutting-edge technology and
              continuous staff training to ensure we remain at the forefront of
              packaging innovation. Our journey reflects our commitment to
              quality, customer satisfaction, and sustainable growth.
            </p>
          </div>
          <div className="about-image">
            <div className="image-placeholder"></div>
          </div>
        </section>

        <section className="stats-section" ref={statsRef}>
          <div className="stat-card">
            <div className="stat-number">18+</div>
            <div className="stat-label">Years in Business</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Clients Served</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10M+</div>
            <div className="stat-label">Boxes Produced</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
        </section>

        <section className="values-section">
          <div className="vision-box" ref={visionRef}>
            <div className="icon-container">
              <svg viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
              </svg>
            </div>
            <h2>Our Vision</h2>
            <ul>
              <li>To redefine packaging standards through innovation</li>
              <li>Become the most trusted name in corrugated solutions</li>
              <li>Pioneer sustainable packaging practices</li>
              <li>Expand our global footprint while maintaining quality</li>
              <li>Foster long-term partnerships built on trust</li>
            </ul>
          </div>

          <div className="mission-box" ref={missionRef}>
            <div className="icon-container">
              <svg viewBox="0 0 24 24">
                <path d="M3,3H21V7H3V3M4,8H20V21H4V8M9.5,11A0.5,0.5 0 0,0 9,11.5V13H15V11.5A0.5,0.5 0 0,0 14.5,11H9.5Z" />
              </svg>
            </div>
            <h2>Our Mission</h2>
            <ul>
              <li>Deliver precision-engineered packaging solutions</li>
              <li>Exceed customer expectations consistently</li>
              <li>Minimize environmental impact through innovation</li>
              <li>Empower our team through continuous learning</li>
              <li>Maintain transparency in all our operations</li>
            </ul>
          </div>
        </section>

        <section className="team-section" ref={teamRef}>
          <h2 className="section-title">Our Team</h2>
          <p className="team-description">
            Behind every box we produce is a team of dedicated professionals
            committed to excellence. From our skilled production staff to our
            customer service representatives, each member plays a vital role in
            delivering the quality you expect.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image"></div>
              <h3>Production Experts</h3>
              <p>With 10+ years average experience</p>
            </div>
            <div className="team-member">
              <div className="member-image"></div>
              <h3>Quality Control</h3>
              <p>Rigorous multi-point inspection</p>
            </div>
            <div className="team-member">
              <div className="member-image"></div>
              <h3>Customer Service</h3>
              <p>Dedicated account managers</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;