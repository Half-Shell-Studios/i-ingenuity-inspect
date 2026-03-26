import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function CardsContainer({ children }: { children: ReactNode }) {
	return (
		<View style={ styles.cards }>
			{ children }
		</View>
	);
}

const styles = StyleSheet.create({
	cards: {
		gap: 16,
		marginBottom: 32
	},
});