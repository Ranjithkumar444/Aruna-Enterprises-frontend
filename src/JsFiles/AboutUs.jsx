import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import BusinessInfo from "./BusinessInfo";

const AboutUs = () => {
  const visionRef = useRef(null);
  const location = useLocation();
  const missionRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const historyRef = useRef(null); 

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up"); 
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.1 }
    );

    [visionRef, missionRef, statsRef, teamRef, historyRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [visionRef, missionRef, statsRef, teamRef, historyRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [location]);

  return (
    <div className="font-sans text-gray-700 leading-relaxed bg-gray-50">
      <div
        className="relative h-[400px] flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/AboutUsImageBox.jpg?raw=true')",
        }}
      >
        <div className="max-w-4xl p-5 relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-5 text-shadow-lg animate-fade-in-scale">
            About Aruna Enterprises
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-shadow-md animate-fade-in-up-slow">
            Crafting packaging solutions with precision since 2006
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16">
        <section
          id="history"
          ref={historyRef}
          className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-20 section-fade-in"
        >
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 relative pb-4">
              Our History
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full"></span>
            </h2>
            <p className="text-lg mb-5 text-gray-700">
              Established in <strong className="text-teal-600">2006</strong>, Aruna
              Enterprises has grown from a small packaging workshop to a
              trusted manufacturer and supplier of high-quality corrugated
              boxes. What began as a modest operation with a single machine has
              flourished into a thriving business that serves clients across
              multiple industries.
            </p>
            <p className="text-lg mb-5 text-gray-700">
              Taking advantage of vast industrial experience, cutting-edge
              production techniques and total knowledge of the respective domain, we at
              Aruna Enterprises have reached new heights of achievement in
              national markets. Our company has acquired a competitive edge over
              competitors by endlessly manufacturing and supplying superior
              quality packaging solutions including Corrugated Boxes/Cartons,
              Corrugated Sheets, Corrugated Rolls, Printed Corrugated Boxes,
              Duplex Corrugated Boxes, Offset Printed Laminated Boxes,
              Industrial Packaging Boxes/Cartons, Cardboard Boxes and many
              more.
            </p>
            <p className="text-lg mb-5 text-gray-700">
              It is our uncompromising commitment and unrelenting endeavors
              towards quality that we have gained the maximum trust of customers
              across the nation and established a distinguished status in the
              industry. Our products are developed by experienced
              professionals, keeping the specific demands of clients in mind. We
              use highly qualitative raw materials sourced from reliable market
              dealers who ensure 100% quality.
            </p>
            <p className="text-lg mb-5 text-gray-700">
              Under the visionary leadership of our honorable founder{" "}
              <strong className="text-teal-600">Mr. M. Munirathnappa</strong> and
              honorable manager{" "}
              <strong className="text-teal-600">Mr. M. Hemanth Kumar</strong> and
              proprietor <strong className="text-teal-600">Ms. Aruna </strong>
              we have achieved remarkable growth and earned maximum client
              support through sound business acumen, years of industry
              experience, marketing expertise, and strong administrative
              capabilities.
            </p>
            <p className="text-lg mb-5 text-gray-700">
              Over the years, we've invested in cutting-edge technology and
              continuous staff training to ensure we remain at the forefront of
              packaging innovation. Our journey reflects our commitment to
              quality, customer satisfaction, and sustainable growth.
            </p>
            <p className="text-lg text-gray-700">
              In this competitive market, the standards we maintain in product
              quality have kept us ahead of competitors. All our products
              undergo stringent quality checks against defined industrial
              parameters before final packaging and delivery to customers. Our
              offerings are recognized for their stiffness, maximum strength,
              longer life, heavy load-bearing capacity, dimensional accuracy,
              high tear strength and other superior qualities.
            </p>
          </div>
          <div className="flex-1 w-full lg:w-auto mt-10 lg:mt-0">
            <div
              className="h-80 sm:h-96 lg:h-[450px] w-full rounded-xl shadow-2xl bg-cover bg-center transform transition-transform duration-500 hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/boxStockImage.jpg?raw=true')",
              }}
            ></div>
          </div>
        </section>

        <section
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 section-fade-in"
        >
          <div className="bg-white p-8 rounded-xl text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="text-5xl font-extrabold text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">
              18+
            </div>
            <div className="text-xl font-medium text-gray-800">
              Years in Business
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="text-5xl font-extrabold text-green-600 mb-3 group-hover:text-green-700 transition-colors">
              500+
            </div>
            <div className="text-xl font-medium text-gray-800">
              Clients Served
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="text-5xl font-extrabold text-purple-600 mb-3 group-hover:text-purple-700 transition-colors">
              10M+
            </div>
            <div className="text-xl font-medium text-gray-800">
              Boxes Produced
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="text-5xl font-extrabold text-orange-600 mb-3 group-hover:text-orange-700 transition-colors">
              98%
            </div>
            <div className="text-xl font-medium text-gray-800">
              Customer Satisfaction
            </div>
          </div>
        </section>
        <section
          id="visionmission"
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20"
        >
          <div
            ref={visionRef}
            className="bg-white p-10 rounded-2xl shadow-xl border-t-8 border-teal-500 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 section-fade-in-left"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 fill-teal-600"
                viewBox="0 0 24 24"
              >
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
            <ul className="list-none pl-0 space-y-4">
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-teal-500 before:font-bold before:text-xl">
                To redefine packaging standards through innovation
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-teal-500 before:font-bold before:text-xl">
                Become the most trusted name in corrugated solutions
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-teal-500 before:font-bold before:text-xl">
                Pioneer sustainable packaging practices
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-teal-500 before:font-bold before:text-xl">
                Expand our global footprint while maintaining quality
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-teal-500 before:font-bold before:text-xl">
                Foster long-term partnerships built on trust
              </li>
            </ul>
          </div>

          <div
            ref={missionRef}
            className="bg-white p-10 rounded-2xl shadow-xl border-t-8 border-indigo-500 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 section-fade-in-right"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 fill-indigo-600"
                viewBox="0 0 24 24"
              >
                <path d="M3,3H21V7H3V3M4,8H20V21H4V8M9.5,11A0.5,0.5 0 0,0 9,11.5V13H15V11.5A0.5,0.5 0 0,0 14.5,11H9.5Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <ul className="list-none pl-0 space-y-4">
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-indigo-500 before:font-bold before:text-xl">
                Deliver precision-engineered packaging solutions
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-indigo-500 before:font-bold before:text-xl">
                Exceed customer expectations consistently
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-indigo-500 before:font-bold before:text-xl">
                Minimize environmental impact through innovation
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-indigo-500 before:font-bold before:text-xl">
                Empower our team through continuous learning
              </li>
              <li className="relative pl-8 text-lg before:content-['✓'] before:absolute before:left-0 before:text-indigo-500 before:font-bold before:text-xl">
                Maintain transparency in all our operations
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-20">
          <BusinessInfo />
        </section>

        <section id="ourteam" ref={teamRef} className="mb-20 section-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center relative pb-4">
            Our Team
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></span>
          </h2>
          <p className="max-w-4xl mx-auto text-center text-lg mb-8 text-gray-700">
            Behind every box we produce is a team of dedicated professionals
            committed to excellence. From our skilled production staff to our
            customer service representatives, each member plays a vital role in
            delivering the quality you expect.
          </p>
          <p className="max-w-4xl mx-auto text-center text-lg mb-12 text-gray-700">
            Our highly talented and hardworking team focuses all their endeavors
            to provide desired solutions and the best product range to our
            customers. The team cordially performs all operations and assists in
            completing targets within predetermined time frames. We regularly
            conduct training programs to keep our personnel updated with market
            preferences and industry advancements.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 border-4 border-blue-300 overflow-hidden">
                <svg className="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Production Experts
              </h3>
              <p className="text-gray-600 text-lg">
                With 10+ years average experience
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 border-4 border-green-300 overflow-hidden">
                <svg className="w-20 h-20 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Quality Control
              </h3>
              <p className="text-gray-600 text-lg">Rigorous multi-point inspection</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6 border-4 border-purple-300 overflow-hidden">
                <svg className="w-20 h-20 text-purple-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V2zm-2 12H6v-2h12v2zm0-3H6V8h12v3z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Customer Service
              </h3>
              <p className="text-gray-600 text-lg">Dedicated account managers</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;