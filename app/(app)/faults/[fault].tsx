import ScreenTitle from '@/src/components/ScreenTitle';
import ScrollViewContainer from '@/src/components/ScrollViewContainer';
import TouchableOpacityButton from '@/src/components/TouchableOpacityButton';
import { useAuth } from '@/src/context/AuthContext';
import { useWorkOrderDb } from '@/src/context/WorkOrderDbContext';
import { closeFault } from '@/src/db/queries/faults';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

export default function FaultShow() {
	const { user } = useAuth();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const router = useRouter();
	const { fault, assetTag } = useLocalSearchParams<{ fault: string, assetTag: string }>();
	const [ faultComment, setFaultComment ] = useState<string>('');

	const handleCloseFault = async () => {
		if( dbIsReady && !!user ) {
			await closeFault( db, fault, user?.id, faultComment );
		}
	}

	return (
		<ScrollViewContainer>
			<ScreenTitle title="Close Fault" />
			<Text>Fault Closure Comment</Text>
			<TextInput multiline numberOfLines={ 5 } placeholder="Fault closure comment..." value={ faultComment } onChangeText={ setFaultComment } textAlignVertical="top" style={ styles.input } />
			<TouchableOpacityButton label="Close Fault" pressHandler={ handleCloseFault } />
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