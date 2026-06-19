import { assetTagsTable, faultsTable } from "@/src/db/schema";
import { AssetTag } from "@/src/types";
import { eq, isNotNull, isNull } from "drizzle-orm";
import { AppDatabase } from "..";

export async function getAllAssetTags( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialised' );

	const result = await db.query.assetTagsTable.findMany({
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
				with: {
					inspection: {
						with: {
							inspectionType: true,
							inspectionTemplate: {
								with: {
									revisionActive: true
								}
							}
						}
					},
					faultCode: true
				},
			},
			faultsClosed: {
				where: isNotNull(
					faultsTable.closedAt
				),
			},
			location: true,
		},
	});

	return result.map(( assetTag: AssetTag ) => ({
		...assetTag,
		faultsOpenBySection: groupBySection( assetTag.faultsOpen ?? [] ),
		faultsClosedBySection: groupBySection( assetTag.faultsClosed ?? [] ),
	}));
}

export async function getAssetTagById( db: AppDatabase | null, id: string ) {
	if( !db ) throw new Error( 'Database not initialised' );

	const result = await db.query.assetTagsTable.findFirst({
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
				with: {
					inspection: {
						with: {
							inspectionType: true,
							inspectionTemplate: {
								with: {
									revisionActive: true
								}
							}
						}
					},
					faultCode: true
				},
			},
			faultsClosed: {
				where: isNotNull(
					faultsTable.closedAt
				),
			},
			location: true,
		},
	});

	if( !result ) return;
	
	return {
		...result,
		faultsOpenBySection: groupBySection( result.faultsOpen ?? [] ),
		faultsClosedBySection: groupBySection( result.faultsClosed ?? [] ),
	};
}

function groupBySection<T extends { section: string }>( faults: T[] ): { sectionName: string; faults: T[] }[] {
	const map = faults.reduce<Record<string, T[]>>(( acc, fault ) => {
		( acc[fault.section] ??= [] ).push( fault );
		return acc;
	}, {});

	return Object.entries( map ).map(([ section, faults ]) => ({
		sectionName: section, faults,
	}));
}