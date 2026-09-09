import { deleteLocalDb, workOrdersApi } from "@/src/api/workOrders";
import Card from "@/src/components/Card";
import CardsContainer from "@/src/components/CardsContainer";
import CardTitle from "@/src/components/CardTitle";
import ScreenTitle from "@/src/components/ScreenTitle";
import ScrollViewContainer from "@/src/components/ScrollViewContainer";
import { ACCENT_COLOUR } from "@/src/constants/colours";
import { useAuth } from "@/src/context/AuthContext";
import { useWorkOrderDb } from "@/src/context/WorkOrderDbContext";
import type { WorkOrder } from "@/src/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function WorkOrdersIndex() {
	const router = useRouter();
	const { user } = useAuth();
	const { openWorkOrder, closeWorkOrder, activeWorkOrderId } = useWorkOrderDb();
	const [ workOrders, setWorkOrders ] = useState<WorkOrder[]>([]);
	const [ loading, setLoading ] = useState(true);
	const [ downloading, setDownloading ] = useState<string | null>(null);

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

	async function handleLongPress( workOrder: WorkOrder ) {
		Alert.alert('Delete Work Order', `Are you sure you want to delete ${ workOrder.name } from this device? Any local changes will be lost.`, [{
			text: 'Cancel',
			onPress: () => false,
			style: 'cancel',
		}, {
			text: 'OK',
			onPress: async () => {
				if( activeWorkOrderId === workOrder.id ) {
					await closeWorkOrder();
				}
				await deleteLocalDb( workOrder.id );
			}
		}]);
	}

	async function refreshCallback() {
		await loadWorkOrders();
	}

	if( loading ) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={ ACCENT_COLOUR } />
			</View>
		);
	}

	return (
		<ScrollViewContainer refreshCallback={ refreshCallback }>
			<ScreenTitle title={ `Hello, ${ user?.name }!` } />
			<Text style={ styles.intro }>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid dolor rerum numquam ullam consequuntur odit tenetur dolorum, voluptate impedit!</Text>
			<Text style={ styles.greeting }>Your Active Work Orders</Text>
			<CardsContainer>
				{workOrders.map( workOrder  => (
					<TouchableOpacity key={ workOrder.id } disabled={ downloading !== null } onPress={ () => handlePress( workOrder ) } onLongPress={() => handleLongPress( workOrder ) }>
						<Card>
							<View style={{ flexDirection: "row", justifyContent: "space-between"}}>
								<CardTitle title={ workOrder.name } />
								{ downloading === workOrder.id && (
									<ActivityIndicator size="small" color={ ACCENT_COLOUR } />
								)}
							</View>
						</Card>
					</TouchableOpacity>
				))}
			</CardsContainer>
		</ScrollViewContainer>
	);
}

const styles = StyleSheet.create({
	greeting: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
	},
	intro: {
		fontSize: 14,
		marginBottom: 30,
	},
});

export default WorkOrdersIndex;