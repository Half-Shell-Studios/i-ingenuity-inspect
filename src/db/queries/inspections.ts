import { inspectionsTable, inspectionTypesTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../index";

const db = getDb( 'work_orders.db' );

export function getAllInspections() {
	return db.select().from( inspectionsTable ).all();
}

export function getAllInspectionTypes() {
	return db.select().from( inspectionTypesTable ).all();
}

export function getInspectionById(id: string) {
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.id, id )
	).get();
}

export function getInspectionsByAssetTag(assetTagId: string) {
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.assetTagId, assetTagId )
	).all();
}