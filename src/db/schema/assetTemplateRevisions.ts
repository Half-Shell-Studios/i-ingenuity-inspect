import { assetTagsTable } from "@/src/db/schema/assetTags";
import { assetTemplatesTable } from "@/src/db/schema/assetTemplates";
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const assetTemplateRevisionsTable = sqliteTable( 'asset_template_revisions', {
	id: text("id").primaryKey(),
	assetTemplateId: text("asset_template_id").notNull(),
	classification: text("classification", { length: 255 }).notNull(),
	manufacturer: text("manufacturer", { length: 255 }).notNull(),
	model: text("model", { length: 255 }).notNull(),
	type: text("type", { length: 255 }).notNull(),
	description: text("description", { length: 255 }),
	ipRating: text("ip_rating", { length: 512 }),
	protection: text("protection", { length: 512 }),
	serviceLife: integer("service_life").notNull(),
	certificateNumbers: text("certificate_numbers"), // JSON as text in SQLite
	customFields: text("custom_fields"), // JSON as text in SQLite
	metadata: text("metadata"), // JSON as text in SQLite
	version: text("version", { length: 9 }).default("0.01"),
	state: text("state", { length: 9 }).notNull(),
	stateComments: text("state_comments"), // JSON as text
	draftedBy: text("drafted_by"),
	completedAt: integer("completed_at"), // Unix timestamp
	completedBy: text("completed_by"),
	checkedAt: integer("checked_at"),
	checkedBy: text("checked_by"),
	approvedAt: integer("approved_at"),
	approvedBy: text("approved_by"),
	declinedAt: integer("declined_at"),
	declinedBy: text("declined_by"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	deletedAt: integer("deleted_at"),
});

export const assetTemplateRevisionsRelations = relations(
	assetTemplateRevisionsTable, ({ one, many }) => ({
		assetTags: many( assetTagsTable ),
		assetTemplate: one(
			assetTemplatesTable, {
				fields: [ assetTemplateRevisionsTable.assetTemplateId ],
				references: [ assetTemplatesTable.id ],
			}
		),
	}),
);