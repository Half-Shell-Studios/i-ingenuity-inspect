import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from './schemas/workOrder';

// Opens the existing downloaded DB — does NOT create tables
export function getDb( dbName: string ) {
	const sqlite = SQLite.openDatabaseSync( dbName );
	return drizzle(sqlite, { schema });
}