import React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

function GridRow({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) {
	return (
		<View style={[ styles.row, style ]}>
			{ children }
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start'
	}
})

export default GridRow