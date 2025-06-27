import React from "react";

const BusinessInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl space-y-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8 drop-shadow-md">
          Business Overview
        </h2>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center">
            <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/cooperation.png?raw=true" alt="Business" className="w-16 h-16 mb-4 object-contain" />
            <p className="text-gray-600 text-sm font-medium">Nature of Business</p>
            <h4 className="text-xl font-bold text-gray-800 mt-1">Manufacturer</h4>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center">
            <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/icons8-scales-48.png?raw=true" alt="Legal Status" className="w-16 h-16 mb-4 object-contain" />
            <p className="text-gray-600 text-sm font-medium">Legal Status of Firm</p>
            <h4 className="text-xl font-bold text-gray-800 mt-1">Proprietorship</h4>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center">
            <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/icons8-improve-64.png?raw=true" alt="Turnover" className="w-16 h-16 mb-4 object-contain" />
            <p className="text-gray-600 text-sm font-medium">Annual Turnover</p>
            <h4 className="text-xl font-bold text-gray-800 mt-1">10 - 15 Cr</h4>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center">
            <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/calculate.png?raw=true" alt="GST Date" className="w-16 h-16 mb-4 object-contain" />
            <p className="text-gray-600 text-sm font-medium">GST Registration Date</p>
            <h4 className="text-xl font-bold text-gray-800 mt-1">01-07-2017</h4>
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center">
            <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/employee.png?raw=true" alt="Employees" className="w-16 h-16 mb-4 object-contain" />
            <p className="text-gray-600 text-sm font-medium">Total Number of Employees</p>
            <h4 className="text-xl font-bold text-gray-800 mt-1">Up to 70 People</h4>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center">
            <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/bill.png?raw=true" alt="GST Number" className="w-16 h-16 mb-4 object-contain" />
            <p className="text-gray-600 text-sm font-medium">GST Number</p>
            <h4 className="text-xl font-bold text-gray-800 mt-1">29AGMPA4109J1ZE</h4>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center">
            <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/Trustseal.png?raw=true" alt="IndiaMART Certification" className="w-16 h-16 mb-4 object-contain" />
            <p className="text-gray-600 text-sm font-medium">IndiaMART Certification</p>
            <h4 className="text-xl font-bold text-gray-800 mt-1">Trust Seal Verified</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;