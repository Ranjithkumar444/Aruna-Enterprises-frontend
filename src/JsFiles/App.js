import React from "react";
import Headers from "./Header";
import { Outlet } from 'react-router-dom';
import Body from "./body";
import { useLocation } from "react-router-dom";
import IndustryList from "./IndustryList";
import Footer from "./Footer";


const App = () => {
  const location = useLocation();

  const hideBodyRoutes = ["/contact","/about","/industries"];

  const shouldShowBody = !hideBodyRoutes.includes(location.pathname);

  return (
    <div>
      <Headers />
      <Outlet />  
      {shouldShowBody && <Body />}
      <Footer/>
    </div>
  );
};

export default App;