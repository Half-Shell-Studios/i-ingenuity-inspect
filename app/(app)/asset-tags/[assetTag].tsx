import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import GridRow from "@/src/components/GridRow";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import AssetTag from "@/src/types/AssetTag";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function AssetTagShow() {
	const router = useRouter();
	const { assetTag: assetTagId }: { assetTag: string } = useLocalSearchParams();
	const [ assetTag, setAssetTag ] = useState<AssetTag>();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setAssetTag( await getAssetTagById( db, assetTagId ) );
			})();
		}
	}, [ db, assetTagId ]);

	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<ScrollViewContainer>
			<View style={{ marginBottom: 20 }}>
				<GridRow>
					<View style={{ flex: 1 }}>
						<Text style={ styles.lead }>Asset Tag</Text>
						<Text style={ styles.title }>{ assetTag?.name }</Text>
						{!!( assetTag?.description ) && (
							<Text>{ assetTag?.description }</Text>
						)}
					</View>
					<View style={{ flex: 0 }}>
						<TouchableOpacity style={ styles.button } onPress={() => router.push({ pathname: `/inspections/create`, params: { assetTag: assetTag?.id } })}>
							<Text style={ styles.buttonText }>Inspect</Text>
						</TouchableOpacity>
					</View>
				</GridRow>
			</View>
			<CardsContainer>
				<Card>
					<GridRow>
						{ assetTag?.height && (
							<View style={{ flex: 1 }}>
								<Text style={ styles.lead }>Tag Height</Text>
								<CardTitle title={ assetTag.height } />
							</View>
						)}
						{ assetTag?.vintage && (
							<View style={{ flex: 1 }}>
								<Text style={ styles.lead }>Tag Vintage</Text>
								<CardTitle title={ assetTag.vintage } />
							</View>
						)}
					</GridRow>
				</Card>

				<Card>
					<Text style={ styles.lead }>Asset Template</Text>
					<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.manufacturer } ${ assetTag?.assetTemplate?.revisionActive?.model }` } />
					{!!( assetTag?.assetTemplate?.revisionActive?.description ) && (
						<Text>{ assetTag?.assetTemplate?.revisionActive?.description }</Text>
					)}
				</Card>
			
				<Card>
					<View style={{ marginBottom: 20 }}>
						<Text style={ styles.lead }>Faults</Text>
					</View>

					<View style={{ marginBottom: 20 }}>
						<GridRow>
							<View style={{ flex: 1 }}>
								<Text style={ styles.lead }>Faults Open</Text>
								<CardTitle title={ assetTag?.faultsOpen?.length ?? 0 } />
							</View>
							<View style={{ flex: 1 }}>
								<Text style={ styles.lead }>Faults Closed</Text>
								<CardTitle title={ assetTag?.faultsClosed?.length ?? 0 } />
							</View>
						</GridRow>
					</View>

					<View style={{ marginBottom: 20 }}>
						<CardTitle title="Open Faults" />
						{assetTag?.faultsOpen?.map(( fault, index ) => (
							<View style={{ flexDirection: 'row', columnGap: 4 }} key={ fault.id }>
								<View style={{ flex: 0 }}>
									<Text>{ String( ( index + 1 ) ).padStart( 2, '0' ) }.</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Text>{ fault.section }</Text>
									<Text style={ styles.title }>{ fault.question }</Text>
									<Text>{ fault.raisedComment }</Text>
								</View>
							</View>
						))}
					</View>
					
					<View style={{ marginBottom: 20 }}>
						<CardTitle title="Closed Faults" />
						{assetTag?.faultsClosed?.map(( fault, index ) => (
							<View style={{ flexDirection: 'row', columnGap: 4 }} key={ fault.id }>
								<View style={{ flex: 0 }}>
									<Text>{ String( ( index + 1 ) ).padStart( 2, '0' ) }.</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Text>{ fault.section }</Text>
									<Text style={ styles.title }>{ fault.question }</Text>
									<Text>{ fault.closedComment }</Text>
								</View>
							</View>
						))}
					</View>
				</Card>
			</CardsContainer>
		</ScrollViewContainer>
	)
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

export default AssetTagShow