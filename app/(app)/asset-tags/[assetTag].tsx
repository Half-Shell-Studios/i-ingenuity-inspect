import GridRow from "@/src/components/GridRow";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAssetTagById } from "@/src/db/queries/assetTags";
import AssetTag from "@/src/types/AssetTag";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function AssetTagShow() {
	const router = useRouter();
	const { assetTag: assetTagId }: { assetTag: string } = useLocalSearchParams();
	const [ assetTag, setAssetTag ] = useState<AssetTag>();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setAssetTag( await getAssetTagById( db, assetTagId ) );
			})();
		}
	}, [ db, assetTagId ]);

	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<ScrollViewContainer>
			<GridRow>
				<View style={{ flex: 1 }}>
					<Text style={ styles.lead }>Asset Tag</Text>
					<Text style={ styles.title }>{ assetTag?.name }</Text>
					{!!( assetTag?.description ) && (
						<Text>{ assetTag?.description }</Text>
					)}
				</View>
				<View style={{ flex: 0 }}>
					<TouchableOpacity style={ styles.button } onPress={() => router.push({ pathname: `/inspections/create`, params: { assetTag: assetTag?.id } })}>
						<Text style={ styles.buttonText }>Inspect</Text>
					</TouchableOpacity>
				</View>
			</GridRow>
			<GridRow>
				<View style={{ flex: 1 }}>
					<Text style={ styles.lead }>Tag Height</Text>
					<Text style={ styles.title }>{ assetTag?.height }</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text style={ styles.lead }>Tag Vintage</Text>
					<Text style={ styles.title }>{ assetTag?.vintage }</Text>
				</View>
			</GridRow>

			<Text style={ styles.lead }>Asset Template</Text>
			<Text style={ styles.title }>
				{ assetTag?.assetTemplate?.revisionActive?.manufacturer } { assetTag?.assetTemplate?.revisionActive?.model }
			</Text>
			{!!( assetTag?.assetTemplate?.revisionActive?.description ) && (
				<Text>{ assetTag?.assetTemplate?.revisionActive?.description }</Text>
			)}
			<View style={{ flexDirection: 'row', marginBottom: 10 }}>
				<View style={{ flex: 1 }}>
					<Text style={ styles.lead }>Faults</Text>
					<Text>{ assetTag?.faults?.length }</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text style={ styles.lead }>Faults Open</Text>
					<Text>{ assetTag?.faultsOpen?.length }</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text style={ styles.lead }>Faults Closed</Text>
					<Text>{ assetTag?.faultsClosed?.length }</Text>
				</View>
			</View>
			{( !!( assetTag?.faultsOpen?.length ) || !!( assetTag?.faultsClosed?.length ) ) && (<>
				<Text style={ styles.lead }>Faults</Text>
				{( !!( ( assetTag?.faultsOpen?.length ?? 0 ) > 0 ) ) && (<>
					<Text style={ styles.title }>
						Open Faults
					</Text>
					{assetTag?.faultsOpen?.map(( fault, index ) => (
						<View style={{ flexDirection: 'row', columnGap: 4 }} key={ fault.id }>
							<View style={{ flex: 0 }}>
								<Text>{ String( ( index + 1 ) ).padStart( 2, '0' ) }.</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text>{ fault.section }</Text>
								<Text style={ styles.title }>{ fault.question }</Text>
								<Text>{ fault.raisedComment }</Text>
							</View>
						</View>
					))}
				</>)}
				{( !!( ( assetTag?.faultsClosed?.length ?? 0 ) > 0 ) ) && (<>
					<Text style={ styles.title }>
						Closed Faults
					</Text>
					{assetTag?.faultsClosed?.map(( fault, index ) => (
						<View style={{ flexDirection: 'row', columnGap: 4 }} key={ fault.id }>
							<View style={{ flex: 0 }}>
								<Text>{ String( ( index + 1 ) ).padStart( 2, '0' ) }.</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text>{ fault.section }</Text>
								<Text style={ styles.title }>{ fault.question }</Text>
								<Text>{ fault.raisedComment }</Text>
							</View>
						</View>
					))}
				</>)}
			</>)}

			{/* <Text>AssetTag:</Text> */}
			{/* <Text>{ JSON.stringify( assetTagId ) }</Text> */}
			{/* <Text>{ JSON.stringify( assetTag ) }</Text> */}
		</ScrollViewContainer>
	)
}

const styles = StyleSheet.create({
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
	}
});

export default AssetTagShow