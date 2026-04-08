import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function TouchableOpacityButton({ label, pressHandler }: { label: string,   pressHandler: (event: GestureResponderEvent) => void; }) {
	return (
		<TouchableOpacity style={ styles.button } onPress={ pressHandler }>
			<Text style={ styles.buttonText }>
				{ label }
			</Text>
		</TouchableOpacity>
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