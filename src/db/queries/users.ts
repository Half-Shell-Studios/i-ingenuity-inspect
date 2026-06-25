import { usersTable } from "@/src/db/schema";
import type { User } from '@/src/types';
import { eq } from "drizzle-orm";
import { AppDatabase } from "..";

export async function getUser( db: AppDatabase | null, userId: User[ 'id' ] ) {
	if( !db ) throw new Error( 'Databse not initialised' );

	return db.query.usersTable.findFirst({
		where: eq( usersTable.id, userId )
	});
}