import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function ScreenTitle({ title }: { title?: string }) {
	return (
		<View>
			<Text style={ styles.title }>{ title }</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20
	}
})