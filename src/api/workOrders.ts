import type { UpdateWorkOrderPayload, WorkOrder } from "@/src/types/WorkOrder";
import { getActiveWorkOrderUuid, setActiveWorkOrderUuid } from "@/src/utils/storage";
import { Directory, File, Paths } from "expo-file-system/next";
import { router } from "expo-router";
import client from "./client";

const sqliteDir = new Directory( Paths.document, "SQLite" );

export const workOrdersApi = {
	getAll: () => client.get<WorkOrder[]>( '/work-orders' ),

	getById: ( id: string ) => client.get<WorkOrder>( `/work-orders/${ id }` ),

	// create: ( payload: CreateWorkOrderPayload ) => client.post<WorkOrder>( '/work-orders', payload ),

	update: ( id: string, payload: UpdateWorkOrderPayload ) => client.patch<WorkOrder>( `/work-orders/${id}`, payload ),

	// delete: ( id: string ) => client.delete( `/work-orders/${ id }` ),
};

export async function downloadWorkOrdersDb( uuid: string ): Promise<void> {
	if( uuid === '' ) return;

	// 1. Ensure the SQLite directory exists
	if( !sqliteDir.exists ) {
		sqliteDir.create();
	}

	// 2. Check if file already exists locally
	const localDbFile = new File( sqliteDir, `${ uuid }.db` );
	if( localDbFile.exists ) {
		// Still save as active
		await setActiveWorkOrderUuid( uuid );

		return;
	}

	// 3. Download from backend
	const { data: dbFile } = await client.get( `/work-orders/${ uuid }/db`, {
		responseType: "arraybuffer",
	});

	// 4. Save to device with UUID as filename
	localDbFile.write( new Uint8Array( dbFile ) );

	await setActiveWorkOrderUuid( uuid );

	router.replace( `/(app)/work-orders/${ uuid }` );
}

export async function getActiveWorkOrderDbName(): Promise<string | null> {
	return getActiveWorkOrderUuid();
}

export function dbExists( uuid: string ): boolean {
	if( uuid === '' ) return false;

	const dbFile = new File( sqliteDir, `${ uuid }.db` );
	
	return dbFile.exists;
}

export function deleteLocalDb( uuid: string ): void {
	if( dbExists( uuid ) ) {
		const dbFile = new File( sqliteDir, `${ uuid }.db` );
		dbFile.delete();
	}
}