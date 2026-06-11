import { faultsTable } from "@/src/db/schema";
import { eq, isNotNull, isNull, SQL } from "drizzle-orm";
import { AppDatabase } from "..";

const faultsWith = {
	assetTag: {
		with: {
			assetTemplate: {
				with: {
					revisionActive: true
				},
			},
			location: true,
		},
	},
} as const;

function queryFaults( db: AppDatabase, where?: SQL ) {
	return db.query.faultsTable.findMany({ with: faultsWith, where });
}

export async function getFaults( db: AppDatabase | null ) {
	if( !db ) return [];

	return queryFaults(db);
}

export async function getOpenFaults( db: AppDatabase | null ) {
	if( !db ) return [];

	return queryFaults(db, isNull( faultsTable.closedAt ) );
}

export async function getClosedFaults( db: AppDatabase | null ) {
	if( !db ) return [];

	return queryFaults(db, isNotNull( faultsTable.closedAt ) );
}

export async function closeFault( db: AppDatabase | null, faultId: string, userId: string, comment: string ) {
	if( !db ) return;

	return db.update( faultsTable ).set({
		closedAt: new Date().toISOString(),
		closedBy: userId,
		closedComment: comment,
	}).where(
		eq( faultsTable.id, faultId )
	).returning();
}