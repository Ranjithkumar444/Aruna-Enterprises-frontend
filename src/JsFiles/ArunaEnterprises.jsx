import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArunaEnterprises = () => {
  const navigate = useNavigate();

  return (
    <div className="font-roboto text-gray-800 leading-relaxed">
      <section
        className="relative py-24 text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/aebanner.jpg?raw=true')`,
        }}
      >
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Aruna Enterprises</h1>
          <h2 className="text-3xl md:text-4xl font-normal text-gray-100 mb-6 drop-shadow-md">
            Premium Corrugated Box Manufacturer in Bangalore, India
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Your reliable partner for premium corrugated packaging solutions since 2006
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl md:text-5xl text-center mb-12 text-gray-900">
            Our Legacy of Excellence in Corrugated Packaging
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="mb-4">
                From humble beginnings with a single machine, Aruna Enterprises has grown into a
                trusted name in the packaging industry. We specialize in manufacturing a wide array
                of products including:
              </p>
              <ul className="columns-1 md:columns-2 mt-5">
                <li className="mb-2 relative pl-6 before:content-['✓'] before:text-green-500 before:font-bold before:absolute before:left-0">
                  3 Ply, 5 Ply, 7 and 9 Ply corrugated boxes
                </li>
                <li className="mb-2 relative pl-6 before:content-['✓'] before:text-green-500 before:font-bold before:absolute before:left-0">
                  Corrugated sheets and rolls
                </li>
                <li className="mb-2 relative pl-6 before:content-['✓'] before:text-green-500 before:font-bold before:absolute before:left-0">
                  Custom-printed boxes
                </li>
                <li className="mb-2 relative pl-6 before:content-['✓'] before:text-green-500 before:font-bold before:absolute before:left-0">
                  Duplex corrugated boxes
                </li>
                <li className="mb-2 relative pl-6 before:content-['✓'] before:text-green-500 before:font-bold before:absolute before:left-0">
                  Offset printed laminated boxes
                </li>
                <li className="mb-2 relative pl-6 before:content-['✓'] before:text-green-500 before:font-bold before:absolute before:left-0">
                  Industrial packaging cartons
                </li>
                <li className="mb-2 relative pl-6 before:content-['✓'] before:text-green-500 before:font-bold before:absolute before:left-0">
                  Heavy-duty cardboard boxes
                </li>
              </ul>
              <p className="mt-4">
                Each product is designed with durability, functionality, and visual appeal in mind.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/ourlegacy.png?raw=true"
                alt="Corrugated Box Manufacturing"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl md:text-5xl text-center mb-12 text-white">
            Why Partner with Aruna Enterprises?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-8 rounded-lg transition-all duration-300 hover:translate-y-[-10px] hover:bg-opacity-15 hover:shadow-2xl">
              <div className="text-4xl mb-5">📦</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Extensive Product Range</h3>
              <p>
                From basic cartons to customized, heavy-duty industrial boxes for furniture,
                textiles, automotive, homeware, and more.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg transition-all duration-300 hover:translate-y-[-10px] hover:bg-opacity-15 hover:shadow-2xl">
              <div className="text-4xl mb-5">🚀</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Commitment to Innovation</h3>
              <p>
                We continuously explore new packaging materials and structural designs to stay ahead
                of market needs.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg transition-all duration-300 hover:translate-y-[-10px] hover:bg-opacity-15 hover:shadow-2xl">
              <div className="text-4xl mb-5">🔍</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Stringent Quality Control
              </h3>
              <p>
                Premium-grade raw materials and rigorous testing ensure maximum strength and
                durability.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg transition-all duration-300 hover:translate-y-[-10px] hover:bg-opacity-15 hover:shadow-2xl">
              <div className="text-4xl mb-5">✂️</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Tailored Solutions</h3>
              <p>
                Custom packaging that aligns with your branding and product protection needs.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg transition-all duration-300 hover:translate-y-[-10px] hover:bg-opacity-15 hover:shadow-2xl">
              <div className="text-4xl mb-5">💰</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Affordable Quality</h3>
              <p>Cost-effective packaging without sacrificing quality or performance.</p>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg transition-all duration-300 hover:translate-y-[-10px] hover:bg-opacity-15 hover:shadow-2xl">
              <div className="text-4xl mb-5">🌱</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Sustainable Manufacturing</h3>
              <p>Recyclable, biodegradable products with minimal environmental impact.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <img
                src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/ecofriendly.jpg?raw=true"
                alt="Eco-friendly packaging"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl text-green-600 mb-5">
                Sustainable & Eco-Conscious Manufacturing
              </h2>
              <p>
                As a socially responsible enterprise, Aruna Enterprises is dedicated to eco-friendly
                practices. Our corrugated products are recyclable, biodegradable, and manufactured
                with minimal environmental impact. Choosing us means supporting a greener future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl md:text-5xl text-center mb-12">Our Core Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:translate-y-[-10px] hover:shadow-xl border-t-4 border-red-500">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Custom Design & Development
              </h3>
              <p>Packaging crafted to match your product and branding.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:translate-y-[-10px] hover:shadow-xl border-t-4 border-red-500">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Industrial-Grade Manufacturing
              </h3>
              <p>High-performance boxes with excellent load-bearing capacity.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:translate-y-[-10px] hover:shadow-xl border-t-4 border-red-500">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Bulk Supply & Distribution
              </h3>
              <p>Robust supply chain for large and recurring orders.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:translate-y-[-10px] hover:shadow-xl border-t-4 border-red-500">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Dedicated Client Support</h3>
              <p>Quick responses and excellent after-sales assistance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl md:text-5xl text-center mb-12">Leadership That Inspires</h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="mb-4">
                Our progress is guided by the vision of our founder{' '}
                <strong className="font-semibold">Mr. M. Munirathnappa</strong> and operationally
                led by <strong className="font-semibold">Mr. M. Hemanth Kumar</strong>, whose
                experience, dedication, and industry insight have been instrumental in shaping the
                company's path.
              </p>
              <p>
                Their leadership has fostered a culture of integrity, precision, and relentless
                improvement.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/leadership.jpg?raw=true"
                alt="Leadership team"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-red-500 text-white text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-white">
            Choose Aruna Enterprises for Packaging That Performs
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-lg md:text-xl">
            With our unmatched expertise, high-quality standards, and customer-first approach, we are
            your go-to source for all corrugated packaging needs.
          </p>
          <button
            className="bg-white text-red-600 border-none px-8 py-3 text-lg font-semibold rounded-md cursor-pointer transition-all duration-300 uppercase tracking-wide hover:bg-gray-100 hover:translate-y-[-3px] hover:shadow-xl"
            onClick={() => {
              navigate('/contact');
            }}
          >
            Contact Us Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default ArunaEnterprises;