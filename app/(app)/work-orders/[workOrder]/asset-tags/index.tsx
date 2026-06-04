import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import ScreenTitle from "@/src/components/ScreenTitle";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAllAssetTags } from "@/src/db/queries/assetTags";
import AssetTag from "@/src/types/AssetTag";
import { useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
});