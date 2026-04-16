import { StyleSheet, Text } from "react-native";

function CardTitle({ title }: { title: string | number }) {

	return (
		<Text style={ styles.cardTitle }>
			{ title }
		</Text>
	);
}

const styles = StyleSheet.create({
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
})

export default CardTitle