import DashboardIcon from '@/assets/icons/dashboard.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import WorkOrderIcon from '@/assets/icons/work-orders.svg';
import { ACCENT_COLOUR } from '@/src/constants/colours';
import { setLastRoute } from '@/src/utils/storage';
import { Tabs, usePathname } from 'expo-router';
import { getFocusedRouteNameFromRoute } from 'expo-router/build/react-navigation';
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
		tabBarActiveTintColor: ACCENT_COLOUR,
	}
}

export default function AppLayout() {
	const pathname = usePathname();

	useEffect(() => {
		const route = pathname.replace("/", "");
		if( route ) {
			setLastRoute( route );
		}
	}, [pathname]);

	return (<>
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="dashboard" options={{
				...tabOptions( 'Dashboard' ),
				headerShown: true,
				tabBarIcon: ({ color, size }) => (
					<DashboardIcon width={ size } height={ size } stroke={ color } />
				),
			}} />
			<Tabs.Screen name="work-orders" options={({ route }) => {
				const focused = getFocusedRouteNameFromRoute( route ) ?? "index";
				return {
					...tabOptions( 'Work Orders' ),
					tabBarStyle: focused === "[workOrder]" ? { display: "none" } : undefined,
					tabBarIcon: ({ color, size }) => (
						<WorkOrderIcon width={ size } height={ size } stroke={ color } />
					),
				};
			}} />
			<Tabs.Screen name="settings" options={{
				...tabOptions( 'Settings' ),
				headerShown: true,
				tabBarIcon: ({ color, size }) => (
					<SettingsIcon width={ size } height={ size } stroke={ color } />
				),
			}} />
		</Tabs>
	</>);
}