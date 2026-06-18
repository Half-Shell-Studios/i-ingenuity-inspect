import { StyleSheet, Text, View } from 'react-native'
import { BRAND_COLOUR_DARK_GREY } from '../constants/colours'

export default function CardLabel({ title }: { title: string }) {
	return (
		<View>
			<Text style={ styles.lead }>{ title }</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	lead: {
		fontSize: 10,
		color: BRAND_COLOUR_DARK_GREY,
	}
})