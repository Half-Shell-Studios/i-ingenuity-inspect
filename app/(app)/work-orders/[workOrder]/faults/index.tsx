import Card from '@/src/components/Card';
import CardsContainer from '@/src/components/CardsContainer';
import CardTitle from '@/src/components/CardTitle';
import GridColumn from '@/src/components/GridColumn';
import GridRow from '@/src/components/GridRow';
import ScreenTitle from '@/src/components/ScreenTitle';
import ScrollViewContainer from '@/src/components/ScrollViewContainer';
import { useWorkOrderDb } from '@/src/context/WorkOrderDbContext';
import { getClosedFaults, getOpenFaults } from '@/src/db/queries/faults';
import { Fault } from '@/src/types';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function FaultCard({ fault }: { fault: Fault }) {
	if( !fault.assetTag ) return <Text>Tag not found</Text>

	return (
		<Card>
			<CardTitle title={ fault.faultCodeId } />
			{ !!fault.assetTag.location && (
				<View style={{ marginBottom: 10 }}>
					<Text style={{ fontSize: 12, color: "#6b7280" }}>Location</Text>
					<GridRow>
						<GridColumn>
							<Text>{ fault.assetTag.location.customerName }&nbsp;&gt;&nbsp;</Text>
						</GridColumn>
						<GridColumn>
							<Text>{ fault.assetTag.location.siteName }&nbsp;&gt;&nbsp;</Text>
						</GridColumn>
						<GridColumn>
							<Text>{ fault.assetTag.location.plantName }&nbsp;&gt;&nbsp;</Text>
						</GridColumn>
						<GridColumn>
							<Text>{ fault.assetTag.location.areaName }</Text>
						</GridColumn>
					</GridRow>
				</View>
			)}
			<View style={{ marginBottom: 10 }}>
				<Text style={{ fontSize: 12, color: "#6b7280" }}>Asset Tag</Text>
				<CardTitle title={ fault.assetTag.name } />
			</View>
			<Text style={{ fontSize: 12, color: "#6b7280" }}>Fault Details</Text>
			<Text>
				{ `${fault.section} - ${fault.question}` }
			</Text>
			<Text>{ fault.raisedComment }</Text>
		</Card>
	)
}

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
			{/* TODO: Add filter to show open vs closed */}
			{!!openFaults.length && (<>
				<ScreenTitle title={ `Open Faults (${ openFaults.length })` } />
				<CardsContainer>
					{openFaults.map( fault => (
						<FaultCard key={ fault.id } fault={ fault } />
					))}
				</CardsContainer>
			</>)}
			{!!closedFaults.length && (<>
				<ScreenTitle title={ `Closed Faults (${ closedFaults.length })` } />
				<CardsContainer>
					{closedFaults.map( fault => (
						<FaultCard key={ fault.id } fault={ fault } />
					))}
				</CardsContainer>
			</>)}
		</ScrollViewContainer>
	</>);
}

const styles = StyleSheet.create({})