
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "./App";
import NotFound from "./Error";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import RegisterEmployee from "./RegisterEmployee";
import EmployeeRegisterForm from "./EmployeeRegisterForm";
import EmployeeDetails from "./EmployeeDetails";
import RegisterAdmins from "./RegisterAdmins";
import AdminRegisterForm from "./AdminRegisterForm";
import AdminList from "./AdminList";

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
            },
            {
                path: "admin/employee/get-all-employees",
                element: <EmployeeDetails/>
            },{
                path: "admin/dashboard/admin/admins",
                element: <RegisterAdmins/>
            },{
                path: "admin/admins/register",
                element: <AdminRegisterForm/>
            },{
                path: "admin/admins/get-all-admins",
                element: <AdminList/>
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
