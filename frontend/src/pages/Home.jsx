import React from 'react';
import RestaurantList from '../components/RestaurantList';
import './Home.css'; // Import CSS file

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Restaurant App</h1>

            {/* Login/Sign Up Buttons */}
            <div className="button-container">
                <button className="login-button">Login</button>
                <button className="signup-button">Sign Up</button>
            </div>

            <RestaurantList />
        </div>
    );
};

export default Home;
