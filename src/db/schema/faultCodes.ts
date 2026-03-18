import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const faultCodesTable = sqliteTable( 'fault_codes', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
	description: text( 'description' ).notNull(),
	colour: text( 'colour' ).notNull(),
	remediateWithin: integer( 'remediate_within' ).notNull(),
	risk: integer( 'risk' ).default(1),
});