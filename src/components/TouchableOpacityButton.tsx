import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Colour = 'primary' | 'error' | 'success';

const colourMap: Record<Colour, string> = {
	primary: '#7863FB',
	error: '#E5484D',
	success: '#30A46C',
};

export default function TouchableOpacityButton({ label, pressHandler, activity = false, colour = 'primary' }: { label: string, pressHandler: (event: GestureResponderEvent) => void; activity?: boolean, colour?: Colour }) {
	return (
		<TouchableOpacity style={[styles.button, { backgroundColor: colourMap[colour] }]} onPress={ pressHandler }>
			<Text style={ styles.buttonText }>
				{ activity ? <ActivityIndicator color="#fff" /> : label }
			</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
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