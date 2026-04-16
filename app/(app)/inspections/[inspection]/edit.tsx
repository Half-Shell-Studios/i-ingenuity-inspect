import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import GridRow from "@/src/components/GridRow";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import TouchableOpacityButton from "@/src/components/TouchableOpacityButton";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import { getInspectionById, getInspectionTemplateByRevisionId } from "@/src/db/queries/inspections";
import { AssetTag, Inspection } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function EditInspection() {
	const { inspection }: { inspection: string } = useLocalSearchParams();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ currentInspection, setCurrentInspection ] = useState<Inspection>();
	const [ inspectionTemplate, setInspectionTemplate ] = useState<[]>();
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
			(async () => {
				setInspectedTag( await getAssetTagById( db, currentInspection?.assetTagId ) );

				const _inspectionTemplate = await getInspectionTemplateByRevisionId( db, currentInspection?.inspectionTemplateRevisionId );
				const _inspectionTemplateString = _inspectionTemplate?.revisionActive?.template;
				if( _inspectionTemplateString ) {
					const _inspectionTemplateJson = JSON.parse( _inspectionTemplateString );
					setInspectionTemplate( _inspectionTemplateJson );
				}
			})();
		}
	}, [ dbIsReady, currentInspection ]);

	const answerHandler = ( value: string ) => {
		alert( value );
	}

	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<ScrollViewContainer>
			<Text style={ styles.lead }>Edit Inspection</Text>
			<ScreenTitle title={ currentInspection?.name } />
			<Text style={ styles.lead }>Inspected By</Text>
			<Text>{ currentInspection?.inspectedBy }</Text>
			<CardsContainer>
				{ inspectionTemplate?.map( templateSection => (
					<Card key={ templateSection?.name }>
						<CardTitle title={ templateSection?.name } />

						{ templateSection.questions.map( question => (
							<View key={ question.id }>
								<Text style={{ marginBottom: 10 }}>{ question.content }</Text>
								{ question.type === 'preset-buttons' && (
									<GridRow>
										<View style={{ flex: 0, width: 'auto', maxWidth: '50%' }}>
											<TouchableOpacityButton label="Not Accessible" pressHandler={ () => answerHandler( 'Not Accessible' ) } />
										</View>
										<View style={{ flex: 0, width: 'auto', maxWidth: '50%' }}>
											<TouchableOpacityButton label="Not Applicable" pressHandler={ () => answerHandler( 'Not Applicable' ) } />
										</View>
										<View style={{ flex: 0, width: 'auto', maxWidth: '50%' }}>
											<TouchableOpacityButton label="Not Examined" pressHandler={ () => answerHandler( 'Not Examined' ) } />
										</View>
									</GridRow>
								)}
							</View>
						))}
					</Card>
				))}
			</CardsContainer>
			{/* <Text>Inspector:</Text>
			<Text>{ currentInspection?.inspectedBy }</Text>
			<Text>Asset Tag:</Text>
			<Text>{ currentInspection?.assetTagId }</Text>
			<Text>{ inspectedTag?.name }</Text> */}
		</ScrollViewContainer>
	)
}

const styles = StyleSheet.create({
	lead: {
		fontSize: 12,
		color: "rgba(0, 0, 0, 0.5)"
	},
})

export default EditInspection