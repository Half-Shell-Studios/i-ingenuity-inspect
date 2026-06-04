import ScreenTitle from '@/src/components/ScreenTitle';
import ScrollViewContainer from '@/src/components/ScrollViewContainer';
import TouchableOpacityButton from '@/src/components/TouchableOpacityButton';
import { useAuth } from '@/src/context/AuthContext';
import { useWorkOrderDb } from '@/src/context/WorkOrderDbContext';
import { closeFault } from '@/src/db/queries/faults';
import type { Fault } from '@/src/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

export default function FaultShow() {
	const { user } = useAuth();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const router = useRouter();
	const { fault, assetTag } = useLocalSearchParams<{ fault: string, assetTag: string }>();
	const [ faultComment, setFaultComment ] = useState<string>('');
	const [ faultClosed, setFaultClosed ] = useState<boolean>(false);
	const [ loading, setLoading ] = useState<boolean>(false);

	const handleCloseFault = async () => {
		setLoading( true );

		if( dbIsReady && !!user ) {
			const result: Array<Fault> | undefined = await closeFault( db, fault, user?.id, faultComment );

			if( result ) {
				console.log( result[0].closedAt );
				setLoading( false );
			}
		}
	}

	return (
		<ScrollViewContainer>
			<ScreenTitle title="Close Fault" />
			<Text style={{ marginBottom: 10 }}>Fault Closure Comment</Text>
			<TextInput multiline numberOfLines={ 5 } placeholder="Fault closure comment..." value={ faultComment } onChangeText={ setFaultComment } textAlignVertical="top" style={ styles.input } />
			<TouchableOpacityButton label="Close Fault" pressHandler={ handleCloseFault } activity={ loading } />

			{/* TODO: Redirect back to fautls index */}
		</ScrollViewContainer>
	)
}

const styles = StyleSheet.create({
	input: {
		fontSize: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: "#8e51ff",
		borderRadius: 10,
		marginBottom: 16,
		minHeight: 200
	},
})