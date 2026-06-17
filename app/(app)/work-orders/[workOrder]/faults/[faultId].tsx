import Card from '@/src/components/Card';
import CardsContainer from '@/src/components/CardsContainer';
import CardTitle from '@/src/components/CardTitle';
import GridColumn from '@/src/components/GridColumn';
import GridRow from '@/src/components/GridRow';
import ScreenTitle from '@/src/components/ScreenTitle';
import ScrollViewContainer from '@/src/components/ScrollViewContainer';
import TouchableOpacityButton from '@/src/components/TouchableOpacityButton';
import { ACCENT_COLOUR } from '@/src/constants/colours';
import { useAuth } from '@/src/context/AuthContext';
import { useWorkOrderDb } from '@/src/context/WorkOrderDbContext';
import { closeFault, getFaultById } from '@/src/db/queries/faults';
import type { Fault } from '@/src/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function FaultShow() {
	const { user } = useAuth();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const router = useRouter();
	const { faultId } = useLocalSearchParams<{ faultId: string }>();
	const [ fault, setFault ] = useState<Fault>();
	const [ faultComment, setFaultComment ] = useState<string>('');
	const [ loading, setLoading ] = useState<boolean>(false);

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setFault( await getFaultById( db, faultId ) );
			})();
		}
	}, [ db, faultId ]);

	const handleCloseFault = async () => {
		setLoading( true );

		if( dbIsReady && !!user ) {
			const result: Array<Fault> | undefined = await closeFault( db, faultId, user?.id, faultComment );

			if( result ) {
				console.log( result[0].closedAt );
				setLoading( false );
			}
		}
	}

	return (<>
		<Stack.Screen options={{ title: fault?.faultCode?.name ?? "Close Fault" }} />
		<ScrollViewContainer>
			<ScreenTitle title="Close Fault" />
			<CardsContainer>
				<Card>
					<View style={{ marginBottom: 20 }}>
						<CardTitle title="Fault Code" />
					</View>
					<GridRow>
						<GridColumn style={{ marginRight: 5 }}>
							<View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: fault?.faultCode?.colour }}></View>
						</GridColumn>
						<GridColumn>
							<Text>{ fault?.faultCode?.name }</Text>
							<Text>{ fault?.faultCode?.description }</Text>
						</GridColumn>
					</GridRow>
				</Card>
			</CardsContainer>
			<Text style={{ marginBottom: 10 }}>Fault Closure Comment</Text>
			<TextInput multiline numberOfLines={ 5 } placeholder="Fault closure comment..." value={ faultComment } onChangeText={ setFaultComment } textAlignVertical="top" style={ styles.input } />
			<TouchableOpacityButton label="Close Fault" pressHandler={ handleCloseFault } activity={ loading } />

			{/* TODO: Redirect back to fautls index */}
		</ScrollViewContainer>
	</>)
}

const styles = StyleSheet.create({
	input: {
		fontSize: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: ACCENT_COLOUR,
		borderRadius: 10,
		marginBottom: 16,
		minHeight: 200
	},
})