import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable( 'users', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
	email: text( 'email' ).notNull().unique(),
	avatar: text( 'avatar' ),
	developer: integer( 'developer' , { mode: "boolean" }).default(false),
	language: text( 'language' ).default("eng"),
	settings: text( 'settings', { mode: "json" }),
	roleId: text( 'role_id' ).notNull(),
});