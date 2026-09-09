import { WorkOrderDbProvider } from "@/src/context/WorkOrderDbContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { clearSecureStore, getLastRoute } from "../src/utils/storage";
import { AUTH_ROUTE, sanitizeLastRoute } from "@/src/constants/routes";

function AuthGate() {
	const { isLoading, isAuthenticated } = useAuth();
	const segments = useSegments();
	const router = useRouter();
	const [ hasRedirected, setHasRedirected ] = useState( false );

	useEffect(() => {
		if( isLoading ) return;

		const inAuthGroup = segments[0] === '(auth)';

		if( !isAuthenticated ) {
			clearSecureStore();
		}

		if( !isAuthenticated && !inAuthGroup ) {
			router.replace( AUTH_ROUTE );
			setHasRedirected( true );
			return;
		}

		if( isAuthenticated && inAuthGroup ) {
			(async () => {
				const lastRoute = await getLastRoute();
				router.replace( sanitizeLastRoute( lastRoute ) );
				setHasRedirected( true );
			})();
			return;
		}

		if( isAuthenticated && !hasRedirected && segments[0] !== '(app)' ) {
			(async () => {
				const lastRoute = await getLastRoute();
				router.replace( sanitizeLastRoute( lastRoute ) );
				setHasRedirected( true );
			})();
		}
	}, [ isLoading, isAuthenticated, segments ]);

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
			<WorkOrderDbProvider>
				<AuthGate />
			</WorkOrderDbProvider>
		</AuthProvider>
	);
}