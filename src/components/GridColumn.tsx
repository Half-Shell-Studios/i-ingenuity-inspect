import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export default function GridColumn({ children, styles }: { children: React.ReactNode, styles?: StyleProp<ViewStyle> }) {
	return (
		<View style={[ defaultStyles.columnContainer, styles ]}>
			{ children }
		</View>
	)
}

const defaultStyles = StyleSheet.create({
	columnContainer: {
		flex: 1,
		paddingInline: 10
	}
})