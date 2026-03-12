import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { inspections } from "../schemas/workOrder";

const db = getDb( 'work_orders.db' );

export function getAllInspections() {
	return db.select().from(inspections).all();
}

export function getInspectionById(id: string) {
	return db.select().from( inspections ).where(
		eq( inspections.id, id )
	).get();
}

export function getInspectionsByAssetTag(assetTagId: string) {
	return db.select().from( inspections ).where(
		eq( inspections.assetTagId, assetTagId )
	).all();
}