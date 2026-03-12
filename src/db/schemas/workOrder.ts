import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const team = sqliteTable( 'team', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
});

export const users = sqliteTable( 'users', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
	email: text( 'email' ).notNull().unique(),
	avatar: text( 'avatar' ),
	developer: integer( 'developer' , { mode: "boolean" }).default(false),
	language: text( 'language' ).default("eng"),
	settings: text( 'settings' , { mode: "json" }),
	roleId: text( 'role_id' ).notNull(),
});

export const inspectionTypes = sqliteTable( 'inspection_types', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
	description: text( 'description' ),
});

export const inspectionTemplates = sqliteTable( 'inspection_templates', {
	id: text( 'id' ).primaryKey(),
	revisionActiveId: text( 'revision_active_id' ),
	revisionLatestId: text( 'revision_latest_id' ),
});

export const inspectionTemplateRevisions = sqliteTable( 'inspection_template_revisions', {
	id: text( 'id' ).primaryKey(),
	inspectionTemplateId: text( 'inspection_template_id' ).notNull(),
	inspectionTypeId: text( 'inspection_type_id' ).notNull(),
	name: text( 'name' ).notNull(),
	description: text( 'description' ).notNull(),
	criteria: text( 'criteria' , { mode: "json" }),
	template: text( 'template' , { mode: "json" }).notNull(),
});

export const assetTemplates = sqliteTable( 'asset_templates', {
	id: text( 'id' ).primaryKey(),
});

export const assetTemplateRevisions = sqliteTable( 'asset_template_revisions', {
	id: text( 'id' ).primaryKey(),
});

export const locations = sqliteTable( 'locations', {
	id: text( 'id' ).primaryKey(),
	customerName: text( 'customer_name' ).notNull(),
	siteName: text( 'site_name' ).notNull(),
	plantName: text( 'plant_name' ).notNull(),
	areaName: text( 'area_name' ).notNull(),
});

export const assetTags = sqliteTable( 'asset_tags', {
	id: text( 'id' ).primaryKey(),
	locationId: text( 'location_id' ).notNull(),
	assetTemplateId: text( 'asset_template_id' ).notNull(),
	name: text( 'name' ).notNull(),
	rfid: text( 'rfid' ),
	description: text( 'description' ),
	height: text( 'height' ).notNull(),
	vintage: integer( 'vintage' ).notNull(),
});

export const inspections = sqliteTable( 'inspections', {
	id: text( 'id' ).primaryKey(),
	assetTagId: text( 'asset_tag_id' ).notNull(),
	inspectionTemplateId: text( 'inspection_template_id' ).notNull(),
	name: text( 'name' ).notNull(),
	answers: text( 'answers' , { mode: "json" }).notNull(),
	notes: text( 'notes' ),
	inspectedBy: text( 'inspected_by' ).notNull(),
});

export const faultCodes = sqliteTable( 'fault_codes', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
	description: text( 'description' ).notNull(),
	colour: text( 'colour' ).notNull(),
	remediateWithin: integer( 'remediate_within' ).notNull(),
	risk: integer( 'risk' ).default(1),
});

export const faults = sqliteTable( 'faults', {
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
});

export const attachments = sqliteTable( 'attachments', {
	id: text( 'id' ).primaryKey(),
	attachableType: text( 'attachable_type' ).notNull(),
	attachableId: text( 'attachable_id' ).notNull(),
	createdAt: text( 'created_at' ).notNull(),
	createdBy: text( 'created_by' ).notNull(),
});