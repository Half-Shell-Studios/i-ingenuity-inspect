import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { ACCENT_COLOUR, BRAND_COLOUR_GREY } from '../constants/colours';

export default function Choice({ label, value, selected }: { label: string, value: string, selected: boolean }) {
	return (
		<View style={ styles.container }>
			<Text>{ label }</Text>
			{ selected ? (
				<Ionicons name="checkmark-circle" size={ 24 } color={ ACCENT_COLOUR } />
			) : (
				<Ionicons name="checkmark-circle-outline" size={ 24 } color={ BRAND_COLOUR_GREY } />
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 10,
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
	label: {
		flex: 1
	},
	icon: {
		flex: 0
	}
})