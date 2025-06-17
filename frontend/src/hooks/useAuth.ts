import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>(() => ({
        isAuthenticated: !!localStorage.getItem('auth_token'),
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        token: localStorage.getItem('auth_token'),
    }));

    const navigate = useNavigate();

    const login = useCallback((token: string, user: User) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            isAuthenticated: true,
            user,
            token,
        });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
        });
        navigate('/login');
    }, [navigate]);

    // Check token expiration on mount and when token changes
    useEffect(() => {
        if (!authState.token) return;

        // Add any token validation logic here if needed
        // For example, check if the token is expired
        // If expired, call logout()
    }, [authState.token]);

    return {
        ...authState,
        login,
        logout,
    };
}; 