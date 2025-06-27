import React from 'react';

const AccessDeniedMessage = () => {
  const AlertTriangleIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="64" 
      height="64" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-red-500 animate-bounce" 
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" x2="12" y1="9" y2="13"/>
      <line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-5 font-inter"> 
      <div 
        className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-pink-200 text-center max-w-lg w-full relative overflow-hidden 
                   transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-2xl hover:border-pink-300" 
      >
        <div className="flex justify-center mb-6"> 
          <AlertTriangleIcon />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-red-700 mb-4 tracking-tight leading-tight"> 
          Access Denied
        </h1>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We're sorry, but you do not have the required permissions to view this content.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center"> 
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-lg cursor-pointer transition-all duration-300 ease-in-out 
                       bg-red-600 text-white shadow-md hover:bg-red-700 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedMessage;