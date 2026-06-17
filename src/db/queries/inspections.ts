import { inspectionsTable, inspectionTemplateRevisionsTable, inspectionTemplatesTable, inspectionTypesTable } from "@/src/db/schema";
import { Inspection } from "@/src/types";
import { eq } from "drizzle-orm";
import { AppDatabase } from "..";

export async function getAllInspections( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialised' );
	
	return db.select().from( inspectionsTable ).all();
}

export async function getInspectionById( db: AppDatabase | null, id: string ) {
	if( !db ) throw new Error( 'Database not initialised' );
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.id, id )
	).get();
}

export async function getInspectionsByAssetTag( db: AppDatabase | null, assetTagId: string ) {
	if( !db ) throw new Error( 'Database not initialised' );
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.assetTagId, assetTagId )
	).all();
}

export async function createNewInspection( db: AppDatabase | null, data: Omit<Inspection, "id"> ) {
	if( !db ) throw new Error( 'Database not initialised' );

	return await db.insert( inspectionsTable ).values( data ).returning({ insertedId: inspectionsTable.id });
}

export async function getAllInspectionTypes( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialised' );

	return db.select().from( inspectionTypesTable ).all();
}

export async function getInspectionTemplateById( db: AppDatabase | null, inspectionTemplateId: string ) {
	if( !db ) throw new Error( 'Database not initialised' );

	return db.query.inspectionTemplatesTable.findFirst({
		where: eq( inspectionTemplatesTable.id, inspectionTemplateId ),
		with: {
			revisionActive: true
		}
	});
}

export async function getInspectionTemplateByRevisionId( db: AppDatabase | null, inspectionTemplateRevisionId: string ) {
	if( !db ) throw new Error( 'Database not initialised' );

	return db.query.inspectionTemplatesTable.findFirst({
		where: eq( inspectionTemplatesTable.revisionActiveId, inspectionTemplateRevisionId ),
		with: {
			revisionActive: true
		}
	});
}

export async function getInspectionTemplatesByInspectionType( db: AppDatabase | null, inspectionTypeId: string ) {
	if( !db ) throw new Error( 'Database not initialised' );

	return db.select().from( inspectionTemplateRevisionsTable ).where(
		eq( inspectionTemplateRevisionsTable.inspectionTypeId, inspectionTypeId )
	).all();
}