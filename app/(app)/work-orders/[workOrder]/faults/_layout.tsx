import { Stack } from 'expo-router';
import React from 'react';

export default function FaultsLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{
				title: "Faults"
			}} />
			<Stack.Screen name="[fault]" options={{
				title: "Fault"
			}} />
		</Stack>
	);
}