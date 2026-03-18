import { sqliteTable, text } from "drizzle-orm/sqlite-core";

const attachmentsTable = sqliteTable( 'attachments', {
	id: text( 'id' ).primaryKey(),
	attachableType: text( 'attachable_type' ).notNull(),
	attachableId: text( 'attachable_id' ).notNull(),
	createdAt: text( 'created_at' ).notNull(),
	createdBy: text( 'created_by' ).notNull(),
});

export default attachmentsTable;