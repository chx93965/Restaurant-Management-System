import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Main from './main';
import { AuthProvider } from "./context/AuthContext";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <React.StrictMode>
//         <Main />
//     </React.StrictMode>
// );

ReactDOM.render(
    <AuthProvider>
        <Main />
    </AuthProvider>,
    document.getElementById('root')
);
