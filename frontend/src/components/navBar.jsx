import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, setUser, setSelectedRestaurant } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        setSelectedRestaurant(null); // Assuming you have a setSelectedRestaurant function in your context
        localStorage.clear();
        navigate("/");

    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-xl font-semibold text-gray-800">Restaurant App</div>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="px-4 py-2 bg-white text-blue-900 rounded font-bold hover:bg-gray-100">Home</Link>
                    {user && user.role === "owner" && (
                        <Link to="/menu" className="px-4 py-2 bg-white text-blue-900 rounded font-bold hover:bg-gray-100">Menu</Link>
                    )}
                    <Link to="/order" className="px-4 py-2 bg-white text-blue-900 rounded font-bold hover:bg-gray-100">Order</Link>
                    {user && user.role === "owner" && (
                        <Link to="/restaurant" className="px-4 py-2 bg-white text-blue-900 rounded font-bold hover:bg-gray-100">
                            Restaurant
                        </Link>
                    )}
                    <Link to="/user" className="px-4 py-2 bg-white text-blue-900 rounded font-bold hover:bg-gray-100">Profile</Link>

                    {user ? (
                        <>
                            <span className="text-sm text-gray-700">Hello, {user.username}</span>
                            <button
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Login</Link>
                            <Link to="/register" className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
