import { Href, Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { ACCENT_COLOUR } from '../constants/colours';

export default function LinkButton({ label, href }: { label: string, href: Href }) {
	return (
		<Link style={ styles.button } href={ href }>
			<Text style={ styles.buttonText }>
				{ label }
			</Text>
		</Link>
	)
}

const styles = StyleSheet.create({
	button: {
		paddingBlock: 8,
		paddingInline: 16,
		backgroundColor: ACCENT_COLOUR,
		borderRadius: 4,
	},
	buttonText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		textAlign: "center"
	}
})