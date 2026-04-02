import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import { getAllInspections } from "@/src/db/queries/inspections";
import { Inspection } from "@/src/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

function Inspections() {
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
	if( !dbIsReady || !db ) return <ActivityIndicator />;

	return (
		<View>
			<Text>Inspections</Text>
			{inspections.map( inspection => (
				<View key={ inspection.id }>
					<Text>{ inspection.name }</Text>
				</View>
			))}
		</View>
	)
}

export default Inspections