import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export default function GridColumn({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) {
	return (
		<View style={[ defaultStyles.columnContainer, style ]}>
			{ children }
		</View>
	)
}

const defaultStyles = StyleSheet.create({
	columnContainer: {
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: 'auto',
	}
})