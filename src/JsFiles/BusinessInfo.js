
import React from "react";
import "../CssFiles/BusinessInfo.css"

const BusinessInfo = () => {
  return (
    <div className="business-info">
      <div className="info-row">
        <div className="info-box">
          <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/cooperation.png?raw=true" alt="Business" />
          <p>Nature of Business</p>
          <h4>Manufacturer</h4>
        </div>
        <div className="info-box">
          <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/icons8-scales-48.png?raw=true" alt="Legal Status" />
          <p>Legal Status of Firm</p>
          <h4>Proprietorship</h4>
        </div>
        <div className="info-box">
          <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/icons8-improve-64.png?raw=true" alt="Turnover" />
          <p>Annual Turnover</p>
          <h4>10 - 15 Cr</h4>
        </div>
        <div className="info-box">
          <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/calculate.png?raw=true" alt="GST Date" />
          <p>GST Registration Date</p>
          <h4>01-07-2017</h4>
        </div>
      </div>

      <div className="info-row">
        <div className="info-box">
          <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/employee.png?raw=true" alt="Employees" />
          <p>Total Number of Employees</p>
          <h4>Up to 70 People</h4>
        </div>
        <div className="info-box">
          <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/bill.png?raw=true" alt="GST Number" />
          <p>GST Number</p>
          <h4>29AGMPA4109J1ZE</h4>
        </div>
        <div className="info-box">
          <img  src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/Trustseal.png?raw=true" />
          <p>IndiaMART Certification</p>
          <h4>Trust Seal Verified</h4>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
