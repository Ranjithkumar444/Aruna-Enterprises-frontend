import Headers from "./Header"
import React from "react";
import { Outlet } from 'react-router-dom';
import AdminDashboard from "./AdminDashboard";

const AdminApp = () => {
    return (
        <div>
            <Headers />  
            <Outlet />   
        </div>
    );
};

export default AdminApp;