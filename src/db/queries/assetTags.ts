import { assetTagsTable, faultsTable } from "@/src/db/schema";
import { eq, isNotNull, isNull } from "drizzle-orm";
import { getDb } from "../index";

const db = getDb( 'work_orders.db' );

export function getAllAssetTags() {
	return db.query.assetTagsTable.findMany({
		with: {
			assetTemplate: {
				with: {
					revisionActive: true,
				}
			},
			faultsOpen: {
				where: isNull(
					faultsTable.closedAt
				),
			},
			faultsClosed: {
				where: isNotNull(
					faultsTable.closedAt
				),
			},
			location: true,
		},
	});
}

export function getAssetTagById( id: string ) {
	return db.select().from( assetTagsTable ).where(
		eq( assetTagsTable.id, id )
	).get();
}