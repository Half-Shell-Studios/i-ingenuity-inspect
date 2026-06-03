import { ReactNode, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

function ScrollViewContainer({ children, refreshCallback }: { children: ReactNode; refreshCallback?: () => Promise<void>; }) {
	const [ refreshing, setRefreshing ] = useState<boolean>( false );

	const handleRefresh = async () => {
		if( !refreshCallback ) return;
		setRefreshing( true );

		try {
			await refreshCallback();
		} catch( error ) {
			console.error( error );
		} finally {
			setRefreshing( false );
		}
	};
	
	return (
		<ScrollView contentContainerStyle={ styles.container } refreshControl={ <RefreshControl tintColor="#8e51ff" refreshing={ refreshing } onRefresh={ handleRefresh } /> }>
			<View>{ children }</View>
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