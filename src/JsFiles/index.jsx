
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import '../CssFiles/index.css';

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
import IndustryForm from "./IndustryForm";
import InventoryHome from "./InventoryHome";
import ReelForm from "./RegisterReelForm";
import ContactDetails from "./ContactDetails";
import SalaryRegister from "./SalaryRegister";
import SalaryDisplay from "./SalaryDisplay";
import OrderForm from "./OrderForm";
import BoxForm from "./BoxForm";
import AboutUs from "./AboutUs";
import IndustryWeServe from "./IndustryWeServe";
import BoxSectors from "./BoxSectors";
import SectorDetails from "./SectorDetails";
import ReelsInStock from "./ReelsInStock";
import ReelHistoryComponent from "./ReelHistoryComponent";
import ReelManipulationForm from "./ReelManipulationForm";
import OrderList from "./OrderList";
import OrderReelSuggestions from "./OrderReelSuggestions";
import ReelUsageSearch from "./ReelUsageSearch";
import ClientList from "./ClientList";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                path: "about",
                element: <AboutUs/>
            },
            {
                path: "contact",
                element: <ContactForm />
            },
            {
                path: "industries",
                element: <IndustryWeServe/>
            },{
                path: "products",
                element: <BoxSectors/>
            },{
                path: "sector/:sectorName",
                element: <SectorDetails/>
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
                        path: "admin/clients",
                        element: <ClientList/>
                    },
                    {
                        path: "admin/employee",
                        element: <RegisterEmployee />
                    },
                    {
                        path: "salary/register/:employeeId",
                        element: <SalaryRegister/>
                    },
                    {
                        path: "orders/:orderId/suggested-reels",
                        element: <OrderReelSuggestions />
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
                        path: "admin/inventory/reel",
                        element: <ReelsInStock/>
                    },
                    {
                        path: "admin/inventory/reel/usage",
                        element: <ReelUsageSearch/>
                    },
                    {
                        path: "admin/inventory/manipulateReel",
                        element: <ReelManipulationForm/>
                    },
                    {
                        path: "admin/inventory",
                        element: <InventoryHome/>,
                    },
                    {
                        path: "admin/salary",
                        element: <SalaryDisplay/>
                    },
                    {
                        path: "admin/register-industry",
                        element: <IndustryForm/>
                    },{
                        path: "admin/inventory/create-reel",
                        element: <ReelForm/>
                    },
                    {
                        path: "admin/inventory/reel-history/:barcodeId",
                        element: <ReelHistoryComponent/>
                    },
                    {
                        path: "admin/contact/contactDetails",
                        element: <ContactDetails/>
                    },{
                        path: "admin/order-create",
                        element: <OrderForm/>
                    },{
                        path: "admin/box/boxCreate",
                        element: <BoxForm/>
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
