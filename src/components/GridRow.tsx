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
		alignItems: 'center',
		gap: 10,
		marginBottom: 20
	}
})

export default GridRow