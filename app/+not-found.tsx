import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFound() {
	const router = useRouter();

	return (
		<SafeAreaView style={ styles.container }>
			<Text style={ styles.title }>404</Text>
			<Text style={ styles.lead }>Not Found</Text>
			<TouchableOpacity style={ styles.button } onPress={() => router.push( '/dashboard' )}>
				<Text style={ styles.buttonText }>Go Home</Text>
			</TouchableOpacity>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		paddingTop: 20,
		backgroundColor: "#f5f5f5",
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center"
	},
	lead: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	button: {
		paddingBlock: 8,
		paddingInline: 16,
		backgroundColor: "#7863FB",
		borderRadius: 4,
	},
	buttonText: {
		color: "#FFFFFF",
	}
})