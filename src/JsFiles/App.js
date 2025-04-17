import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Headers from "./Header";
import { Outlet } from 'react-router-dom';


const App = () => {
    return(
        <div>
            <Headers/>
            <Outlet />
        </div>
    )
}

export default App;