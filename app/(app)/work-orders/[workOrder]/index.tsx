import CustomersIcon from '@/assets/icons/customers.svg';
import LocationsIcon from '@/assets/icons/locations.svg';
import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import GridRow from "@/src/components/GridRow";
import Icon from '@/src/components/Icon';
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { ACCENT_COLOUR } from '@/src/constants/colours';
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import * as locationsQuery from "@/src/db/queries/locations";
import type { Location } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function WorkOrder() {
	const { workOrder } = useLocalSearchParams<{ workOrder: string }>();
	const { db, isReady, error } = useWorkOrderDb();
	const [ parsedLocations, setParsedLocations ] = useState<Array<Location>>([]);
	const [ locations, setLocations ] = useState<Location[]>();
	const [ customers, setCustomers ] = useState<Location[]>();
	const [ sites, setSites ] = useState<Location[]>();
	const [ plants, setPlants ] = useState<Location[]>();
	const [ areas, setAreas ] = useState<Location[]>();

	useEffect(() => {
		if( isReady ) {
			(async() => {
				setLocations( await locationsQuery.getAllLocations( db ) );
				setCustomers( await locationsQuery.getAllCustomers( db ) );
				setSites( await locationsQuery.getAllSites( db ) );
				setPlants( await locationsQuery.getAllPlants( db ) );
				setAreas( await locationsQuery.getAllAreas( db ) );
			})();
		}
	}, [ isReady, db ]);

	useEffect(() => {
		if( ( locations?.length ?? 0 ) > 0 ) {
			const _parsedLocations = locations?.map( location => ({
				"id": location.id,
				"customer": location.customerName,
				"site": location.siteName,
				"plant": location.plantName,
				"area": location.areaName,
			}))

			if( _parsedLocations === undefined ) return;

			const _groupedLocations: Location[] = [];

			for( const item of _parsedLocations ) {
				const { id, customer, site, plant, area } = item;

				if( customer === undefined ) continue;

				if( !_groupedLocations[customer] ) {
					_groupedLocations[customer] = { id, customer, sites: {} };
				}
				if( !_groupedLocations[customer].sites[site] ) {
					_groupedLocations[customer].sites[site] = { site, plants: {} };
				}
				if( !_groupedLocations[customer].sites[site].plants[plant] ) {
					_groupedLocations[customer].sites[site].plants[plant] = { plant, areas: [] };
				}

				_groupedLocations[customer].sites[site].plants[plant].areas.push(area);
			}

			// Convert the intermediate lookup objects into arrays
			const _result = Object.values( _groupedLocations ).map( ( customer: Location ) => ({
				id: customer.id,
				customer: customer.customer,
				sites: Object.values( customer.sites ).map( site => ({
					site: site.site,
					plants: Object.values( site.plants ).map( plant => ({
						plant: plant.plant,
						areas: plant.areas,
					})),
				})),
			}));

			setParsedLocations( _result );
		}
	}, [ locations ])

	if( error ) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: "red" }}>{ error }</Text>
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

	return (<>
		<ScrollViewContainer>
			<ScreenTitle title="Work Order" />

			<View style={{ marginBottom: 20 }}>
				<View style={{ flexDirection: "row", columnGap: 5, alignItems: "center" }}>
					<View style={{ padding: 5, borderWidth: 1, borderColor: ACCENT_COLOUR, borderRadius: "100%" }}>
						<Icon icon={ LocationsIcon } color={ ACCENT_COLOUR } />
					</View>
					<Text style={ styles.lead }>Locations</Text>
				</View>
				<Text style={ styles.lead }>Locations</Text>
				<CardsContainer>
					{parsedLocations?.length > 0 && parsedLocations?.map( customer => (
						<Card key={ customer.id }>
							<View style={{ marginBottom: 10 }}>
								<Text style={ styles.lead }>Customer</Text>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<View style={{ flexShrink: 1, flexGrow: 0, flexBasis: "auto", marginEnd: 10 }}>
										<View style={{ padding: 5, borderWidth: 1, borderColor: ACCENT_COLOUR, borderRadius: "100%" }}>
											<Icon icon={ CustomersIcon } color={ ACCENT_COLOUR } />
										</View>
									</View>
									<CardTitle title={ customer.customer } />
								</View>
							</View>
							<Text style={ styles.lead }>Sites</Text>
							<GridRow>
								{customer.sites?.length > 0 && customer.sites?.map(( site: string, index: number ) => (
									<View key={ `sites-${ index }` } style={{ flex: 1, marginBottom: 30 }}>
										<CardTitle title={ site.site } />
										
										{ site?.plants?.length > 0 && site.plants?.map(( plant: string, index: number ) => (
											<View key={ `plants-${ index }` } style={{ flex: 1, marginBottom: 30 }}>
												<Text style={ styles.lead }>Plant</Text>
												<CardTitle title={ plant.plant } />

												<Text style={ styles.lead }>Areas</Text>
												{ plant?.areas?.length > 0 && plant?.areas?.map(( area: string, index: number ) => (
													<Fragment key={ `plants-${ index }` }>
														<Text>{ area }</Text>
													</Fragment>
												))}
											</View>
										))}
									</View>
								))}
							</GridRow>
						</Card>
					))}
				</CardsContainer>
			</View>
			
			{/* <View style={{ marginBottom: 20 }}>
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
			</View> */}
		</ScrollViewContainer>
	</>);
}

const styles = StyleSheet.create({
	lead: {
		fontSize: 12,
		color: "rgba(0, 0, 0, 0.5)",
		marginBottom: 5
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10
	},
	button: {
		paddingBlock: 8,
		paddingInline: 16,
		backgroundColor: ACCENT_COLOUR,
		borderRadius: 4,
	},
	buttonText: {
		color: "#FFFFFF",
	}
});