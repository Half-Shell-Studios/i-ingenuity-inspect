import type { WorkOrder } from '@/src/types/WorkOrder';
import { getActiveWorkOrderUuid, setActiveWorkOrderUuid } from '@/src/utils/storage';
import { Directory, File, Paths } from 'expo-file-system';
import client from "./client";

const sqliteDir = new Directory( Paths.document, 'SQLite' );

export const workOrdersApi = {
	getAll: () => client.get<WorkOrder[]>( '/work-orders' ),

	getById: ( id: string ) => client.get<ArrayBuffer>( `/work-orders/${ id }/download`, { responseType: "arraybuffer" } ),

	// create: ( payload: CreateWorkOrderPayload ) => client.post<WorkOrder>( '/work-orders', payload ),

	// update: ( id: string, payload: UpdateWorkOrderPayload ) => client.patch<WorkOrder>( `/work-orders/${id}`, payload ),

	// delete: ( id: string ) => client.delete( `/work-orders/${ id }` ),
};

export async function downloadWorkOrdersDb( uuid: string ): Promise<void> {
	if( uuid === "" ) return;

	if( !sqliteDir.exists ) {
		sqliteDir.create();
	}

	const localDbFile = new File( sqliteDir, `${ uuid }.sqlite` );
	if( localDbFile.exists ) {
		await setActiveWorkOrderUuid( uuid );
		return;
	}

	const { data: dbFile } = await workOrdersApi.getById( uuid );

	localDbFile.write( new Uint8Array( dbFile ) );
	
	await setActiveWorkOrderUuid( uuid );
}

export async function getActiveWorkOrderDbName(): Promise<string | null> {
	return getActiveWorkOrderUuid();
}

export function dbExists( uuid: string ): boolean {
	if( uuid === '' ) return false;

	const dbFile = new File( sqliteDir, `${ uuid }.sqlite` );
	
	return dbFile.exists;
}

export async function deleteLocalDb( uuid: string ): Promise<void> {
	debugSqliteDir();
	if( !dbExists( uuid ) ) return;

	for( const extension of [ 'db', 'sqlite' ] ) {
		for( const suffix of [ '', '-wal', '-shm' ] ) {
			const file = new File( sqliteDir, `${ uuid }.${ extension }${ suffix }` );
			console.log( file );

			if( file.exists ) {
				file.delete();
				console.log( `Deleted ${ uuid }.sqlite${ suffix }` );
			} else {
				console.log( `File ${ uuid }.sqlite${ suffix } does not exist.` );
			}
		}
	}

	console.log( "Exists after delete?", dbExists( uuid ) );

	debugSqliteDir();
}

export function debugSqliteDir(): void {
	if( !sqliteDir.exists ) {
		console.log( "SQLite directory does not exist." );
		return;
	}

	const files = sqliteDir.list();

	if( files.length ) {
		for( const item of sqliteDir.list() ) {
			if( item instanceof File ) {
				console.log( `${ item.name } — ${ item.size } bytes` );
			} else {
				console.log( `${ item.name }/ (directory)` );
			}
		}
	} else {
		console.log( "Directory is empty" );
	}
}