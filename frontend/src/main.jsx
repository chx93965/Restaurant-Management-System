import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/app.css";

import home from "./routes/home";
import menu from "./routes/menu";
import order from "./routes/order";
import restaurant from "./routes/restaurant";
import user from "./routes/user";


const router = createBrowserRouter([
    {
        path: "/", element: <home />
    },
    {
        path: "/menu", element: <menu />
    },
    {
        path: "/order", element: <order />
    },
    {
        path: "/restaurant", element: <restaurant />
    },
    {
        path: "/user/:uid", element: <user />
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

export default router;
