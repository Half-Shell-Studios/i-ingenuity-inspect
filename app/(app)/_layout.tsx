import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { useEffect } from "react";
import { setLastRoute } from "../../src/utils/storage";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function AppLayout() {
	const pathname = usePathname();

	useEffect(() => {
		// Strip the leading slash to get the route name
		const route = pathname.replace("/", "");
		if( route ) {
			setLastRoute( route );
		}
	}, [ pathname ]);

	return (
		<Tabs screenOptions={({ route }) => ({ tabBarIcon: ({ focused, color, size }) => {
				const icons: Record<string, IoniconsName> = {
					dashboard: focused ? "home" : "home-outline",
					profile: focused ? "person" : "person-outline",
					settings: focused ? "settings" : "settings-outline",
				};
				
				return (
					<Ionicons name={icons[route.name] ?? "ellipse-outline"} size={size} color={color} />
				);
			},
			tabBarActiveTintColor: "#4f46e5",
			tabBarInactiveTintColor: "#9ca3af",
		})}>
			<Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
			<Tabs.Screen name="profile" options={{ title: "Profile" }} />
			<Tabs.Screen name="settings" options={{ title: "Settings" }} />
		</Tabs>
	);
}