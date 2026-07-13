import { usersTable } from "@/src/db/schema";
import type { User } from '@/src/types';
import { eq } from "drizzle-orm";
import { AppDatabase } from "..";

export async function getUser( db: AppDatabase | null, userId: User[ 'id' ] | undefined ) {
	if( !db ) throw new Error( 'Databse not initialised' );
	if( !userId ) throw new Error( 'A valid User ID is required.' );

	return db.query.usersTable.findFirst({
		where: eq( usersTable.id, userId )
	});
}