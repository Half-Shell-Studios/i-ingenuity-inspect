import { getAllInspectionTypes } from "@/src/db/queries/inspections";
import InspectionType from "@/src/types/InspectionType";
import { useEffect, useState } from "react"
import { Text, View } from "react-native"

function Inspections() {
	const [ inspectionTypes, setInspectionTypes ] = useState<InspectionType[]>([]);

	useEffect(() => {
		(async() => {
			setInspectionTypes( await getAllInspectionTypes() )
		})();
	}, []);

	return (
		<View>
			<Text>Inspections</Text>
			{inspectionTypes.map( inspectionType => (
				<View key={ inspectionType.id }>
					<Text>{ inspectionType.name }</Text>
				</View>
			))}
		</View>
	)
}

export default Inspections