import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inspectionTemplateRevisionsTable = sqliteTable( 'inspection_template_revisions', {
	id: text( 'id' ).primaryKey(),
	inspectionTemplateId: text( 'inspection_template_id' ).notNull(),
	inspectionTypeId: text( 'inspection_type_id' ).notNull(),
	name: text( 'name' ).notNull(),
	description: text( 'description' ).notNull(),
	// criteria: text( 'criteria' , { mode: "json" }),
	criteria: text( 'criteria' ),
	// template: text( 'template', { mode: "json" }).notNull(),
	template: text( 'template' ).notNull(),
});

export default inspectionTemplateRevisionsTable;