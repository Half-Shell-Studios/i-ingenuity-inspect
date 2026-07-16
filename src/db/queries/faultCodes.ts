import { faultCodesTable } from "@/src/db/schema";
import { AppDatabase } from "..";

export async function getAllFaultCodes( db: AppDatabase | null ) {
	if( !db ) throw new Error( 'Database not initialised' );
	
	return db.select().from( faultCodesTable ).all();
}