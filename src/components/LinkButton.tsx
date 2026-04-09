import { Href, Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

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
		backgroundColor: "#7863FB",
		borderRadius: 4,
	},
	buttonText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		textAlign: "center"
	}
})