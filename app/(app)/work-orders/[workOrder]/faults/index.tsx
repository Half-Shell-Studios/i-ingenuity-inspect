import Card from '@/src/components/Card';
import CardsContainer from '@/src/components/CardsContainer';
import CardTitle from '@/src/components/CardTitle';
import ScrollViewContainer from '@/src/components/ScrollViewContainer';
import { useWorkOrderDb } from '@/src/context/WorkOrderDbContext';
import { getOpenFaults } from '@/src/db/queries/faults';
import { Fault } from '@/src/types';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

export default function FaultsIndex() {
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ openFaults, setOpenFaults ] = useState<Fault[]>([]);
	const [ closedFaults, setClosedFaults ] = useState<Fault[]>([]);

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setOpenFaults( await getOpenFaults( db ) ?? [] );
				setClosedFaults( await getOpenFaults( db ) ?? [] );
			})();
		}
	}, [ db ]);

	useEffect(() => {
		if( dbError ) {
			console.error( dbError )
		}
	}, [ dbError ]);

	return (<>
		<ScrollViewContainer>
			{openFaults.length && (
				<CardsContainer>
					<Card>
						<CardTitle title={ `Open Faults (${ openFaults.length })` } />
					</Card>
					{openFaults.map( fault => (
						<Card key={ fault.id }>
							<Text>{ fault.raisedComment }</Text>
							<Text>{ JSON.stringify( fault ) }</Text>
						</Card>
					))}
				</CardsContainer>	
			)}
			{closedFaults.length && (
				<CardsContainer>
					<Card>
						<CardTitle title={ `Closed Faults (${ closedFaults.length })` } />
					</Card>
					{closedFaults.map( fault => (
						<Card key={ fault.id }>
							<Text>{ fault.raisedComment }</Text>
						</Card>
					))}
				</CardsContainer>
			)}
		</ScrollViewContainer>
	</>);
}

const styles = StyleSheet.create({})