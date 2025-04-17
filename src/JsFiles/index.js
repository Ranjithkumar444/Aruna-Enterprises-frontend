
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "./App";
import NotFound from "./Error";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import RegisterEmployee from "./RegisterEmployee";
import EmployeeRegisterForm from "./EmployeeRegisterForm";

const router = createBrowserRouter([
    {
        path: "/",
        element : <App/>,
        errorElement: <NotFound />,
        children: [
            {
                path: "admin",
                element: <AdminLogin/>
            },
            {
                path: "admin/dashboard",
                element: <AdminDashboard/>
            },
            {
                path: "admin/dashboard/admin/employee",
                element: <RegisterEmployee/>
            },
            {
                path: "admin/employee/register",
                element: <EmployeeRegisterForm/>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound /> 
    }
])

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
