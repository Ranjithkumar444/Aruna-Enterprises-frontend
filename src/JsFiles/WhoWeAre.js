import React, { useEffect, useState } from "react";
import "../CssFiles/WhoWeAre.css";

const WhoWeAre = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  return (
    <section className="who-we-are-container">
      <div className="who-we-are-image">
        <img
          src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/whoweare.jpg?raw=true"
          alt="Corrugated Packaging"
        />
      </div>

      <div className={`who-we-are-text ${animate ? "fade-slide-in" : ""}`}>
        <h2>Who We Are</h2>
        <p className="subtitle">Crafting Trust, One Box at a Time.</p>
        <div className="who-we-are-paragraphs">
          <p>
            Established in 2006, Aruna Enterprises has grown from a humble packaging unit into a leading manufacturer of premium corrugated solutions.
          </p>
          <p>
            We specialize in durable, custom-made corrugated boxes tailored for every industry—delivering strength, precision, and performance in every fold.
          </p>
          <p>
            With advanced technology, experienced professionals, and unwavering quality control, we set the benchmark in industrial packaging.
          </p>
          <p>
            From Regular Slotted Containers to custom printed cartons, our products are built to protect, perform, and impress.
          </p>
          <p>
            We believe packaging is more than a box—it's a promise of quality, reliability, and eco-friendly responsibility.
          </p>
          <p>
            All our packaging solutions are crafted with sustainability in mind—reducing waste, maximizing recyclability, and supporting a greener planet.
          </p>
          <p>
            As an <strong>IndiaMART Trusted Seller</strong>, we take pride in our transparent operations, consistent quality, and trusted customer relationships across the nation.
          </p>
          <p>
            Driven by innovation and guided by trust, we’re redefining packaging solutions for a better, more sustainable tomorrow.
          </p>
          <p>
            <strong>Choose Aruna Enterprises</strong>—where quality meets commitment, and every box supports a cleaner future.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
