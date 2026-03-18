import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const locationsTable = sqliteTable( 'locations', {
	id: text( 'id' ).primaryKey(),
	customerName: text( 'customer_name' ).notNull(),
	siteName: text( 'site_name' ).notNull(),
	plantName: text( 'plant_name' ).notNull(),
	areaName: text( 'area_name' ).notNull(),
});