import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { assetTemplateRevisionsTable } from "./assetTemplateRevisions";

export const assetTemplatesTable = sqliteTable( 'asset_templates', {
	id: text( 'id' ).primaryKey(),
	revisionActiveId: text( 'revision_active_id' ).notNull(),
});

export const assetTemplatesRelations = relations(
	assetTemplatesTable, ({ one }) => ({
		revisionActive: one(
			assetTemplateRevisionsTable, {
				fields: [ assetTemplatesTable.revisionActiveId ],
				references: [ assetTemplateRevisionsTable.id ],
			}
		),
	})
);