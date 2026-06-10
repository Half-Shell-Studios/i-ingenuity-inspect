import Card from '@/src/components/Card';
import CardsContainer from '@/src/components/CardsContainer';
import ScreenTitle from '@/src/components/ScreenTitle';
import ScrollViewContainer from '@/src/components/ScrollViewContainer';
import { useWorkOrderDb } from '@/src/context/WorkOrderDbContext';
import { getClosedFaults, getOpenFaults } from '@/src/db/queries/faults';
import { Fault } from '@/src/types';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

export default function FaultsIndex() {
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ openFaults, setOpenFaults ] = useState<Fault[]>([]);
	const [ closedFaults, setClosedFaults ] = useState<Fault[]>([]);
	const [ loading, setLoading ] = useState<boolean>( false );

	useEffect(() => {
		if( dbIsReady ) {
			loadFaults();
		}
	}, [ db ]);

	useEffect(() => {
		if( dbError ) {
			console.error( dbError )
		}
	}, [ dbError ]);

	async function refreshCallback() {
		await loadFaults();
	}

	async function loadFaults() {
		setLoading( true );

		try {
			setOpenFaults( await getOpenFaults( db ) );
			setClosedFaults( await getClosedFaults( db ) );
		} catch( error ) {
			console.error("Failed to load faults:", error);
		} finally {
			setLoading( false );
		}
	}

	return (<>
		<ScrollViewContainer refreshCallback={ refreshCallback }>
			{openFaults.length && (<>
				<ScreenTitle title={ `Open Faults (${ openFaults.length })` } />
				<CardsContainer>
					{openFaults.map( fault => (
						<Card key={ fault.id }>
							<Text>{ fault.raisedComment }</Text>
							<Text>{ JSON.stringify( fault ) }</Text>
						</Card>
					))}
				</CardsContainer>
			</>)}
			{closedFaults.length && (<>
				<ScreenTitle title={ `Closed Faults (${ closedFaults.length })` } />
				<CardsContainer>
					{closedFaults.map( fault => (
						<Card key={ fault.id }>
							<Text>{ fault.raisedComment }</Text>
						</Card>
					))}
				</CardsContainer>
			</>)}
		</ScrollViewContainer>
	</>);
}

const styles = StyleSheet.create({})