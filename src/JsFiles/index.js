
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import App from "./App";
import NotFound from "./Error";

const router = createBrowserRouter([
    {
        path: "/",
        element : <App/>,
        errorElement: <NotFound />
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
