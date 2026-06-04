import { setLastRoute } from '@/src/utils/storage';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

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

	return (
		<Stack>
			<Stack.Screen name="dashboard" options={{
				title: "Dashboard"
			}} />
			<Stack.Screen name="work-orders/index" options={{
				title: "Work Orders"
			}} />
			<Stack.Screen name="work-orders/[workOrder]" options={{
				title: 'Work Order Details'
			}} />
			{/* <Stack.Screen name="asset-tags/index" options={ stackOptions( 'Asset Tags' ) } /> */}
			{/* <Stack.Screen name="asset-tags/[assetTag]" options={ stackOptions( 'Asset Tag Details' ) } /> */}
			{/* <Stack.Screen name="inspections/index" options={ stackOptions( 'Inspections' ) } /> */}
			{/* <Stack.Screen name="inspections/create" options={ stackOptions( 'Inspect a Tag' ) } /> */}
			{/* <Stack.Screen name="inspections/[inspection]/edit" options={ stackOptions( 'Inspect a Tag' ) } /> */}
			{/* <Stack.Screen name="inspections/[inspection]/index" options={ stackOptions( 'Inspection Details' ) } /> */}
			{/* <Stack.Screen name="faults/[fault]" options={ stackOptions( 'Close a Fault' ) } /> */}
		</Stack>
	);
}