import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import GridColumn from "@/src/components/GridColumn";
import GridRow from "@/src/components/GridRow";
import ScreenTitle from "@/src/components/ScreenTitle";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAllAssetTags } from "@/src/db/queries/assetTags";
import AssetTag from "@/src/types/AssetTag";
import { Column, Host, Picker } from '@expo/ui';
import { useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FLAVOURS = [
	{ label: 'Vanilla', value: 'vanilla' },
	{ label: 'Chocolate', value: 'chocolate' },
	{ label: 'Strawberry', value: 'strawberry' },
];

function PickerWheelExample() {
	const [ value, setValue ] = useState( 'chocolate' );

	return (
		<Host style={{ flex: 1 }}>
			<Column spacing={8} style={{ padding: 16 }}>
				<Picker selectedValue={ value } onValueChange={ setValue }>
					{FLAVOURS.map(f => (
						<Picker.Item key={f.value} label={f.label} value={f.value} />
					))}
				</Picker>
			</Column>
		</Host>
	);
}


export default function AssetTagsIndex() {
	const router = useRouter();
	const [ tags, setTags ] = useState<AssetTag[]>([]);
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();

	useEffect(() => {
		if( dbIsReady ) {	
			(async() => {
				setTags( await getAllAssetTags( db ) );
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
						<GridRow>
							<GridColumn styles={ styles.filtersColumn }>
								<View style={{ backgroundColor: "#F00", padding: 10 }}>
									<Text>Customer Filter</Text>
								</View>
							</GridColumn>
							<GridColumn styles={ styles.filtersColumn }>
								<Text>Site Filter</Text>
								<PickerWheelExample />
							</GridColumn>
							<GridColumn styles={ styles.filtersColumn }>
								<Text>Plant Filter</Text>
							</GridColumn>
							<GridColumn styles={ styles.filtersColumn }>
								<Text>Area Filter</Text>
							</GridColumn>
						</GridRow>
					</Card>
				</CardsContainer>
			</View>
			<CardsContainer>
				{ tags.map(( tag ) => (
					<TouchableOpacity key={ tag.id } onPress={ () => router.push( `./asset-tags/${ tag.id }` ) }>
						<Card>
							<Text>Tag</Text>
							<Text style={ styles.cardTitle }>
								{ tag.name }
							</Text>
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
		marginBottom: 20,
	},
	cardDesc: {
		fontSize: 14,
		color: "#6b7280",
	},
	filtersContainer: {
		marginBottom: 30
	},
	filtersColumn: {
		width: screenWidth > 768 ? '25%' : '100%',
	}
});