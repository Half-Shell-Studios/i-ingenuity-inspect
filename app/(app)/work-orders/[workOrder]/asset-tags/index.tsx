import AreasIcon from '@/assets/icons/areas.svg';
import AssetTagIcon from '@/assets/icons/asset-tags.svg';
import CustomersIcon from '@/assets/icons/customers.svg';
import PlantsIcon from '@/assets/icons/plants.svg';
import SitesIcon from '@/assets/icons/sites.svg';
import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import GridColumn from "@/src/components/GridColumn";
import GridRow from "@/src/components/GridRow";
import Icon from '@/src/components/Icon';
import LocationFilter from '@/src/components/LocationFilter';
import ScreenTitle from "@/src/components/ScreenTitle";
import TouchableOpacityButton from "@/src/components/TouchableOpacityButton";
import { ACCENT_COLOUR } from "@/src/constants/colours";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAllAssetTags } from "@/src/db/queries/assetTags";
import * as locationsQuery from "@/src/db/queries/locations";
import type { Area, Customer, Plant, Site } from "@/src/types";
import AssetTag from "@/src/types/AssetTag";
import { useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width: screenWidth } = Dimensions.get( 'window' );

export default function AssetTagsIndex() {
	const router = useRouter();
	const [ tags, setTags ] = useState<AssetTag[]>([]);
	const [ customers, setCustomers ] = useState<Customer[]>()
	const [ sites, setSites ] = useState<Site[]>()
	const [ plants, setPlants ] = useState<Plant[]>()
	const [ areas, setAreas ] = useState<Area[]>()
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();

	useEffect(() => {
		if( dbIsReady ) {	
			(async() => {
				setTags( await getAllAssetTags( db ) );
				setCustomers( await locationsQuery.getAllCustomers( db ) );
				setSites( await locationsQuery.getAllSites( db ) );
				setPlants( await locationsQuery.getAllPlants( db ) );
				setAreas( await locationsQuery.getAllAreas( db ) );
			})();
		}
	}, [ db, dbIsReady ]);
	
	if( dbError ) return <Text>Error: { dbError }</Text>;

	if( !dbIsReady || !db || ( dbIsReady && ( tags?.length < 1 ) ) ) return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<ActivityIndicator />
		</View>
	);

	return (
		<ScrollView style={{ padding: 20 }}>
			<ScreenTitle title={ `Tags (${ tags.length })` } />
			<View style={ styles.filtersContainer }>
				<CardsContainer>
					<Card>
						<View style={{ marginBottom: 10 }}>
							<CardTitle title="Filters" />
						</View>
						<View style={{ marginInline: -5 }}>
							<GridRow>
								<GridColumn style={ styles.filtersColumn }>
									<GridRow>
										<GridColumn style={ styles.iconContainer }>
											<Icon icon={ CustomersIcon } width={ 26 } height={ 26 } color={ ACCENT_COLOUR } />
										</GridColumn>
										{ !!customers?.length && (
											<GridColumn style={{ flexGrow: 1 }}>
												<LocationFilter placeholder="Filter by Customer" options={ customers.map( customer => ({ label: customer.customerName, value: customer?.id ?? '' })) } />
											</GridColumn>
										)}
									</GridRow>
								</GridColumn>
								<GridColumn style={ styles.filtersColumn }>
									<GridRow>
										<GridColumn style={ styles.iconContainer }>
											<Icon icon={ SitesIcon } width={ 26 } height={ 26 } color={ ACCENT_COLOUR } />
										</GridColumn>
									{ !!sites?.length && (
										<GridColumn style={{ flexGrow: 1 }}>
											<LocationFilter placeholder="Filter by Site" options={ sites.map( site => ({ label: site.siteName, value: site?.id ?? '' })) } />
										</GridColumn>
									)}
									</GridRow>
								</GridColumn>
								<GridColumn style={ styles.filtersColumn }>
									<GridRow>
										<GridColumn style={ styles.iconContainer }>
											<Icon icon={ PlantsIcon } width={ 26 } height={ 26 } color={ ACCENT_COLOUR } />
										</GridColumn>
										{ !!plants?.length && (
											<GridColumn style={{ flexGrow: 1 }}>
												<LocationFilter placeholder="Filter by Plant" options={ plants.map( plant => ({ label: plant.plantName, value: plant?.id ?? '' })) } />
											</GridColumn>
										)}
									</GridRow>
								</GridColumn>
								<GridColumn style={ styles.filtersColumn }>
									<GridRow>
										<GridColumn style={ styles.iconContainer }>
											<Icon icon={ AreasIcon } width={ 26 } height={ 26 } color={ ACCENT_COLOUR } />
										</GridColumn>
										{ !!areas?.length && (
											<GridColumn style={{ flexGrow: 1 }}>
												<LocationFilter placeholder="Filter by Area" options={ areas.map( area => ({ label: area.areaName, value: area?.id ?? '' })) } />
											</GridColumn>
										)}
									</GridRow>
								</GridColumn>
								<GridColumn style={ styles.filtersColumn }>
									<TouchableOpacityButton label="Apply Filters" pressHandler={() => {}} />
								</GridColumn>
							</GridRow>
						</View>
					</Card>
				</CardsContainer>
			</View>
			<CardsContainer>
				{ tags.map(( tag ) => (
					<TouchableOpacity key={ tag.id } onPress={ () => router.push( `./asset-tags/${ tag.id }` ) }>
						<Card>
							<View style={{ marginBottom: 30 }}>
								<GridRow>
									<GridColumn>
										<View style={ styles.iconContainer }>
											<Icon icon={ AssetTagIcon } />
										</View>
									</GridColumn>
									<GridColumn>
										<Text style={ styles.cardTitle }>
											{ tag.name }
										</Text>
									</GridColumn>
								</GridRow>
							</View>
							{ tag?.description && (
								<Text style={ styles.cardDesc }>
									{ tag.description }
								</Text>
							)}
							<Text>Element</Text>
							<Text style={ styles.cardTitle }>
								{ tag.assetTemplate?.revisionActive?.manufacturer } { tag.assetTemplate?.revisionActive?.model }
							</Text>
							{ tag.assetTemplate?.revisionActive?.description && (
								<Text style={ styles.cardDesc }>
									{ tag.assetTemplate?.revisionActive?.description }
								</Text>
							)}
							{( tag.faultsOpen?.length ?? 0 ) > 0 && (<>
								<Text>Open Faults ({ tag.faultsOpen?.length })</Text>
								{ tag.faultsOpen?.map((fault, index) => (
									<Fragment key={ fault.id }>
										<Text style={ styles.cardTitle }>
											{ ( index + 1 ) }. { fault.section } - { fault.question }
										</Text>
										<Text>{ fault.raisedComment }</Text>
									</Fragment>
								))}
							</>)}
						</Card>
					</TouchableOpacity>
				))}
			</CardsContainer>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		// marginBottom: 20,
	},
	cardDesc: {
		fontSize: 14,
		color: "#6b7280",
	},
	filtersContainer: {
		marginBottom: 30
	},
	filtersColumn: {
		width: screenWidth > 768 ? '20%' : '100%',
		paddingInline: 5,
	},
	iconContainer: {
		padding: 6,
		borderWidth: 1,
		borderRadius: "100%",
		borderColor: ACCENT_COLOUR,
		marginRight: 10
	}
});