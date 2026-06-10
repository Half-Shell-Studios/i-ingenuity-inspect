import { faultsTable } from "@/src/db/schema";
import { eq, isNotNull, isNull } from "drizzle-orm";
import { AppDatabase } from "..";

export async function getFaults( db: AppDatabase | null ) {
	if( !db ) return [];

	return await db.query.faultsTable.findMany({
		with: {
			assetTag: {
				with: {
					assetTemplate: {
						with: {
							revisionActive: true
						}
					}
				}
			}
		}
	});
}

export async function getOpenFaults( db: AppDatabase | null ) {
	if( !db ) return [];

	return await db.query.faultsTable.findMany({
		with: {
			assetTag: {
				with: {
					assetTemplate: {
						with: {
							revisionActive: true
						}
					}
				}
			}
		},
		where: isNull( faultsTable.closedAt )
	});
}

export async function getClosedFaults( db: AppDatabase | null ) {
	if( !db ) return [];

	return await db.query.faultsTable.findMany({
		with: {
			assetTag: {
				with: {
					assetTemplate: {
						with: {
							revisionActive: true
						}
					}
				}
			}
		},
		where: isNotNull( faultsTable.closedAt )
	});
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