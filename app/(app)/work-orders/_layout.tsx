import { setLastRoute } from '@/src/utils/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

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
		<Pressable onPress={() => router.dismissTo( '/work-orders' )} hitSlop={ 10 }>
			<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
				<Ionicons name="chevron-back" size={ 24 } color="#000" /><Text>Work Orders</Text>
			</View>
		</Pressable>
	);

	return (
		<Stack screenOptions={{ headerBackVisible: false }}>
			<Stack.Screen name="index" options={{
				title: "Work Orders"
			}} />
			<Stack.Screen name="[workOrder]" options={{
				title: 'Work Order Details',
				headerShown: true,
				headerLeft: () => <BackButton />,
				headerBackVisible: false
			}} />
		</Stack>
	);
}