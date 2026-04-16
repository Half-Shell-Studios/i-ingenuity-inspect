import { setLastRoute } from '@/src/utils/storage';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

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
				title: "Work Orders",
			}} />
			<Stack.Screen name="work-orders/[workOrder]" options={{
				title: "Work Order Details",
			}} />
			<Stack.Screen name="asset-tags/index" options={{
				title: "Asset Tags",
			}} />
			<Stack.Screen name="asset-tags/[assetTag]" options={{
				title: "Asset Tag Details",
			}} />
			<Stack.Screen name="inspections/index" options={{
				title: "Inspections",
			}} />
			<Stack.Screen name="inspections/create" options={{
				title: "Inspect a Tag",
			}} />
			<Stack.Screen name="inspections/[inspection]/edit" options={{
				title: "Inspect a Tag",
			}} />
			<Stack.Screen name="inspections/[inspection]/index" options={{
				title: "Inspection Details",
			}} />
			<Stack.Screen name="faults/[fault]" options={{
				title: "Close a Fault",
			}} />
		</Stack>
	);
}