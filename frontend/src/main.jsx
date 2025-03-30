import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/app.css";

import Home from "./routes/home";
import Menu from "./routes/menu";
import Order from "./routes/order";
import Restaurant from "./routes/restaurant";
import User from "./routes/user";


const router = createBrowserRouter([
    {
        path: "/", element: <Home />
    },
    {
        path: "/menu", element: <Menu />
    },
    {
        path: "/order", element: <Order />
    },
    {
        path: "/restaurant", element: <Restaurant />
    },
    {
        path: "/user", element: <User />
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

export default router;
