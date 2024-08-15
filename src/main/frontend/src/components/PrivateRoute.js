import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                return;
            }
            try {
                const response = await axios.get('https://allinone-spring.com/api/validate-token', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Token validation response:', response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token validation error:', error.response);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            }
        };

        validateToken();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;