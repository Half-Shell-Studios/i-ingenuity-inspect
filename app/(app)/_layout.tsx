import { setLastRoute } from '@/src/utils/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export function stackOptions( defaultTitle: string ) {
	return {
		title: defaultTitle,
		headerShown: false,
	}
}

export function tabOptions( defaultTitle: string ) {
	return {
		...stackOptions( defaultTitle ),
		tabBarActiveTintColor: "#7863FB",
	}
}

export default function AppLayout() {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const route = pathname.replace("/", "");
		if( route ) {
			setLastRoute( route );
		}
	}, [pathname]);

	const BackButton = () => (
		<Pressable onPress={() => router.push( '/work-orders' )} hitSlop={ 10 }>
			<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
				<Ionicons name="chevron-back" size={ 24 } color="#000" /><Text>Dashboard</Text>
			</View>
		</Pressable>
	);

	return (
		<Stack screenOptions={{ headerBackVisible: false }}>
			<Stack.Screen name="dashboard" options={{
				title: "Dashboard",
			}} />
			<Stack.Screen name="work-orders/index" options={{
				title: "Work Orders"
			}} />
			<Stack.Screen name="work-orders/[workOrder]" options={{
				title: 'Work Order Details',
				headerShown: true,
				headerLeft: () => <BackButton />,
				headerBackVisible: false
			}} />
		</Stack>
	);
}