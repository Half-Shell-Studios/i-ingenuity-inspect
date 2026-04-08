import Choice from "@/src/components/Choice";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import TouchableOpacityButton from "@/src/components/TouchableOpacityButton";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import { createNewInspection, getAllInspectionTypes } from "@/src/db/queries/inspections";
import { AssetTag, InspectionType } from "@/src/types/";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

function CreateInspection() {
	const { assetTag: assetTagId } = useLocalSearchParams<{ assetTag: string }>();
	const [ inspectionTypes, setInspectionTypes ] = useState<InspectionType[]>([]);
	const [ assetTag, setAssetTag ] = useState<AssetTag>();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ selectedType, setSelectedType ] = useState<string>('');

	const startInspection = () => {
		console.log( "Asset Tag:", assetTag?.id );
		console.log( "Inspection Type:", selectedType );
		if( !assetTag?.id ) return;

		const inspection = createNewInspection( db, assetTag?.id, selectedType );

		console.log( inspection );
		console.log( "New Inspection: ", inspection.id );
	}
	
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
			<ScreenTitle title={`Create an Inspection for ${ assetTag?.name }`} />
			<Text style={{ marginBottom: 10 }}>1. Choose your Inspection Type</Text>
			{inspectionTypes.map( inspectionType => (
				<View key={ inspectionType.id } onTouchEnd={() => setSelectedType( inspectionType.id ) }>
					<Choice label={ inspectionType.name } value={ inspectionType.id } selected={ selectedType === inspectionType.id } />
				</View>
			))}
			<TouchableOpacityButton label="Start Inspection" pressHandler={ startInspection } />
		</ScrollViewContainer>
	)
}

export default CreateInspection