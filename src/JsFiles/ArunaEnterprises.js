import React from 'react';
import "../CssFiles/ArunaEnterprises.css"
import { useNavigate } from 'react-router-dom';

const ArunaEnterprises = () => {
    const navigate = useNavigate();

  return (
    <div className="ae-container">
      {/* Hero Banner */}
      <section className="ae-hero-banner">
        <div className="ae-hero-content">
          <h1>Aruna Enterprises</h1>
          <h2>Premium Corrugated Box Manufacturer in Bangalore, India</h2>
          <p>Your reliable partner for premium corrugated packaging solutions since 2006</p>
        </div>
      </section>

      {/* About Section */}
      <section className="ae-about-section">
        <div className="ae-container-inner">
          <h2>Our Legacy of Excellence in Corrugated Packaging</h2>
          <div className="ae-about-content">
            <div className="ae-about-text">
              <p>From humble beginnings with a single machine, Aruna Enterprises has grown into a trusted name in the packaging industry. We specialize in manufacturing a wide array of products including:</p>
              <ul className="ae-product-list">
                <li>3 Ply, 5 Ply, 7 and 9 Ply corrugated boxes</li>
                <li>Corrugated sheets and rolls</li>
                <li>Custom-printed boxes</li>
                <li>Duplex corrugated boxes</li>
                <li>Offset printed laminated boxes</li>
                <li>Industrial packaging cartons</li>
                <li>Heavy-duty cardboard boxes</li>
              </ul>
              <p>Each product is designed with durability, functionality, and visual appeal in mind.</p>
            </div>
            <div className="ae-about-image">
              <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/ourlegacy.png?raw=true" alt="Corrugated Box Manufacturing" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="ae-why-choose">
        <div className="ae-container-inner">
          <h2>Why Partner with Aruna Enterprises?</h2>
          <div className="ae-benefits-grid">
            <div className="ae-benefit-card">
              <div className="ae-benefit-icon">📦</div>
              <h3>Extensive Product Range</h3>
              <p>From basic cartons to customized, heavy-duty industrial boxes for furniture, textiles, automotive, homeware, and more.</p>
            </div>
            <div className="ae-benefit-card">
              <div className="ae-benefit-icon">🚀</div>
              <h3>Commitment to Innovation</h3>
              <p>We continuously explore new packaging materials and structural designs to stay ahead of market needs.</p>
            </div>
            <div className="ae-benefit-card">
              <div className="ae-benefit-icon">🔍</div>
              <h3>Stringent Quality Control</h3>
              <p>Premium-grade raw materials and rigorous testing ensure maximum strength and durability.</p>
            </div>
            <div className="ae-benefit-card">
              <div className="ae-benefit-icon">✂️</div>
              <h3>Tailored Solutions</h3>
              <p>Custom packaging that aligns with your branding and product protection needs.</p>
            </div>
            <div className="ae-benefit-card">
              <div className="ae-benefit-icon">💰</div>
              <h3>Affordable Quality</h3>
              <p>Cost-effective packaging without sacrificing quality or performance.</p>
            </div>
            <div className="ae-benefit-card">
              <div className="ae-benefit-icon">🌱</div>
              <h3>Sustainable Manufacturing</h3>
              <p>Recyclable, biodegradable products with minimal environmental impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="ae-sustainability">
        <div className="ae-container-inner">
          <div className="ae-sustainability-content">
            <div className="ae-sustainability-image">
              <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/ecofriendly.jpg?raw=true" alt="Eco-friendly packaging" />
            </div>
            <div className="ae-sustainability-text">
              <h2>Sustainable & Eco-Conscious Manufacturing</h2>
              <p>As a socially responsible enterprise, Aruna Enterprises is dedicated to eco-friendly practices. Our corrugated products are recyclable, biodegradable, and manufactured with minimal environmental impact. Choosing us means supporting a greener future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="ae-services">
        <div className="ae-container-inner">
          <h2>Our Core Services</h2>
          <div className="ae-services-grid">
            <div className="ae-service-card">
              <h3>Custom Design & Development</h3>
              <p>Packaging crafted to match your product and branding.</p>
            </div>
            <div className="ae-service-card">
              <h3>Industrial-Grade Manufacturing</h3>
              <p>High-performance boxes with excellent load-bearing capacity.</p>
            </div>
            <div className="ae-service-card">
              <h3>Bulk Supply & Distribution</h3>
              <p>Robust supply chain for large and recurring orders.</p>
            </div>
            <div className="ae-service-card">
              <h3>Dedicated Client Support</h3>
              <p>Quick responses and excellent after-sales assistance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="ae-leadership">
        <div className="ae-container-inner">
          <h2>Leadership That Inspires</h2>
          <div className="ae-leadership-content">
            <div className="ae-leadership-text">
              <p>Our progress is guided by the vision of our founder <strong>Mr. M. Munirathnappa</strong> and operationally led by <strong>Mr. M. Hemanth Kumar</strong>, whose experience, dedication, and industry insight have been instrumental in shaping the company's path.</p>
              <p>Their leadership has fostered a culture of integrity, precision, and relentless improvement.</p>
            </div>
            <div className="ae-leadership-image">
              <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/leadership.jpg?raw=true" alt="Leadership team" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="ae-final-cta">
        <div className="ae-container-inner">
          <h2>Choose Aruna Enterprises for Packaging That Performs</h2>
          <p>With our unmatched expertise, high-quality standards, and customer-first approach, we are your go-to source for all corrugated packaging needs.</p>
          <button className="ae-cta-button" onClick={() => {navigate("/contact")}}>Contact Us Today</button>
        </div>
      </section>
    </div>
  );
};

export default ArunaEnterprises;