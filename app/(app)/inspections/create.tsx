import Choice from "@/src/components/Choice";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import TouchableOpacityButton from "@/src/components/TouchableOpacityButton";
import { useAuth } from "@/src/context/AuthContext";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import { createNewInspection, getAllInspectionTypes, getInspectionTemplatesByInspectionType } from "@/src/db/queries/inspections";
import { AssetTag, InspectionTemplateRevision, InspectionType } from "@/src/types/";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

function CreateInspection() {
	const router = useRouter();
	const { user } = useAuth();
	const { assetTag: assetTagId } = useLocalSearchParams<{ assetTag: string }>();
	const [ inspectionTypes, setInspectionTypes ] = useState<InspectionType[]>([]);
	const [ inspectionTemplates, setInspectionTemplates ] = useState<InspectionTemplateRevision[]>([]);
	const [ assetTag, setAssetTag ] = useState<AssetTag>();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ selectedType, setSelectedType ] = useState<string>('');
	const [ selectedTemplate, setSelectedTemplate ] = useState<string>('');
	const [ selectedTemplateRevision, setSelectedTemplateRevision ] = useState<string>('');

	const startInspection = async () => {
		const now = new Date;

		if( !user ) return;
		if( !assetTag?.id ) return;
		if( !selectedTemplate ) return;

		const result = await createNewInspection( db, {
			assetTagId: assetTag.id,
			assetTemplateId: assetTag.assetTemplateId,
			assetTemplateRevisionId: assetTag.assetTemplateRevisionId,
			inspectionTypeId: selectedType,
			inspectionTemplateId: selectedTemplate,
			inspectionTemplateRevisionId: selectedTemplateRevision,
			locationId: assetTag.locationId,
			name: `${ assetTag.name } ${ String( now.getDate() ).padStart( 2, '0' ) }-${ String( now.getMonth() ).padStart( 2, '0' ) }-${ now.getFullYear() } ${ String( now.getHours() ).padStart( 2, '0' ) }:${ String( now.getMinutes() ).padStart( 2, '0' ) }`,
			assessment: [],
			notes: '',
			inspectedBy: user.id
		});

		if( !result ) return;

		const [ inspection ] = result;

		router.push(`/inspections/${ inspection.insertedId }/edit`);
	}
	
	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setInspectionTypes( await getAllInspectionTypes( db ) )
			})();
		}
	}, [ db, dbIsReady ]);
	
	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setAssetTag( await getAssetTagById( db, assetTagId ) )
			})();
		}
	}, [ db, dbIsReady, assetTagId ]);

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setInspectionTemplates( await getInspectionTemplatesByInspectionType( db, selectedType ) );
			})();
		}
	}, [ db, dbIsReady, selectedType ]);

	useEffect(() => {
		setSelectedTemplate('');
	}, [ selectedType ])

	useEffect(() => {
		if( inspectionTemplates?.length > 0 ) {
			const _inspectionTemplateRevision = inspectionTemplates.find( template => template.id === selectedTemplate );
			setSelectedTemplateRevision( _inspectionTemplateRevision?.id ?? '' );
		}
	}, [ selectedTemplate ]);

	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<ScrollViewContainer>
			<ScreenTitle title={`Create an Inspection for ${ assetTag?.name }`} />
			<View style={{ marginBottom: 20 }}>
				<Text style={{ marginBottom: 10 }}>1. Choose your Inspection Type</Text>
				{inspectionTypes.map( inspectionType => (
					<View key={ inspectionType.id } onTouchEnd={() => setSelectedType( inspectionType.id ) }>
						<Choice label={ inspectionType.name } value={ inspectionType.id } selected={ selectedType === inspectionType.id } />
					</View>
				))}
			</View>
			{ !!inspectionTemplates?.length && (
				<View style={{ marginBottom: 20 }}>
					<Text style={{ marginBottom: 10 }}>2. Choose your Inspection Template</Text>
					{inspectionTemplates.map( inspectionTemplate => (
						<View key={ inspectionTemplate.id } onTouchEnd={() => setSelectedTemplate( inspectionTemplate.id ) }>
							<Choice label={ inspectionTemplate.name } value={ inspectionTemplate.id } selected={ selectedTemplate === inspectionTemplate.id } />
						</View>
					))}
				</View>
			)}
			<TouchableOpacityButton label="Start Inspection" pressHandler={ startInspection } />
		</ScrollViewContainer>
	)
}

export default CreateInspection