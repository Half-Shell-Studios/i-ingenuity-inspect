import { assetTemplatesTable } from "@/src/db/schema/assetTemplates";
import { faultsTable } from "@/src/db/schema/faults";
import { locationsTable } from "@/src/db/schema/locations";
import { relations as defineRelations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const assetTagsTable = sqliteTable( 'asset_tags', {
	id: text( 'id' ).primaryKey(),
	locationId: text( 'location_id' ).notNull(),
	assetTemplateId: text( 'asset_template_id' ).notNull(),
	assetTemplateRevisionId: text( 'asset_template_revision_id' ).notNull(),
	name: text( 'name' ).notNull(),
	rfid: text( 'rfid' ),
	description: text( 'description' ),
	height: text( 'height' ).notNull(),
	vintage: integer( 'vintage' ).notNull(),
});

export const assetTagsRelations = defineRelations(
	assetTagsTable, ({ one, many }) => ({
		assetTemplate: one(
			assetTemplatesTable, {
				fields: [ assetTagsTable.assetTemplateId ],
				references: [ assetTemplatesTable.id ],
			}
		),
		location: one(
			locationsTable, {
				fields: [ assetTagsTable.locationId ],
				references: [ locationsTable.id ],
			}
		),
		faults: many(faultsTable, {
			relationName: "assetTagAllFaults"
		}),
		faultsOpen: many(faultsTable, {
			relationName: "assetTagOpenFaults"
		}),
		faultsClosed: many(faultsTable, {
			relationName: "assetTagClosedFaults"
		}),
	})
);