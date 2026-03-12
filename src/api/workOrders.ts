import type { UpdateWorkOrderPayload, WorkOrder } from "@/src/types/WorkOrder";
import { Directory, File, Paths } from "expo-file-system/next";
import { router } from "expo-router";
import client from "./client";

const DB_NAME = "work_orders.db";
const sqliteDir = new Directory(Paths.document, "SQLite");
const localDbFile = new File(sqliteDir, DB_NAME);

export const workOrdersApi = {
	getAll: () => client.get<WorkOrder[]>( '/work-orders' ),

	getById: ( id: string ) => client.get<WorkOrder>( `/work-orders/${ id }` ),

	// create: ( payload: CreateWorkOrderPayload ) => client.post<WorkOrder>( '/work-orders', payload ),

	update: ( id: string, payload: UpdateWorkOrderPayload ) => client.patch<WorkOrder>( `/work-orders/${id}`, payload ),

	// delete: ( id: string ) => client.delete( `/work-orders/${ id }` ),
};

export async function downloadWorkOrdersDb( itemId: string ): Promise<void> {
	// Ensure SQLite directory exists
	if( !sqliteDir.exists ) {
		sqliteDir.create();
	}

	// Download the file
	const { data: dbFile } = await client.get(`/work-orders/${ itemId }`, {
		responseType: "arraybuffer",
	});

	// Remove old file if it exists
	if( localDbFile.exists ) {
		localDbFile.delete();
	}

	localDbFile.write( new Uint8Array( dbFile ) );

	router.replace( '/(app)/work-orders/WorkOrders' );
}

export function dbExists(): boolean {
	return localDbFile.exists;
}

export function deleteLocalDb(): void {
	if( localDbFile.exists ) {
		localDbFile.delete();
	}
}