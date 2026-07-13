import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { ACCENT_COLOUR } from "@/src/constants/colours";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAllInspections } from "@/src/db/queries/inspections";
import { Inspection } from "@/src/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

function InspectionsIndex() {
	const router = useRouter();
	const { isReady: dbIsReady, error: dbError, db } = useWorkOrderDb();
	const [ inspections, setInspections ] = useState<Inspection[]>([]);

	useEffect(() => {
		if( dbIsReady ) {
			(async() => {
				setInspections( await getAllInspections( db ) )
			})();
		}
	}, [ db, dbIsReady ]);
	
	if( dbError ) return <Text>Error: { dbError }</Text>;
	if( !dbIsReady || !db || ( dbIsReady && ( inspections?.length < 1 ) ) ) return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator size="large" color={ ACCENT_COLOUR } />
		</View>
	);

	return (
		<ScrollViewContainer>
			<ScreenTitle title="Inspections" />
			<CardsContainer>
				<Card>
					<CardTitle title="debugging" />
					<Text>{ JSON.stringify( inspections ) }</Text>
				</Card>
			</CardsContainer>
			{ inspections?.length ? (
				<CardsContainer>
					{inspections.map( inspection => {
						return (
							<TouchableOpacity key={ inspection?.id } onPress={() => router.push({
								pathname: "/inspections/[inspection]",
								params: {
									inspection: inspection?.id
								}
							})}>
								<Card>
									<CardTitle title={ inspection?.name } />
								</Card>
							</TouchableOpacity>
						)
					})}
				</CardsContainer>
			) : null }
		</ScrollViewContainer>
	);
}

export default InspectionsIndex