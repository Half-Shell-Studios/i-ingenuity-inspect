import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function Card({ children }: { children: ReactNode }) {
	return (
		<View style={ styles.card }>
			{ children }
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 20,
		backgroundColor: "#f9fafb",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		marginBottom: 10,
	},
});