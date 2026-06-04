import { Stack } from 'expo-router';
import React from 'react';

export default function AssetTagsLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{
				title: "Asset Tags"
			}} />
			<Stack.Screen name="[assetTag]" options={{
				title: "Asset Tag"
			}} />
		</Stack>
	);
}