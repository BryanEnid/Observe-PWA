import React, { useState } from 'react';
import {
	getAuth,
	onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	signInWithRedirect
} from 'firebase/auth';

import { useUser } from '@/hooks/useUser.js';
import { app } from '@/config/firebase';

export const useAuthenticationProviders = () => {
	// Initialize Firebase Auth
	const auth = getAuth(app);
	const [authToken, setAuthToken] = useState(null);

	// Function to sign out
	const signOutUser = async () => signOut(auth).then(() => setUser(null));

	const {
		user,
		isLoading: isUserLoading,
		createUser,
		setUser,
		setLoading
	} = useUser({
		authToken,
		logout: signOutUser
	});

	React.useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
			if (authUser && !user?.id) {
				const data = {
					username: authUser.uid,
					photoURL: authUser.photoURL,
					name: authUser.displayName,
					email: authUser.email,
					providerData: authUser.providerData,
					reloadUserInfo: authUser.reloadUserInfo,
					uid: authUser.uid
				};
				await createUser(data);
			}

			setAuthToken(authUser?.accessToken);
			setUser((_user) => (authUser ? { ...authUser, id: _user?.id } : null));
			setLoading(false);
		});

		return () => {
			unsubscribe();
			// setLoading(true);
			setUser(null);
		};
	}, []);

	// Function to sign in with Google
	const signInWithGoogle = async () => {
		// Get from provider
		const provider = new GoogleAuthProvider();
		// provider.addScope('https://www.googleapis.com/auth/cloud-platform');

		// return signInWithRedirect(auth, provider);
		await signInWithPopup(auth, provider);
	};

	return {
		user,
		authToken,
		isLoading: isUserLoading,
		signInWithGoogle,
		signOutUser,
		createUser
	};
};
