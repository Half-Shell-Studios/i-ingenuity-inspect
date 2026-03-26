import { workOrdersApi } from "@/src/api/workOrders";
import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import type { WorkOrder } from "@/src/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

function WorkOrdersIndex() {
	const router = useRouter();
	const [ workOrders, setWorkOrders ] = useState<WorkOrder[]>([]);
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		loadWorkOrders();
	}, []);

	async function loadWorkOrders() {
		try {
			const { data } = await workOrdersApi.getAll();
			setWorkOrders( data );
		} catch (error) {
			console.error( "Failed to load work orders:", error );
		} finally {
			setLoading( false );
		}
	}

	if( loading ) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#4f46e5" />
			</View>
		);
	}


	return (
		<ScrollViewContainer>
			<Text>Work Orders</Text>
			<CardsContainer>
				{workOrders.map(( workOrder ) => (
					<TouchableOpacity key={ workOrder.id } onPress={() => router.push( `/work-orders/${ workOrder.id }`)}>
						<Card>
							<CardTitle title={ workOrder.name } />
						</Card>
					</TouchableOpacity>
				))}
			</CardsContainer>
		</ScrollViewContainer>
	)
}

export default WorkOrdersIndex