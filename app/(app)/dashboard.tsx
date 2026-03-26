import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function DashboardScreen() {
	const { user } = useAuth();
	const router = useRouter();

	return (
		<ScrollViewContainer>
			<Text style={ styles.greeting }>Hello, { user?.name }!</Text>
			<Text style={ styles.intro }>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid dolor rerum numquam ullam consequuntur odit tenetur dolorum, voluptate impedit!</Text>
			<Button title="View All Work Orders" onPress={() => router.push( `/work-orders` )} />
		</ScrollViewContainer>
	);
}

const styles = StyleSheet.create({
	greeting: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 32,
	},
	intro: {
		fontSize: 20,
		marginBottom: 16,
	},
});