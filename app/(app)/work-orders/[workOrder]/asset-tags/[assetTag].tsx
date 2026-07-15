import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import GridColumn from "@/src/components/GridColumn";
import GridRow from "@/src/components/GridRow";
import LinkButton from "@/src/components/LinkButton";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import AssetTag from "@/src/types/AssetTag";
import { convertNullStrings } from "@/src/utils/helpers";
import { Image, useImage } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";

const { width: screenWidth } = Dimensions.get( 'window' );

function AssetTagShow() {
	const router = useRouter();
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();
	const { assetTag: assetTagId }: { assetTag: string } = useLocalSearchParams();
	const [ assetTag, setAssetTag ] = useState<AssetTag>();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ cardWidth, setCardWidth ] = useState<number>(screenWidth);
	const sampleImage = useImage( require('@/assets/images/sample-image.jpg'), {
		maxWidth: Math.min(360, cardWidth),
		maxHeight: Math.min(480, screenHeight),
	});

	useEffect(() => {
		setCardWidth( screenWidth - 40 );
	}, [ screenWidth ]);

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				const newAssetTag = await getAssetTagById( db, assetTagId );
				const newAssetTagMetadata = convertNullStrings( JSON.parse( newAssetTag.assetTemplate.revisionActive.metadata ) );

				newAssetTag.assetTemplate.revisionActive.metadata = newAssetTagMetadata;


				setAssetTag( newAssetTag );
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
						<LinkButton href={{ pathname: `../inspections/create`, params: { assetTag: assetTag?.id } }} label="Inspect" />
					</View>
				</GridRow>
			</View>
			<CardsContainer>
				<Card>
					<GridRow>
						{ !!( assetTag?.height ?? false ) && assetTag?.height !== 'NULL' && (
							<View style={{ flex: 1 }}>
								<Text style={ styles.lead }>Tag Height</Text>
								<CardTitle title={ assetTag?.height ?? '' } />
							</View>
						)}
						{ !!assetTag?.vintage && (
							<View style={{ flex: 1 }}>
								<Text style={ styles.lead }>Tag Vintage</Text>
								<CardTitle title={ assetTag?.vintage ?? '' } />
							</View>
						)}
					</GridRow>
				</Card>

				<Card>
					<GridRow>
						<GridColumn style={ styles.column }>
							<Text style={ styles.lead }>Asset Template</Text>
							<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.manufacturer } ${ assetTag?.assetTemplate?.revisionActive?.model }` } />
							{!!( assetTag?.assetTemplate?.revisionActive?.description ) && (
								<Text>{ assetTag?.assetTemplate?.revisionActive?.description }</Text>
							)}
						</GridColumn>
						<GridColumn style={ styles.column }>
							<Text style={ styles.lead }>Asset Type</Text>
							<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.type }` } />
						</GridColumn>
						<GridColumn style={ styles.column }>
							<Text style={ styles.lead }>Classification</Text>
							<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.classification }` } />
						</GridColumn>
					</GridRow>
				</Card>
				
				<Card>
					<GridRow>
						<GridColumn style={ styles.column }>
							<Text style={ styles.lead }>Protection Concept Type</Text>
							<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.protection }` } />
						</GridColumn>
						<GridColumn style={ styles.column }>
							<Text style={ styles.lead }>IP Rating</Text>
							<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.ipRating ?? 'Not Set' }` } />
						</GridColumn>
						<GridColumn style={ styles.column }>
							<Text style={ styles.lead }>Gas Group</Text>
							<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.metadata?.groups?.gas_group ?? 'Not Set' }` } />
						</GridColumn>
						<GridColumn style={ styles.column }>
							<Text style={ styles.lead }>Dust Group</Text>
							<CardTitle title={ `${ assetTag?.assetTemplate?.revisionActive?.metadata?.groups?.dust_group ?? 'Not Set' }` } />
						</GridColumn>
					</GridRow>
				</Card>

				{/* {"groups":{"gas_group":"IIC","gas_temperature_class":"4","gas_temperature_custom":false,"dust_group":"null","dust_temperature_class":"","dust_temperature_custom":false},"protection":[{"extension":"ia","level":"Ga","type":"i","zone":2}],"isf":[]} */}
			
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

					{ ( assetTag?.faultsOpen?.length ?? 0 ) > 0 && (
						<View style={{ marginBottom: 30 }}>
							<View style={{ marginBottom: 10 }}>
								<CardTitle title="Open Faults" />
							</View>
							{assetTag?.faultsOpenBySection?.map(( section, index ) => (
								<View key={`fault-section-${ index }`}>
									<Text style={ styles.lead }>{ section.sectionName }</Text>
									{section.faults.map(( fault, index ) => (
										<View style={{ flexDirection: 'row', columnGap: 4, marginBottom: 5 }} key={ fault.id }>	
											<View style={{ flex: 0 }}>
												<Text>{ String( ( index + 1 ) ).padStart( 2, '0' ) }.</Text>
											</View>
											<View style={{ flex: 1 }}>
												<Text>{ fault.question }</Text>
												<Text>{ fault.raisedComment }</Text>
											</View>
											<View style={{ flex: 0 }}>
												<LinkButton href={{ pathname: `../faults/[faultId]`, params: { faultId: fault.id } }} label="Close" />
											</View>
										</View>
									))}
								</View>
							))}
						</View>
					)}
					{( assetTag?.faultsClosed?.length ?? 0 ) > 0 && (
						<View style={{ marginBottom: 20 }}>
							<View style={{ marginBottom: 10 }}>
								<CardTitle title="Closed Faults" />
							</View>
							{assetTag?.faultsClosedBySection?.map(( section, index ) => (
								<View key={`fault-section-${ index }`}>
									<Text>{ section.sectionName }</Text>
									{section.faults.map( fault => (
										<View style={{ flexDirection: 'row', columnGap: 4 }} key={ fault.id }>	
											<View style={{ flex: 0 }}>
												<Text>{ String( ( index + 1 ) ).padStart( 2, '0' ) }.</Text>
											</View>
											<View style={{ flex: 1 }}>
												<Text>{ fault.question }</Text>
												<Text>{ fault.closedComment }</Text>
											</View>
										</View>
									))}
								</View>
							))}
						</View>
					)}

				</Card>
					{/* {( assetTag?.attachments?.length ?? 0 ) > 0 && (
					)} */}
				<Card>
					<View>
						<View style={{ marginBottom: 10 }}>
							<CardTitle title="Attachments" />
						</View>
						{/* <ScrollView horizontal pagingEnabled snapToAlignment="start" snapToInterval={ cardWidth * 0.75 + 10 } decelerationRate="fast" showsHorizontalScrollIndicator={ false }> */}
						<ScrollView horizontal pagingEnabled={ true } showsHorizontalScrollIndicator={ false } snapToAlignment="start">
							{Array.from({ length: 5 }).map((_, index) => (
								<View key={ index } style={{ width: 360 }}>
									<View key={ index } style={{ paddingRight: 10 }}>
										{ sampleImage && (<>
											{/* TODO: Implement a lightbox style function for the image. */}
											{/* TODO: Implement a pinch to zoom function for the image. */}
											<Image source={ sampleImage } style={{ ...styles.image, width: ( sampleImage.width - 10 ), aspectRatio: ( sampleImage.width / sampleImage.height ) }} />
											<Text>Sample Image { index + 1 }</Text>
										</>)}
									</View>
								</View>
							))}
						</ScrollView>
					</View>
				</Card>
			</CardsContainer>
		</ScrollViewContainer>
	)
}

const styles = StyleSheet.create({
	column: {
		width: screenWidth > 768 ? '25%' : '50%',
		paddingInline: 10
	},
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
	},
	image: {
		marginBottom: 5,
	}
});

export default AssetTagShow