import { workOrdersApi } from "@/src/api/workOrders";
import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import type { WorkOrder } from "@/src/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

function WorkOrdersIndex() {
	const router = useRouter();
	const { openWorkOrder } = useWorkOrderDb();
	const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState<string | null>(null);

	useEffect(() => {
		loadWorkOrders();
	}, []);

	async function loadWorkOrders() {
		setLoading( true );

		try {
			const { data } = await workOrdersApi.getAll();
			setWorkOrders( data );
		} catch( error ) {
			console.error("Failed to load work orders:", error);
		} finally {
			setLoading( false );
		}
	}

	async function handlePress( workOrder: WorkOrder ) {
		try {
			setDownloading( workOrder.id );

			// Download (if needed) + open SQLite connection
			await openWorkOrder( workOrder.id );

			// Navigate only after DB is ready
			router.push(`/work-orders/${ workOrder.id }`);
		} catch( error ) {
			console.error( "Failed to open work order:", error );
		} finally {
			setDownloading( null );
		}
	}

	async function refreshCallback() {
		await loadWorkOrders();
	}

	if( loading ) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#4f46e5" />
			</View>
		);
	}

	return (
		<ScrollViewContainer refreshCallback={ refreshCallback }>
			<ScreenTitle title="Work Orders" />
			<CardsContainer>
				{workOrders.map( workOrder  => (
					<TouchableOpacity key={ workOrder.id } disabled={ downloading !== null } onPress={ () => handlePress( workOrder ) }>
						<Card>
							<View>
								<CardTitle title={ workOrder.name } />
								{ downloading === workOrder.id && (
									<ActivityIndicator size="small" color="#4f46e5" />
								)}
							</View>
						</Card>
					</TouchableOpacity>
				))}
			</CardsContainer>
		</ScrollViewContainer>
	);
}

export default WorkOrdersIndex;