import { assetTagsTable, faultsTable } from "@/src/db/schema";
import { eq, isNotNull, isNull } from "drizzle-orm";
import { AppDatabase } from "..";

export async function getAllAssetTags( db: AppDatabase | null ) {
	if( !db ) return [];

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

export async function getAssetTagById( db: AppDatabase | null, id: string ) {
	if( !db ) return;

	return db.query.assetTagsTable.findFirst({
		where: eq( assetTagsTable.id, id ),
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