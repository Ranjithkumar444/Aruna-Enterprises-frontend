import React from 'react';

const AccessDeniedMessage = () => {
  const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-alert-triangle">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" x2="12" y1="9" y2="13"/>
      <line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>
  );

  return (
    <div className="access-denied-container">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .access-denied-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ffebee 0%, #fce4ec 50%, #f3e5f5 100%); /* Soft gradient background */
            padding: 20px;
            box-sizing: border-box; /* Ensure padding is included in element's total width and height */
          }

          .access-denied-card {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(255, 99, 132, 0.3); /* Soft shadow with a subtle border effect */
            text-align: center;
            max-width: 500px;
            width: 100%;
            position: relative;
            overflow: hidden;
            transform: scale(1);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            border: 1px solid #f8bbd0; /* Light pink border */
          }

          .access-denied-card:hover {
            transform: scale(1.02);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(255, 99, 132, 0.5);
          }

          .icon-wrapper {
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
          }

          .icon-alert-triangle {
            color: #ef4444; /* A vibrant red */
            animation: bounce 1.5s infinite;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-15px);
            }
            60% {
              transform: translateY(-7px);
            }
          }

          .access-denied-card h1 {
            font-size: 3.5em; /* Larger on desktop */
            font-weight: 800;
            color: #b91c1c; /* Darker red for emphasis */
            margin-bottom: 15px;
            letter-spacing: -1px;
            line-height: 1.1;
          }

          .access-denied-card p {
            font-size: 1.2em;
            color: #4a4a4a;
            line-height: 1.6;
            margin-bottom: 30px;
          }

          .button-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
            justify-content: center;
            align-items: center;
          }

          .access-denied-button {
            padding: 15px 30px;
            font-size: 1.1em;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 100%; /* Full width on small screens */
            max-width: 300px; /* Max width for buttons */
          }

          .access-denied-button.primary {
            background-color: #dc2626; /* Red-600 */
            color: #ffffff;
          }

          .access-denied-button.primary:hover {
            background-color: #b91c1c; /* Darker red */
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
          }

          /* Responsive Adjustments */
          @media (min-width: 600px) {
            .access-denied-card {
              padding: 60px;
            }

            .access-denied-card h1 {
              font-size: 4em;
            }

            .access-denied-card p {
              font-size: 1.3em;
            }

            .button-group {
              flex-direction: row;
              gap: 20px;
            }

            .access-denied-button {
              width: auto;
              min-width: 180px; /* Ensure buttons have a minimum width */
            }
          }

          @media (max-width: 480px) {
            .access-denied-card {
              padding: 30px;
            }
            .access-denied-card h1 {
              font-size: 2.8em;
            }
            .access-denied-card p {
              font-size: 1.1em;
            }
          }
        `}
      </style>
      <div className="access-denied-card">
        <div className="icon-wrapper">
          <AlertTriangleIcon />
        </div>
        <h1>Access Denied</h1>
        <p>
          We're sorry, but you do not have the required permissions to view this content.
        </p>
        <div className="button-group">
          <button
            onClick={() => window.history.back()}
            className="access-denied-button primary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedMessage;