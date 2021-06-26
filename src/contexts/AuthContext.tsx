import { createContext, ReactNode, useEffect, useState } from 'react';

import { auth, firebase } from '../services/firebase';

type User = {
	id: string;
	name: string;
	avatar: string;
};

type AuthContextProviderProps = {
	children: ReactNode;
};

type AuthContextType = {
	user: User | undefined;
	signInWhithGoogle: () => Promise<void>;
};

export const authContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
	const [user, setUser] = useState<User>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				const { displayName, photoURL, uid } = user;

				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.');
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL,
				});
				setLoading(false);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	async function signInWhithGoogle() {
		const provider = new firebase.auth.GoogleAuthProvider();
		const result = await auth.signInWithPopup(provider);

		if (result.user) {
			const { displayName, photoURL, uid } = result.user;

			if (!displayName || !photoURL) {
				throw new Error('Missing information from Google Account.');
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL,
			});
		}
	}

	if (loading) return <h1>Carregando...</h1>;

	return <authContext.Provider value={{ user, signInWhithGoogle }}>{props.children}</authContext.Provider>;
}
