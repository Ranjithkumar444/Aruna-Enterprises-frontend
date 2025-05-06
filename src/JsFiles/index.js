
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
import AttendanceList from "./AttendanceList";
import ContactForm from "./ContactForm";
import AdminApp from "./AdminApp";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                path: "contact",
                element: <ContactForm />
            }
        ]
    },
    {
        path: "/admin",
        children: [
            {
                index: true,
                element: <AdminLogin /> 
            },
            {
                path: "dashboard",
                element: <AdminApp />,  
                children: [
                    {
                        index: true,
                        element: <AdminDashboard /> 
                    },
                    {
                        path: "admin/employee",
                        element: <RegisterEmployee />
                    },
                    {
                        path: "admin/admins",
                        element: <RegisterAdmins />
                    },
                    {
                        path: "admin/attendance",
                        element: <AttendanceList />
                    },
                    {
                        path: "admin/inventory",
                        element: <div>Inventory Page</div>
                    },
                    {
                        path: "admin/reports",
                        element: <div>Reports Page</div>
                    }
                ]
            },
            {
                path: "employee/register",
                element: <EmployeeRegisterForm />
            },
            {
                path: "employee/get-all-employees",
                element: <EmployeeDetails />
            },
            {
                path: "admins/register",
                element: <AdminRegisterForm />
            },
            {
                path: "admins/get-all-admins",
                element: <AdminList />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);


const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
