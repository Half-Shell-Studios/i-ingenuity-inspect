import { ReactNode } from "react"
import { View } from "react-native"

function GridRow({ children }: { children: ReactNode }) {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
			{ children }
		</View>
	)
}

export default GridRow