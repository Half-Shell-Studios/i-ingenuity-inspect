import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import inspectionTemplateRevisionsTable from "./inspectionTemplateRevisions";

export const inspectionTemplatesTable = sqliteTable( 'inspection_templates', {
	id: text( 'id' ).primaryKey().notNull(),
	revisionActiveId: text( 'revision_active_id' ).notNull(),
	revisionLatestId: text( 'revision_latest_id' ).notNull(),
});

export const inspectionTemplatesRelations = relations(
	inspectionTemplatesTable, ({ one }) => ({
		revisionActive: one(
			inspectionTemplateRevisionsTable, {
				fields: [ inspectionTemplatesTable.revisionActiveId ],
				references: [ inspectionTemplateRevisionsTable.id ],
			}
		),
	})
);