import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import React from 'react';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/restaurant/:restaurantId" element={<Restaurant />} />
            </Routes>
        </Router>
    );
};

export default App;
