import { Stack } from 'expo-router';

export default function FaultsLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{
				title: "Faults"
			}} />
			<Stack.Screen name="[faultId]" options={{
				title: "Fault"
			}} />
		</Stack>
	);
}