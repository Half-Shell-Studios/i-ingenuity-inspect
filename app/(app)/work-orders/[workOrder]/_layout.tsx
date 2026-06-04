import { tabOptions } from '@/app/(app)/_layout';
import AssetTagsIcon from '@/assets/icons/asset-tags.svg';
import FaultsIcon from '@/assets/icons/faults.svg';
import InspectionsIcon from '@/assets/icons/inspections.svg';
import WorkOrderIcon from '@/assets/icons/work-orders.svg';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function WorkOrderLayout() {
	return (
		<Tabs>
			<Tabs.Screen name="index" options={{
				...tabOptions( "Work Order" ),
				tabBarIcon: ({ color, size }) => (
					<WorkOrderIcon width={ size } height={ size } stroke={ color } />
				),
			}} />
			<Tabs.Screen name="asset-tags" options={{ 
				...tabOptions( "Asset Tags" ),
				tabBarIcon: ({ color, size }) => (
					<AssetTagsIcon width={ size } height={ size } stroke={ color } />
				),
			}} />
			<Tabs.Screen name="inspections" options={{
				...tabOptions( "Inspections" ),
				tabBarIcon: ({ color, size }) => (
					<InspectionsIcon width={ size } height={ size } stroke={ color } />
				),
			}} />
			<Tabs.Screen name="faults" options={{
				...tabOptions( "Faults" ),
				tabBarIcon: ({ color, size }) => (
					<FaultsIcon width={ size } height={ size } color={ color } />
				),
			}} />
		</Tabs>
	)
}

const styles = StyleSheet.create({})