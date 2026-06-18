import Card from '@/src/components/Card';
import CardLabel from '@/src/components/CardLabel';
import CardsContainer from '@/src/components/CardsContainer';
import CardTitle from '@/src/components/CardTitle';
import GridColumn from '@/src/components/GridColumn';
import GridRow from '@/src/components/GridRow';
import ScreenTitle from '@/src/components/ScreenTitle';
import ScrollViewContainer from '@/src/components/ScrollViewContainer';
import TouchableOpacityButton from '@/src/components/TouchableOpacityButton';
import { ACCENT_COLOUR } from '@/src/constants/colours';
import { useAuth } from '@/src/context/AuthContext';
import { useWorkOrderDb } from '@/src/context/WorkOrderDbContext';
import { closeFault, getFaultById } from '@/src/db/queries/faults';
import { InspectionQuestion, type Fault, type InspectionTemplate } from '@/src/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

const { width: screenWidth } = Dimensions.get( 'window' );

export default function FaultShow() {
	const { user } = useAuth();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const router = useRouter();
	const { faultId } = useLocalSearchParams<{ faultId: string }>();
	const [ fault, setFault ] = useState<Fault>();
	const [ faultComment, setFaultComment ] = useState<string>('');
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ inspectionTemplate, setInspectionTemplate ] = useState<any>();
	const [ faultSectionName, setFaultSectionName ] = useState<string>();
	const [ faultQuestion, setFaultQuestion ] = useState<InspectionQuestion>();

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setFault( await getFaultById( db, faultId ) );
			})();
		}
	}, [ db, faultId ]);

	useEffect(() => {
		if( fault === undefined ) return;

		const _inspectionTemplate: InspectionTemplate | undefined = fault.inspection?.inspectionTemplate;

		setInspectionTemplate( _inspectionTemplate );

		const _assessmentCriteria = JSON.parse( _inspectionTemplate?.revisionActive?.template ?? '{}' );
		
		if( Object.keys( _assessmentCriteria ?? {} ).length > 0 ) {
			const _faultSection = _assessmentCriteria[`${ fault.section }`];
			setFaultSectionName( _faultSection?.name ?? '' );

			if( Object.keys( _assessmentCriteria[`${ fault.section }`].questions ?? {} ).length > 0 ) {
				const _faultQuestion = _assessmentCriteria[`${ fault.section }`].questions[`${ fault.question }`];

				setFaultQuestion( _faultQuestion );
			}
		}
	}, [ fault ]);

	const handleCloseFault = async () => {
		setLoading( true );

		if( dbIsReady && !!user ) {
			const result: Array<Fault> | undefined = await closeFault( db, faultId, user?.id, faultComment );

			if( result ) {
				console.log( result[0].closedAt );
				setLoading( false );
			}
		}
	}

	return (<>
		<Stack.Screen options={{ title: fault?.faultCode?.name ?? "Close Fault" }} />
		<ScrollViewContainer>
			<ScreenTitle title="Fault Details" />
			<CardsContainer>
				<GridRow style={{ marginInline: -10 }}>
					<GridColumn style={ styles.column }>
						<Card>
							<View style={{ marginBottom: 20 }}>
								<CardTitle title="Assessment Criteria" />
							</View>
							<View style={{ marginBottom: 10 }}>
								<CardLabel title='Inspection' />
								<Text>{ fault?.inspection?.name }</Text>
							</View>
							<View style={{ marginBottom: 10 }}>
								<CardLabel title='Inspection Type' />
								<Text>{ fault?.inspection?.inspectionType?.name }</Text>
							</View>
							<View style={{ marginBottom: 10 }}>
								<CardLabel title='Inspection Template' />
								<Text>{ inspectionTemplate?.revisionActive?.name ?? '' }</Text>
							</View>
							{ !!faultSectionName && (
								<View style={{ marginBottom: 10 }}>
									<CardLabel title='Inspection Section' />
									<Text>{ faultSectionName }</Text>
								</View>
							)}
							{ !!faultQuestion && (
								<View>
									<CardLabel title='Inspection Question' />
									<Text>{ `${ faultQuestion?.id } ${ faultQuestion?.content }`}</Text>
								</View>
							)}
						</Card>
					</GridColumn>
					<GridColumn style={ styles.column }>
						<Card>
							<View style={{ marginBottom: 20 }}>
								<CardTitle title="Fault Code" />
							</View>
							<View style={{ marginBottom: 10 }}>
								<GridRow style={{ marginBottom: 5, alignItems: "center" }}>
									<GridColumn style={{ marginRight: 5 }}>
										<View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: fault?.faultCode?.colour }}></View>
									</GridColumn>
									<GridColumn>
										<Text>{ fault?.faultCode?.name }</Text>
									</GridColumn>
								</GridRow>
								<Text>{ fault?.faultCode?.description }</Text>
							</View>
							<View style={{ marginBottom: 10 }}>
								<CardLabel title='Risk Score' />
								<Text>{ fault?.faultCode?.risk }</Text>
							</View>
							{ !!fault?.faultCode?.risk && (
								<View>
									<CardLabel title='Remediation Deadline' />
									<Text>{ `${ fault?.faultCode?.remediateWithin } day${ fault?.faultCode?.remediateWithin > 1 ? 's' : '' }` }</Text>
								</View>
							)}
						</Card>
					</GridColumn>
				</GridRow>
			</CardsContainer>
			<ScreenTitle title="Close Fault" />
			<CardsContainer>
				<Card>
					<Text style={{ marginBottom: 10 }}>Fault Closure Comment</Text>
					<TextInput multiline numberOfLines={ 5 } placeholder="Fault closure comment..." value={ faultComment } onChangeText={ setFaultComment } textAlignVertical="top" style={ styles.input } />
					<TouchableOpacityButton label="Close Fault" pressHandler={ handleCloseFault } activity={ loading } />
				</Card>
			</CardsContainer>

			{/* TODO: Redirect back to fautls index */}
		</ScrollViewContainer>
	</>)
}

const styles = StyleSheet.create({
	column: {
		width: screenWidth > 768 ? '50%' : '100%',
		paddingInline: 10
	},
	input: {
		fontSize: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: ACCENT_COLOUR,
		borderRadius: 10,
		marginBottom: 16,
		minHeight: 200
	},
})