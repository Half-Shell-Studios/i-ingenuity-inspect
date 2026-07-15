import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import GridColumn from "@/src/components/GridColumn";
import GridRow from "@/src/components/GridRow";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import TouchableOpacityButton from "@/src/components/TouchableOpacityButton";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import { getInspectionById, getInspectionTemplateByRevisionId } from "@/src/db/queries/inspections";
import { getUser } from "@/src/db/queries/users";
import { AssetTag, Inspection, InspectionAssessment, InspectionTemplateQuestion, InspectionTemplateSection, User } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function EditInspection() {
	const { inspection }: { inspection: string } = useLocalSearchParams();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ currentInspection, setCurrentInspection ] = useState<Inspection>();
	const [ inspectedBy, setInspectedBy ] = useState<User>();
	const [ inspectionTemplate, setInspectionTemplate ] = useState<[]>();
	const [ inspectedTag, setInspectedTag ] = useState<AssetTag>();
	const [ assessment, setAssessment ] = useState<InspectionAssessment>();

	useEffect(() => {
		if( dbIsReady ) {
			(async () => (
				setCurrentInspection( await getInspectionById( db, inspection ) )
			))();
		}
	}, [ dbIsReady, inspection ])
	
	useEffect(() => {
		if( dbIsReady ) {
			(async () => (
				setInspectedBy( await getUser( db, currentInspection?.inspectedBy ) )
			))();
		}
	}, [ dbIsReady, currentInspection ])
	
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

	const answerHandler = ( sectionIndex: number, questionIndex: number, value: string ) => {
		setAssessment( ( prevAssessment ) => {
			const newAssessment: InspectionAssessment = prevAssessment
				? prevAssessment.map( (s) => ({ ...s, answers: s.answers.map(a => ({ ...a })) }) )
				: [];

			// Ensure the section exists
			while ( newAssessment.length <= sectionIndex ) {
				newAssessment.push({ answers: [], skipped: false, skipped_comment: null });
			}

			const section = newAssessment[ sectionIndex ];

			// Ensure the answers array has the question index
			while ( section.answers.length <= questionIndex ) {
				section.answers.push({ pass: false, notes: "", value: "", faults: [] });
			}

			// Build an InspectionAnswer object matching the type
			section.answers[ questionIndex ] = {
				pass: value === 'Pass',
				notes: "",
				value,
				faults: []
			};

			return newAssessment;
		} );
	}

	useEffect(() => {
		if ( !assessment ) {
			console.log( "Inspection Assessment: <empty>" );
			return;
		}

		try {
			console.log( "Inspection Assessment (raw):", assessment );
			console.log( "Inspection Assessment (JSON):\n", JSON.stringify( assessment, null, 2 ) );

			assessment.forEach( ( section, sIndex ) => {
				console.log( `Section ${sIndex}:`, section );
				if ( section.answers && section.answers.length ) {
					section.answers.forEach( ( ans, qIndex ) => {
						console.log( `Section ${sIndex} • Answer ${qIndex}:`, JSON.stringify( ans, null, 2 ) );
					} );
				} else {
					console.log( `Section ${sIndex} has no answers` );
				}
			} );
		} catch ( e ) {
			console.log( "Error logging inspection assessment:", e );
		}
	}, [ assessment ] );

	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<ScrollViewContainer>
			<Text style={ styles.lead }>Edit Inspection</Text>
			<ScreenTitle title={ currentInspection?.name } />
			<View style={{ marginBottom: 20 }}>
				<Text style={ styles.lead }>Inspected By</Text>
				<Text>{ inspectedBy?.name }</Text>
			</View>
			<CardsContainer>
				{ inspectionTemplate?.map(( templateSection: InspectionTemplateSection, sectionIndex: number ) => (
					<Card key={ templateSection?.name }>
						<View style={{ marginBottom: 10 }}>
							<CardTitle title={ templateSection?.name } />
						</View>

						{ templateSection.questions.map(( question: InspectionTemplateQuestion, questionIndex: number ) => (
							<View key={ question.id } style={{ marginBottom: 20 }}>
								<GridRow style={{ marginInline: -10, marginBottom: 10, flexWrap: 'nowrap' }}>
									<GridColumn style={{ flex: 0, minWidth: 0, marginInline: 10 }}>
										<Text style={{ fontWeight: 600 }}>{ question.id.trim() }</Text>
									</GridColumn>
									<GridColumn style={{ flex: 1, minWidth: 0, marginInline: 10 }}>
										<Text style={{ flexWrap: 'wrap' }}>{ question.content.trim() } { question.content.trim() } { question.content.trim() }</Text>
									</GridColumn>
								</GridRow>
								{ question.type === 'preset-buttons' && (
									<GridRow style={{ marginInline: -10 }}>
										<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
											<TouchableOpacityButton label="Fail" pressHandler={ () => answerHandler( sectionIndex, questionIndex, 'Fail' ) } colour="error" />
										</GridColumn>
										<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
											<TouchableOpacityButton label="Not Accessible" pressHandler={ () => answerHandler( sectionIndex, questionIndex, 'Not Accessible' ) } />
										</GridColumn>
										<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
											<TouchableOpacityButton label="Not Applicable" pressHandler={ () => answerHandler( sectionIndex, questionIndex, 'Not Applicable' ) } />
										</GridColumn>
										<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
											<TouchableOpacityButton label="Not Examined" pressHandler={ () => answerHandler( sectionIndex, questionIndex, 'Not Examined' ) } />
										</GridColumn>
										<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
											<TouchableOpacityButton label="Pass" pressHandler={ () => answerHandler( sectionIndex, questionIndex, 'Pass' ) } colour="success" />
										</GridColumn>
									</GridRow>
								)}
							</View>
						))}
					</Card>
				))}
			</CardsContainer>
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