import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inspectionTypesTable = sqliteTable( 'inspection_types', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
	description: text( 'description' ),
});