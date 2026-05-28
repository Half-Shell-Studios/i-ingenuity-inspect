import React, { useEffect, useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function TouchableOpacityButton({ label, pressHandler, activity = false }: { label: string, pressHandler: (event: GestureResponderEvent) => void; activity?: boolean }) {
	const [ showsActivity, setShowsActivity ] = useState<boolean>(false);

	useEffect(() => {
		setShowsActivity( activity );
	}, [ activity ]);

	return (
		<TouchableOpacity style={ styles.button } onPress={ pressHandler }>
			<Text style={ styles.buttonText }>
				{ showsActivity ? <ActivityIndicator color="#fff" /> : label }
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