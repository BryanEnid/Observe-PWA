import React, { createContext, useContext } from 'react';
import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';

// Create the authentication context
const AuthContext = createContext({
	user: null,
	authToken: null,
	isLoading: false,
	login: () => {},
	logout: () => {}
});

// Create a custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export function AuthProvider({ children }) {
	const { user, authToken, isLoading, signInWithGoogle, signOut } = useAuthenticationProviders();

	// Function to log in
	const login = () => signInWithGoogle();

	// Function to log out
	const logout = () => signOut();

	// Context value
	const contextValue = {
		user: !isLoading && user ? user : null,
		authToken,
		login,
		logout,
		isLoading
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
