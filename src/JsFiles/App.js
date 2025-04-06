import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Headers from "./Header";


const App = () => {
    return(
        <div>
            <Headers/>
        </div>
    )
}

export default App;