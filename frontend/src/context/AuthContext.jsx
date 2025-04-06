import { createContext, useState, useContext, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }) => {
    // User state, checking localStorage for persisted user data
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Selected restaurant state, checking localStorage for persisted restaurant data
    const [selectedRestaurant, setSelectedRestaurant] = useState(() => {
        const storedRestaurant = localStorage.getItem('selectedRestaurant');
        return storedRestaurant ? JSON.parse(storedRestaurant) : null;
    });

    // Whenever the user changes, persist it to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Whenever the selected restaurant changes, persist it to localStorage
    useEffect(() => {
        if (selectedRestaurant) {
            localStorage.setItem('selectedRestaurant', JSON.stringify(selectedRestaurant));
        } else {
            localStorage.removeItem('selectedRestaurant');
        }
    }, [selectedRestaurant]);

    // Logout function to clear context and localStorage
    const handleLogout = () => {
        setUser(null);  // Clear user from context
        localStorage.removeItem('user');  // Remove user from localStorage
        setSelectedRestaurant(null); // Clear selected restaurant from context
        localStorage.removeItem('selectedRestaurant'); // Remove selected restaurant from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, setUser, handleLogout, selectedRestaurant, setSelectedRestaurant }}>
            {children}
        </AuthContext.Provider>
    );
};
