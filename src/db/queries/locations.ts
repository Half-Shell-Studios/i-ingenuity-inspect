import { locationsTable } from "@/src/db/schema";
import { sql } from "drizzle-orm";
import { AppDatabase } from "..";

export async function getAllLocations( db: AppDatabase | null ) {	
	if( !db ) throw new Error( 'Database not initialized' );
	
	return db.select().from( locationsTable ).all();
}

export async function getAllCustomers( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialized' );
	
	return db.select({ id: sql<string>`min(${locationsTable.id})`, customerName: locationsTable.customerName }).from( locationsTable ).groupBy( locationsTable.customerName ).orderBy( locationsTable.customerName ).all();
}

export async function getAllSites( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialized' );
	
	return db.select({ id: sql<string>`min(${locationsTable.id})`, siteName: locationsTable.siteName }).from( locationsTable ).groupBy( locationsTable.siteName ).orderBy( locationsTable.siteName ).all();
}

export async function getAllPlants( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialized' );
	
	return db.select({ id: sql<string>`min(${locationsTable.id})`, plantName: locationsTable.plantName }).from( locationsTable ).groupBy( locationsTable.plantName ).orderBy( locationsTable.plantName ).all();
}

export async function getAllAreas( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialized' );
	
	return db.select({ id: sql<string>`min(${locationsTable.id})`, areaName: locationsTable.areaName }).from( locationsTable ).groupBy( locationsTable.areaName ).orderBy( locationsTable.areaName ).all();
}