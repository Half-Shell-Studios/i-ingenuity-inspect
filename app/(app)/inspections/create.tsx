import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import { getAllInspectionTypes } from "@/src/db/queries/inspections";
import { AssetTag, InspectionType } from "@/src/types/";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

function CreateInspection() {
	const { assetTag: assetTagId } = useLocalSearchParams<{ assetTag: string }>();
	const [ inspectionTypes, setInspectionTypes ] = useState<InspectionType[]>([]);
	const [ assetTag, setAssetTag ] = useState<AssetTag>();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	
	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setInspectionTypes( await getAllInspectionTypes( db ) )
			})();
			(async() => {
				setAssetTag( await getAssetTagById( db, assetTagId ) )
			})();
		}
	}, [ db, dbIsReady, assetTagId ]);

	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<ScrollViewContainer>
			<Text>Create an Inspection for { assetTag?.name }</Text>
			<Text>Choose your Inspection Type</Text>
			{inspectionTypes.map( inspectionType => (
				<View key={ inspectionType.id }>
					<Text>{ inspectionType.name }</Text>
				</View>
			))}
		</ScrollViewContainer>
	)
}

export default CreateInspection