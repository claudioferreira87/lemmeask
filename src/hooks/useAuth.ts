import { useContext } from 'react';
import { authContext } from '../contexts/AuthContext';

export function useAuth() {
	const auth = useContext(authContext);

	return auth;
}
