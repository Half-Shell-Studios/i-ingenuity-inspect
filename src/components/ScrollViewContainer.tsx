import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

function ScrollViewContainer({ children }: { children: ReactNode }) {
	return (
		<ScrollView>
			<View style={ styles.container }>
				{ children }
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		paddingTop: 20,
		backgroundColor: "#f5f5f5"
	},
});

export default ScrollViewContainer