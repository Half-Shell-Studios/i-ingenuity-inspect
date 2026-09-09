import LinkButton from "@/src/components/LinkButton";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import { getInspectionById } from "@/src/db/queries/inspections";
import { AssetTag, Inspection } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";


function ShowInspection() {
	const { inspection }: { inspection: string } = useLocalSearchParams();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ currentInspection, setCurrentInspection ] = useState<Inspection>();
	const [ inspectedTag, setInspectedTag ] = useState<AssetTag>();

	useEffect(() => {
		if( dbIsReady ) {
			(async () => (
				setCurrentInspection( await getInspectionById( db, inspection ) )
			))();
		}
	}, [ dbIsReady, inspection ])
	
	useEffect(() => {
		if( dbIsReady && currentInspection ) {
			(async () => (
				setInspectedTag( await getAssetTagById( db, currentInspection?.assetTagId ) )
			))();
		}
	}, [ dbIsReady, currentInspection ])

	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<ScrollViewContainer>
			<Text>View Inspection:</Text>
			<Text>{ inspection }</Text>
			<ScreenTitle title={ currentInspection?.name } />
			<Text>Inspection Template:</Text>
			<Text>{ currentInspection?.inspectionTemplateId }</Text>
			<Text>Inspector:</Text>
			<Text>{ currentInspection?.inspectedBy }</Text>
			<Text>Asset Tag:</Text>
			<Text>{ currentInspection?.assetTagId }</Text>
			<Text>{ inspectedTag?.name }</Text>
			<LinkButton href={{ pathname: "./edit", params: { inspection: currentInspection?.id ?? inspection } }} label="Edit Inspection" />
		</ScrollViewContainer>
	)
}

export default ShowInspection