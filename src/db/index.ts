import * as schema from "@/src/db/schema/";
import { getActiveWorkOrderUuid } from "@/src/utils/storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

// Opens the existing downloaded DB — does NOT create tables
export function getDb( dbName: string ) {
	const sqlite = SQLite.openDatabaseSync(dbName);
	return drizzle(sqlite, { schema });
}

// Get DB for active work order
export async function getActiveDb() {
	const uuid = await getActiveWorkOrderUuid();

	if( !uuid ) {
		throw new Error( "No active work order set" );
	}

	return getDb( `${ uuid }.db` );
}