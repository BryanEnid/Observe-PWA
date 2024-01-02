import React from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useUser } from '@/hooks/useUser.js';

// React.useEffect(() => {
// 	const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
// 		if (authUser && !user?.id) {
// 			const data = {
// 				username: authUser.uid,
// 				photoURL: authUser.photoURL,
// 				name: authUser.displayName,
// 				email: authUser.email,
// 				providerData: authUser.providerData,
// 				reloadUserInfo: authUser.reloadUserInfo,
// 				uid: authUser.uid
// 			};
// 			await createUser(data);
// 		}

// 		setAuthToken(authUser?.accessToken);
// 		setUser((_user) => (authUser ? { ...authUser, id: _user?.id } : null));
// 		setLoading(false);
// 	});

// 	return () => {
// 		unsubscribe();
// 		// setLoading(true);
// 		setUser(null);
// 	};
// }, []);

const Pool_Data = {
	UserPoolId: 'eu-north-1_TICAwyFtg',
	ClientId: '70v4q090cg3ohbbaeasvda7qol'
};

export const useAuthenticationProviders = () => {
	// Hooks
	const { user, isLoading: isUserLoading, createUser, setUser, setLoading } = useUser({ authToken });

	// State
	const [authToken, setAuthToken] = React.useState(null);

	// Refs
	const userPool = new CognitoUserPool(Pool_Data);
	const currentUser = userPool.getCurrentUser();

	const signOut = () => {
		userPool.getCurrentUser()?.signOut();
		setUser(null);
	};

	const signInWithEmailAndPassword = ({ email, password }) => {
		const userAttributes = [];
		userPool.signUp(email, password, userAttributes, null, (err, data) => {});
	};

	const signInWithGoogle = () => {};

	return {
		userPool,
		user: React.useMemo(() => ({ aws: userPool.getCurrentUser(), user }), []),
		signOut, // signOutUser
		authToken,
		isLoading: false,
		signInWithGoogle,
		signInWithEmailAndPassword,
		createUser: () => {}
	};
};
