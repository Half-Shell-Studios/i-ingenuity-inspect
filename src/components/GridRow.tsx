import { ReactNode } from "react"
import { StyleSheet, View } from "react-native"

function GridRow({ children }: { children: ReactNode }) {
	return (
		<View style={ styles.row }>
			{ children }
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	}
})

export default GridRow