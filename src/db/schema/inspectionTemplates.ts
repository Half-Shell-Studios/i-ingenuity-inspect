import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inspectionTemplatesTable = sqliteTable( 'inspection_templates', {
	id: text( 'id' ).primaryKey(),
	revisionActiveId: text( 'revision_active_id' ),
	revisionLatestId: text( 'revision_latest_id' ),
});