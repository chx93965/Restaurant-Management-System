import { useState} from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/home.css';

function Home() {
    console.log("Home component loaded!");
    const [message, setMessage] = useState(null);

    return (
        <div className="home">
            <h1>Welcome to the Restaurant App</h1>
            <p>Your one-stop solution to manage and explore restaurants!</p>
            <div className="home-buttons">
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn">Register</Link>
            </div>
        </div>
    );
};

export default Home;
