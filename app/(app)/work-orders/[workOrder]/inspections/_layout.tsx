import { Stack } from 'expo-router';

export default function InspectionsLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{
				title: "Inspections"
			}} />
			<Stack.Screen name="create" options={{
				title: "Create an Inspection"
			}} />
			<Stack.Screen name="[inspection]" options={{
				title: "Inspection Details"
			}} />
			<Stack.Screen name="[inspection]/edit" options={{
				title: "Inspection Details"
			}} />
		</Stack>
	);
}