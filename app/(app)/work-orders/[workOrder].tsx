import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import * as locationsQuery from "@/src/db/queries/locations";
import type { Location } from "@/src/types";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function WorkOrder() {
	const { workOrder } = useLocalSearchParams<{ workOrder: string }>();
	const { db, isReady, error } = useWorkOrderDb();
	const [ locations, setLocations ] = useState<Location[]>();
	const [ customers, setCustomers ] = useState<Location[]>();
	const [ sites, setSites ] = useState<Location[]>();
	const [ plants, setPlants ] = useState<Location[]>();
	const [ areas, setAreas ] = useState<Location[]>();

	useEffect(() => {
		if( isReady ) {
			(async() => {
				setLocations( await locationsQuery.getAllLocations( db ) );
				setCustomers( await locationsQuery.getAllCutsomers( db ) );
				setSites( await locationsQuery.getAllSites( db ) );
				setPlants( await locationsQuery.getAllPlants( db ) );
				setAreas( await locationsQuery.getAllAreas( db ) );
			})();
		}
	}, [ isReady, db ]);

	if( error ) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: "red" }}>{error}</Text>
			</View>
		);
	}

	if( !isReady || !db ) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#4f46e5" />
			</View>
		);
	}

	return (
		<ScrollViewContainer>
			<Text>Work Order: { workOrder }</Text>
			<Link href={`/asset-tags`}>Asset Tags</Link>
			<View style={{ marginBottom: 20 }}>
				<Text style={ styles.lead }>Locations</Text>
				{locations?.map( location => (
					<View key={ location.id }>
						<Text style={ styles.title }>
							{ JSON.stringify( location ) }
						</Text>
					</View>
				))}
			</View>
			<View style={{ marginBottom: 20 }}>
				<Text style={ styles.lead }>Customers</Text>
				{customers?.map( customer => (
					<View key={ customer.id }>
						<Text style={ styles.title }>
							{ customer.customerName }
						</Text>
					</View>
				))}
			</View>
			<View style={{ marginBottom: 20 }}>
				<Text style={ styles.lead }>Sites</Text>
				{sites?.map( site => (
					<View key={ site.id }>
						<Text style={ styles.title }>
							{ site.siteName }
						</Text>
					</View>
				))}
			</View>
			<View style={{ marginBottom: 20 }}>
				<Text style={ styles.lead }>Plants</Text>
				{plants?.map( plant => (
					<View key={ plant.id }>
						<Text style={ styles.title }>
							{ plant.plantName }
						</Text>
					</View>
				))}
			</View>
			<View style={{ marginBottom: 20 }}>
				<Text style={ styles.lead }>Areas</Text>
				{areas?.map( area => (
					<View key={ area.id }>
						<Text style={ styles.title }>
							{ area.areaName }
						</Text>
					</View>
				))}
			</View>
		</ScrollViewContainer>
	);
}

const styles = StyleSheet.create({
	lead: {
		fontSize: 12,
		color: "rgba(0, 0, 0, 0.5)"
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10
	},
	button: {
		paddingBlock: 8,
		paddingInline: 16,
		backgroundColor: "#7863FB",
		borderRadius: 4,
	},
	buttonText: {
		color: "#FFFFFF",
	}
});