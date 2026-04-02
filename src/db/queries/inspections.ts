import { inspectionsTable, inspectionTypesTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { getActiveDb } from "../index";

export async function getAllInspections() {
	const db = await getActiveDb();
	
	return db.select().from( inspectionsTable ).all();
}

export async function getAllInspectionTypes() {
	const db = await getActiveDb();
	return db.select().from( inspectionTypesTable ).all();
}

export async function getInspectionById(id: string) {
	const db = await getActiveDb();
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.id, id )
	).get();
}

export async function getInspectionsByAssetTag(assetTagId: string) {
	const db = await getActiveDb();
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.assetTagId, assetTagId )
	).all();
}