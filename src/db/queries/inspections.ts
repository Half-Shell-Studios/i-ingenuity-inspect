import { inspectionsTable, inspectionTemplateRevisionsTable, inspectionTemplatesTable, inspectionTypesTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { AppDatabase } from "..";
import { Inspection } from "@/src/types";

export async function getAllInspections( db: AppDatabase | null ) {
	if( !db ) return [];
	
	return db.select().from( inspectionsTable ).all();
}

export async function getInspectionById( db: AppDatabase | null, id: string ) {
	if( !db ) return;
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.id, id )
	).get();
}

export async function getInspectionsByAssetTag( db: AppDatabase | null, assetTagId: string ) {
	if( !db ) return;
	
	return db.select().from( inspectionsTable ).where(
		eq( inspectionsTable.assetTagId, assetTagId )
	).all();
}

export async function createNewInspection( db: AppDatabase | null, data: Omit<Inspection, "id"> ) {
	if( !db ) return;

	return await db.insert( inspectionsTable ).values( data ).returning({ insertedId: inspectionsTable.id });
}

export async function getAllInspectionTypes( db: AppDatabase | null ) {
	if( !db ) return [];

	return db.select().from( inspectionTypesTable ).all();
}

export async function getInspectionTemplateById( db: AppDatabase | null, inspectionTemplateId: string ) {
	if( !db ) return;

	return db.query.inspectionTemplatesTable.findFirst({
		where: eq( inspectionTemplatesTable.id, inspectionTemplateId ),
		with: {
			revisionActive: true
		}
	});
}

export async function getInspectionTemplateByRevisionId( db: AppDatabase | null, inspectionTemplateRevisionId: string ) {
	if( !db ) return;

	return db.query.inspectionTemplatesTable.findFirst({
		where: eq( inspectionTemplatesTable.revisionActiveId, inspectionTemplateRevisionId ),
		with: {
			revisionActive: true
		}
	});
}

export async function getInspectionTemplatesByInspectionType( db: AppDatabase | null, inspectionTypeId: string ) {
	if( !db ) return [];

	return db.select().from( inspectionTemplateRevisionsTable ).where(
		eq( inspectionTemplateRevisionsTable.inspectionTypeId, inspectionTypeId )
	).all();
}