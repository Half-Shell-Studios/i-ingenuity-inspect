import { sqliteTable, text } from "drizzle-orm/sqlite-core";

const teamTable = sqliteTable( 'team', {
	id: text( 'id' ).primaryKey(),
	name: text( 'name' ).notNull(),
});

export default teamTable;