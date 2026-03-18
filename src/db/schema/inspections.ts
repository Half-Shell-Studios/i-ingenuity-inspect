import { assetTagsTable } from "@/src/db/schema/assetTags";
import { inspectionTemplatesTable } from "@/src/db/schema/inspectionTemplates";
import { usersTable } from "@/src/db/schema/users";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inspectionsTable = sqliteTable( 'inspections', {
	id: text( 'id' ).primaryKey(),
	assetTagId: text( 'asset_tag_id' ).notNull(),
	inspectionTemplateId: text( 'inspection_template_id' ).notNull(),
	name: text( 'name' ).notNull(),
	answers: text( 'answers' , { mode: "json" }).notNull(),
	notes: text( 'notes' ),
	inspectedBy: text( 'inspected_by' ).notNull(),
});

export const inspectionsRelations = relations(
	inspectionsTable, ({ one }) => ({
		assetTag: one(assetTagsTable, {
			fields: [ inspectionsTable.assetTagId ],
			references: [ assetTagsTable.id ],
		}),
		inspectionTemplate: one(
			inspectionTemplatesTable, {
				fields: [ inspectionsTable.inspectionTemplateId ],
				references: [ inspectionTemplatesTable.id],
			}
		),
		inspectedByUser: one(
			usersTable, {
				fields: [ inspectionsTable.inspectedBy ],
				references: [ usersTable.id ],
			}
		),
	})
);