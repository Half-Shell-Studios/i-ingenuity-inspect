import { inspectionsTable, inspectionTypesTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { AppDatabase } from "..";
// import { getActiveDb } from "../index";

export async function getAllInspections( db: AppDatabase | null ) {
	if( !db ) return [];
	
	return db.select().from( inspectionsTable ).all();
}

export async function getAllInspectionTypes( db: AppDatabase | null ) {
	if( !db ) return [];

	return db.select().from( inspectionTypesTable ).all();
}

export async function getInspectionById( db: AppDatabase | null, id: string) {
	if( !db ) return;
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.id, id )
	).get();
}

export async function getInspectionsByAssetTag( db: AppDatabase | null, assetTagId: string) {
	if( !db ) return;
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.assetTagId, assetTagId )
	).all();
}