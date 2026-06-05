import { AUTH_ROUTE, DEFAULT_ROUTE } from '@/src/constants/routes';
import { useAuth } from '@/src/context/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? <Redirect href={ DEFAULT_ROUTE } /> : <Redirect href={ AUTH_ROUTE } />;
}