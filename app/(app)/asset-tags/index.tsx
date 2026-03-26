import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import { getAllAssetTags } from "@/src/db/queries/assetTags";
import AssetTag from "@/src/types/AssetTag";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AssetTagsIndex() {
	const router = useRouter();
	const [ tags, setTags ] = useState<AssetTag[]>([]);

	useEffect(() => {
		(async() => {
			setTags( await getAllAssetTags() );
		})();
	}, []);

	return (
		<ScrollView style={{ padding: 20 }}>
			<Text style={{ fontSize: 32, marginBottom: 16, marginTop: 30}}>Tags ({ tags.length })</Text>
			<CardsContainer>
				{ tags.map(( tag ) => (
					<TouchableOpacity key={ tag.id } onPress={() => router.push( `/(app)/asset-tags/${ tag.id }` )}>
						<Card>
							<Text>Tag</Text>
							<Text style={ styles.cardTitle }>
								{ tag.name }
							</Text>
							{ tag?.description && (
								<Text style={ styles.cardDesc }>
									{ tag.description }
								</Text>
							)}
							<Text>Element</Text>
							<Text style={ styles.cardTitle }>
								{ tag.assetTemplate?.revisionActive?.manufacturer } { tag.assetTemplate?.revisionActive?.model }
							</Text>
							{ tag.assetTemplate?.revisionActive?.description && (
								<Text style={ styles.cardDesc }>
									{ tag.assetTemplate?.revisionActive?.description }
								</Text>
							)}
							{( tag.faultsOpen?.length ?? 0 ) > 0 && (<>
								<Text>Open Faults ({ tag.faultsOpen?.length })</Text>
								{/* { tag.faultsOpen?.map((fault, index) => (
									<Fragment key={ fault.id }>
										<Text style={ styles.cardTitle }>
											{ ( index + 1 ) }. { fault.section } - { fault.question }
										</Text>
										<Text>{ fault.raisedComment }</Text>
									</Fragment>
								))} */}
							</>)}
							<Link href="/inspect">
								Inspect { tag.name }
							</Link>
						</Card>
					</TouchableOpacity>
				))}
			</CardsContainer>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 20,
	},
	cardDesc: {
		fontSize: 14,
		color: "#6b7280",
	},
});