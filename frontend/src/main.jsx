import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/app.css";
import { AuthProvider } from "./context/AuthContext";
import Home from "./routes/home";
import Menu from "./routes/menu";
import Order from "./routes/order";
import Restaurant from "./routes/restaurant";
import User from "./routes/user";
import Login from "./routes/login";
import Signup from "./routes/signup";
import './styles/index.css';


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
    },
    {
        path: "/login", element: <Login />
    },
    {
        path: "/register", element: <Signup />
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root")); 
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default router;
