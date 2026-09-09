import * as schema from "@/src/db/schema/";
import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { defaultDatabaseDirectory, openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

export type AppDatabase = ExpoSQLiteDatabase<typeof schema>;

export type OpenedDatabase = {
	db: AppDatabase;
	sqlite: SQLiteDatabase;
};

export const sqliteDirectory = defaultDatabaseDirectory;

export function openDb( dbName: string ): OpenedDatabase {
	const sqlite = openDatabaseSync( dbName, undefined, sqliteDirectory );
	return {
		sqlite,
		db: drizzle( sqlite, { schema } ),
	};
}
