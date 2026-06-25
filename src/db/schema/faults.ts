import { assetTagsTable } from "@/src/db/schema/assetTags";
import { faultCodesTable } from "@/src/db/schema/faultCodes";
import { inspectionsTable } from "@/src/db/schema/inspections";
import { locationsTable } from "@/src/db/schema/locations";
import { usersTable } from "@/src/db/schema/users";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const faultsTable = sqliteTable( 'faults', {
	id: text( 'id' ).primaryKey(),
	locationId: text( 'location_id' ).notNull(),
	assetTagId: text( 'asset_tag_id' ).notNull(),
	inspectionId: text( 'inspection_id' ).notNull(),
	faultCodeId: text( 'fault_code_id' ).notNull(),
	section: text( 'section' ).notNull(),
	question: text( 'question' ).notNull(),
	raisedAt: text( 'raised_at' ).notNull(),
	raisedComment: text( 'raised_comment' ).notNull(),
	closedAt: text( 'closed_at' ),
	closedBy: text( 'closed_by' ),
	closedComment: text( 'closed_comment' ),
	syncStatus: text( 'sync_status', { enum: [ 'synced', 'pending'] }).notNull().default( 'pending' ),
});

export const faultsRelations = relations(
	faultsTable, ({ one }) => ({
		location: one(
			locationsTable, {
				fields: [ faultsTable.locationId ],
				references: [ locationsTable.id ],
			}
		),
		assetTag: one(
			assetTagsTable, {
				fields: [ faultsTable.assetTagId ],
				references: [ assetTagsTable.id ],
			}
		),
		inspection: one(
			inspectionsTable, {
				fields: [ faultsTable.inspectionId ],
				references: [ inspectionsTable.id ],
			}
		),
		faultCode: one(
			faultCodesTable, {
				fields: [ faultsTable.faultCodeId ],
				references: [ faultCodesTable.id ],
			}
		),
		closedByUser: one(
			usersTable, {
				fields: [ faultsTable.closedBy ],
				references: [ usersTable.id ],
			}
		),
	})
);