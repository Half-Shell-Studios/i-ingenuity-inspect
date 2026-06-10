import * as schema from "@/src/db/schema/";
import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export type AppDatabase = ExpoSQLiteDatabase<typeof schema>;

export function openDb(dbName: string): AppDatabase {
	const sqlite = openDatabaseSync(dbName);
	return drizzle(sqlite, { schema });
}