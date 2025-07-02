import React, { useEffect, useState, useRef } from "react";

const WhoWeAre = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-5 sm:px-10 md:px-20 lg:px-32 py-20 bg-gradient-to-br from-blue-50 via-white to-gray-50 font-sans overflow-hidden"
    >
      
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 to-transparent animate-blob-pulse"></div>

      
      <div className="w-full lg:w-auto relative z-10">
        <img
  src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/whoweare.jpg?raw=true"
  alt="Corrugated Packaging"
  className="w-full max-w-2xl lg:max-w-3xl h-auto rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02] border-4 border-white/80"
/>

        
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 rounded-full mix-blend-multiply filter blur-sm opacity-50 animate-blob"></div>
      </div>

      
      <div
        className={`max-w-3xl relative z-10 transition-all duration-1000 ease-out ${
          animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
        }`}
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight relative inline-block leading-tight">
          Who We Are
          
          <span className="block h-1.5 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mt-2 rounded-full transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out animate-expand-line"></span>
        </h2>

        <p className="text-xl italic text-indigo-700 mb-8 font-medium">
          Crafting Trust, One Box at a Time.
        </p>

        <div className="space-y-5 text-gray-700 text-lg leading-relaxed bg-white/90 p-7 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
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
            As an <strong className="text-blue-700 font-bold">IndiaMART Trusted Seller</strong>, we take pride in our transparent operations, consistent quality, and trusted customer relationships across the nation.
          </p>
          <p>
            Driven by innovation and guided by trust, we’re redefining packaging solutions for a better, more sustainable tomorrow.
          </p>
          <p>
            <strong className="text-blue-700 font-bold">Choose Aruna Enterprises</strong>—where quality meets commitment, and every box supports a cleaner future.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;