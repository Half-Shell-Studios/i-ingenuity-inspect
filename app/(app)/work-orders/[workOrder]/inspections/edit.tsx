import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import GridColumn from "@/src/components/GridColumn";
import GridRow from "@/src/components/GridRow";
import InlineDropdown, { SelectOption } from "@/src/components/InlineSelect";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import TouchableOpacityButton from "@/src/components/TouchableOpacityButton";
import { BRAND_COLOUR_DARK_GREY, BRAND_COLOUR_WHITE, ERROR_COLOUR, PLACEHOLDER_TEXT_COLOUR, PRIMARY_COLOUR, SUCCESS_COLOUR, WARNING_COLOUR } from "@/src/constants/colours";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import { getAllFaultCodes } from "@/src/db/queries/faultCodes";
import { getInspectionById, getInspectionTemplateByRevisionId, updateInspection } from "@/src/db/queries/inspections";
import { getUser } from "@/src/db/queries/users";
import { AssetTag, Inspection, InspectionAnswer, InspectionAssessment, InspectionTemplateQuestion, InspectionTemplateSection, User } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const assessmentButtonColourMap: Record<'primary' | 'error' | 'success' | 'warning', string> = {
	primary: PRIMARY_COLOUR,
	success: SUCCESS_COLOUR,
	error: ERROR_COLOUR,
	warning: WARNING_COLOUR,
};

function AssessmentButton({ label, onPress, colour = 'primary', selected = false }: { label: string; onPress: () => void; colour?: 'primary' | 'error' | 'success' | 'warning'; selected?: boolean }) {
	return (
		<Pressable style={({ pressed }) => [ styles.button, { borderColor: assessmentButtonColourMap[colour] }, selected ? { backgroundColor: assessmentButtonColourMap[colour], borderColor: assessmentButtonColourMap[colour] } : styles.unselectedButton, pressed && styles.pressed ]} onPress={ onPress }>
			<Text style={[styles.buttonText, selected ? styles.selectedText : styles.unselectedText]}>{ label }</Text>
		</Pressable>
	)
}

function EditInspection() {
	const { inspection }: { inspection: Inspection[ 'id' ] } = useLocalSearchParams();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ currentInspection, setCurrentInspection ] = useState<Inspection>();
	const [ inspectedBy, setInspectedBy ] = useState<User>();
	const [ inspectionTemplate, setInspectionTemplate ] = useState<[]>();
	const [ inspectedTag, setInspectedTag ] = useState<AssetTag>();
	const [ assessment, setAssessment ] = useState<InspectionAssessment>();
	const [ faultCodes, setFaultCodes ] = useState<SelectOption[]>();

	useEffect(() => {
		if( !dbIsReady ) return;

		(async () => {
			try {
				const allFaultCodes = await getAllFaultCodes( db );
				setFaultCodes( allFaultCodes.map( faultCode => ({
					label: faultCode.name,
					value: faultCode.id
				})));
			} catch ( error ) {
				console.error( "Failed to load fault codes", error );
			}
		})();
	}, [ dbIsReady, db ]);

	useEffect(() => {
		if( !dbIsReady || !inspection ) return;

		(async () => {
			try {
				setCurrentInspection( await getInspectionById( db, Array.isArray( inspection ) ? inspection[0] : inspection ) );
			} catch ( error ) {
				console.error( "Failed to load inspection", error );
			}
		})();
	}, [ dbIsReady, inspection, db ]);
	
	useEffect(() => {
		if( !dbIsReady || !currentInspection?.inspectedBy ) return;

		(async () => {
			try {
				setInspectedBy( await getUser( db, currentInspection.inspectedBy ) );
			} catch ( error ) {
				console.error( "Failed to load inspector", error );
			}
		})();
	}, [ dbIsReady, currentInspection, db ]);
	
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

	const setAnswer = ( sectionIndex: number, questionIndex: number, answerPatch: Partial<InspectionAnswer> ) => {
		setAssessment( prevAssessment => {
			const newAssessment: InspectionAssessment = prevAssessment ? prevAssessment.map(s => ({ ...s, answers: s.answers.map(a => ({ ...a })) }) ) : [];

			while( newAssessment.length <= sectionIndex ) {
				newAssessment.push({
					answers: [],
					skipped: false,
					skipped_comment: null
				});
			}

			const section = newAssessment[ sectionIndex ];

			while( section.answers.length <= questionIndex ) {
				section.answers.push({
					pass: false,
					notes: null,
					value: "", 
					faults: [] 
				});
			}

			const existingAnswer = section.answers[ questionIndex ];
			section.answers[ questionIndex ] = {
				...existingAnswer,
				...answerPatch,
			};

			return newAssessment;
		});
	}

	const answerHandler = ( sectionIndex: number, questionIndex: number, value: string ) => {
		setAnswer( sectionIndex, questionIndex, {
			pass: value === 'Pass',
			value,
			faults: [],
		} );
	}

	const commentChangeHandler = ( sectionIndex: number, questionIndex: number, notes: string ) => {
		setAnswer( sectionIndex, questionIndex, { notes } );
	}

	const skipCommentChangeHandler = ( sectionIndex: number, notes: string ) => {
		setAssessment( prevAssessment => {
			const newAssessment: InspectionAssessment = prevAssessment ? prevAssessment.map(s => ({ ...s, answers: s.answers.map(a => ({ ...a })) }) ) : [];

			while( newAssessment.length <= sectionIndex ) {
				newAssessment.push({
					answers: [],
					skipped: false,
					skipped_comment: null
				});
			}

			newAssessment[ sectionIndex ].skipped_comment = notes;

			return newAssessment;
		});
	}

	const toggleSkipSection = ( sectionIndex: number ) => {
		setAssessment( prevAssessment => {
			const newAssessment: InspectionAssessment = prevAssessment ? prevAssessment.map(s => ({ ...s, answers: s.answers.map(a => ({ ...a })) }) ) : [];

			while( newAssessment.length <= sectionIndex ) {
				newAssessment.push({
					answers: [],
					skipped: false,
					skipped_comment: null
				});
			}

			const section = newAssessment[ sectionIndex ];
			section.skipped = !section.skipped;

			if( section.skipped && section.skipped_comment == null ) {
				section.skipped_comment = null;
			}

			return newAssessment;
		});
	}

	const handleSubmit = async () => {
		if( !currentInspection ) return;

		const newInspection: Partial<Omit<Inspection, 'id'>> = {
			...currentInspection,
			assessment: assessment
		}

		if( dbIsReady ) {
			try {
				const returnedInspection: Inspection | undefined = await updateInspection( db, inspection, newInspection );

				// console.log( "returned inspection ID:", returnedInspection );

				setCurrentInspection( returnedInspection )

				// if( !!returnedInspection ) {
				// 	(async () => (
				// 		setCurrentInspection( await getInspectionById( db, inspection ) )
				// 	))();
				// }
			} catch ( error ) {
				console.error( "Failed to update inspection", error );
			} finally {
				console.log( "currentInspection:", currentInspection );
			}
		}

	}

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
				{ inspectionTemplate?.map(( templateSection: InspectionTemplateSection, sectionIndex: number ) => {
					return (
						<Card key={ `section-${ sectionIndex }` }>
							<View style={{ marginBottom: 10 }}>
								<GridRow style={{ alignItems: 'center', justifyContent: 'space-between' }}>
									<GridColumn>
										<CardTitle title={ templateSection?.name } />
									</GridColumn>
									<GridColumn>
										<Pressable onPress={() => toggleSkipSection( sectionIndex )}>
											<Text style={{ padding: 5 }}>{ !!assessment && ( assessment[ sectionIndex ]?.skipped ?? false ) ? 'Open' : 'Skip' }</Text>
										</Pressable>
									</GridColumn>
								</GridRow>
							</View>

							{ !!assessment && assessment[ sectionIndex ]?.skipped ? (
								<GridRow style={{ marginInline: -10 }}>
									<GridColumn style={{ flexGrow: 1, flexShrink: 1, width: '75%', paddingInline: 10 }}>
										<Text>Skipped Comment</Text>
										<TextInput style={ styles.input } placeholder="Skipped comment..." placeholderTextColor={ PLACEHOLDER_TEXT_COLOUR } value={ assessment?.[sectionIndex]?.skipped_comment ?? "" } onChangeText={ (notes) => skipCommentChangeHandler( sectionIndex, notes ) } />
									</GridColumn>
								</GridRow>
							) : (

								templateSection.questions.map(( question: InspectionTemplateQuestion, questionIndex: number ) => (
									<View key={ `question-${ sectionIndex }-${ questionIndex }` } style={{ marginBottom: 20 }}>
										<GridRow style={{ marginInline: -10, marginBottom: 10, flexWrap: 'nowrap' }}>
											<GridColumn style={{ flexGrow: 0, minWidth: 0, marginInline: 10 }}>
												<Text style={{ fontWeight: 600 }}>{ question.id.trim() }</Text>
											</GridColumn>
											<GridColumn style={{ flexGrow: 1, minWidth: 0, marginInline: 10 }}>
												<Text>{ question.content.trim() }</Text>
											</GridColumn>
										</GridRow>
										{ question.type === 'preset-buttons' && (
											<ScrollView horizontal>
												<GridRow style={{ minWidth: '100%', marginInline: -10, marginBottom: 10 }}>
													<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
														<AssessmentButton label="Fail" onPress={ () => answerHandler( sectionIndex, questionIndex, 'Fail' ) } colour="error" selected={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.value === 'Fail' } />
													</GridColumn>
													<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
														<AssessmentButton label="Not Accessible" onPress={ () => answerHandler( sectionIndex, questionIndex, 'Not Accessible' ) } colour="warning" selected={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.value === 'Not Accessible' } />
													</GridColumn>
													<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
														<AssessmentButton label="Not Applicable" onPress={ () => answerHandler( sectionIndex, questionIndex, 'Not Applicable' ) } colour="warning" selected={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.value === 'Not Applicable' } />
													</GridColumn>
													<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
														<AssessmentButton label="Not Examined" onPress={ () => answerHandler( sectionIndex, questionIndex, 'Not Examined' ) } colour="warning" selected={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.value === 'Not Examined' } />
													</GridColumn>
													<GridColumn style={{ flexGrow: 1, marginInline: 10 }}>
														<AssessmentButton label="Pass" onPress={ () => answerHandler( sectionIndex, questionIndex, 'Pass' ) } colour="success" selected={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.value === 'Pass' } />
													</GridColumn>
												</GridRow>
											</ScrollView>
										)}
										<View>
											<View style={{ marginBottom: 10 }}>
												<Text style={{ marginBottom: 5 }}>Notes</Text>
												<TextInput style={ styles.input } placeholder="Inspection comment..." placeholderTextColor={ PLACEHOLDER_TEXT_COLOUR } value={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.notes ?? "" } onChangeText={ (notes) => commentChangeHandler( sectionIndex, questionIndex, notes ) } />
											</View>
											
											{ !( assessment?.[sectionIndex]?.answers?.[questionIndex]?.pass ?? true ) && (<>
												<GridRow style={{ marginInline: -10 }}>
													<GridColumn style={{ flexGrow: 0, flexShrink: 1, width: '25%', paddingInline: 10 }}>
														<Text>Fault Code</Text>
														{/* <TextInput style={ styles.input } placeholder="Inspection comment..." placeholderTextColor={ PLACEHOLDER_TEXT_COLOUR } value={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.notes ?? "" } onChangeText={ (notes) => commentChangeHandler( sectionIndex, questionIndex, notes ) } /> */}
														{!!faultCodes && !!faultCodes?.length && (
															<InlineDropdown options={ faultCodes } onChange={ value => console.log( value ) } />
														)}
													</GridColumn>
													<GridColumn style={{ flexGrow: 1, flexShrink: 1, width: '75%', paddingInline: 10 }}>
														<Text>Fault Comment</Text>
														<TextInput style={ styles.input } placeholder="Inspection comment..." placeholderTextColor={ PLACEHOLDER_TEXT_COLOUR } value={ assessment?.[sectionIndex]?.answers?.[questionIndex]?.notes ?? "" } onChangeText={ (notes) => commentChangeHandler( sectionIndex, questionIndex, notes ) } />
													</GridColumn>
												</GridRow>
											</>)}
										</View>
									</View>
								))
							)}
						</Card>
					)
				})}
			</CardsContainer>
			<TouchableOpacityButton label="Save" pressHandler={ handleSubmit } />
		</ScrollViewContainer>
	)
}

const styles = StyleSheet.create({
	lead: {
		fontSize: 12,
		color: "rgba(0, 0, 0, 0.5)"
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#7863FB",
	},
	unselectedButton: {
		backgroundColor: "transparent",
	},
	pressed: {
		opacity: 0.8,
	},
	buttonText: {
		fontWeight: "bold",
		textAlign: "center"
	},
	selectedText: {
		color: "#FFFFFF",
	},
	unselectedText: {
		color: "#000000",
	},
	input: {
		padding: 10,
		borderWidth: 1,
		borderColor: BRAND_COLOUR_DARK_GREY,
		borderRadius: 10,
		backgroundColor: BRAND_COLOUR_WHITE
	}
})

export default EditInspection