import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.role) {
            setRole(userData.role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setRole(null);
    }

    return (
        <div className="home">
            {/* Logout */}
            {role && (
                <div className="user-info">
                    <span>Role: {role}</span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            )}

            <h1>Welcome to the Restaurant App</h1>
            <p>Your one-stop solution to manage and explore restaurants!</p>
            <div className="home-buttons">
                <Link to="/menu" className="btn">Menu</Link>
                <Link to="/order" className="btn">Order</Link>
                {role === "manager" && <Link to="/restaurant" className="btn">Restaurant</Link>}
                <Link to="/user" className="btn">Profile</Link>
            </div>
        </div>
    );
}

export default Home;
