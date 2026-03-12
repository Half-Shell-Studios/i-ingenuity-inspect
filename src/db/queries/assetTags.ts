// src/db/queries/assetTags.ts
import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { assetTags } from "../schemas/workOrder";

const db = getDb("work_orders.db");

export function getAllAssetTags() {
	return db.select().from( assetTags ).all();
}

export function getAssetTagById( id: string ) {
	return db.select().from( assetTags ).where(
		eq( assetTags.id, id )
	).get();
}