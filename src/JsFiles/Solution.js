import React from 'react';
import "../CssFiles/Solution.css"

const Solution = () => {
    return(
        <div className="solution-container">
            <h1 className="main-heading">Our Solutions</h1>
            
            <div className="features-grid">
                {/* Feature 1 - Top-notch Quality */}
                <div className="feature-card">
                    <div className="feature-icon">
                        <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/boxStockImage.jpg?raw=true" alt="Quality" />
                    </div>
                    <h2>Top-notch Quality</h2>
                    <p>Our offerings are recognized for their stiffness, maximum strength, longer life, heavy load-bearing capacity, dimensional accuracy, high tear strength and other superior qualities.</p>
                </div>
                
                {/* Feature 2 - Crafted to perfection */}
                <div className="feature-card">
                    <div className="feature-icon">
                        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Craftsmanship" />
                    </div>
                    <h2>Crafted to perfection</h2>
                    <p>Products are being made carefully with exceptional skills, attention to details, and precision that it reaches the highest possible standards over 2 decades.</p>
                </div>
                
                {/* Feature 3 - Visionary Planning */}
                <div className="feature-card">
                    <div className="feature-icon">
                        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Planning" />
                    </div>
                    <h2>Visionary Planning</h2>
                    <p>To redefine packaging excellence through visionary planning, eco-conscious design, and customer-first innovation.</p>
                </div>
                
                {/* Feature 4 - Eco-Friendly Commitment */}
                <div className="feature-card">
                    <div className="feature-icon">
                        <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/pexels-photo-414837.jpeg?raw=true" />
                    </div>
                    <h2>Eco-Friendly Commitment</h2>
                    <p>Committed to sustainable packaging that protects both your product and the planet.</p>
                </div>
            </div>
        </div>
    )
}

export default Solution;