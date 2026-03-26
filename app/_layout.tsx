import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { getLastRoute } from "../src/utils/storage";

const VALID_APP_ROUTES = [ "dashboard" ] as const;
type AppRoute = (typeof VALID_APP_ROUTES)[number];

function isValidAppRoute( route: string | null ): route is AppRoute {
	return VALID_APP_ROUTES.includes( route as AppRoute );
}

function AuthGate() {
	const { isLoading, isAuthenticated } = useAuth();
	const segments = useSegments();
	const router = useRouter();
	const [ hasRedirected, setHasRedirected ] = useState(false);

	useEffect(() => {
		if( isLoading ) return;

		const inAuthGroup = segments[0] === "(auth)";

		if( !isAuthenticated && !inAuthGroup ) {
			router.replace( "/(auth)/login" );
			setHasRedirected( true );
			return;
		}

	if( isAuthenticated && inAuthGroup ) {
		// Authenticated user landing — restore last route or dashboard
		(async () => {
			const lastRoute = await getLastRoute();
			const target = isValidAppRoute( lastRoute ) ? lastRoute : "dashboard";
			router.replace( `/(app)/${target}` );
			setHasRedirected( true );
		})();

		return;
	}

	// First load when authenticated and already in app group
	if( isAuthenticated && !hasRedirected && segments[0] !== "(app)" ) {
		(async () => {
			const lastRoute = await getLastRoute();
			const target = isValidAppRoute( lastRoute ) ? lastRoute : "dashboard";
			router.replace( `/(app)/${target}` );
			setHasRedirected( true );
		})();
	}
	}, [ isLoading, isAuthenticated, segments ] );

	if( isLoading ) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#4f46e5" />
			</View>
		);
	}

	return <Slot />;
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<AuthGate />
		</AuthProvider>
	);
}