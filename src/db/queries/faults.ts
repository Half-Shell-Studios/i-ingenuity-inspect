import { faultsTable } from "@/src/db/schema";
import { eq, isNull } from "drizzle-orm";
import { AppDatabase } from "..";
// import { getActiveDb } from "../index";

export async function getOpenFaults( db: AppDatabase | null ) {
	if( !db ) return;

	return db.select().from( faultsTable ).where(
		isNull( faultsTable.closedAt )
	).all();
}

export async function closeFault( db: AppDatabase | null, faultId: string, userId: string, comment: string ) {
	if( !db ) return;

	return db.update( faultsTable ).set({
		closedAt: new Date().toISOString(),
		closedBy: userId,
		closedComment: comment,
	}).where(
		eq( faultsTable.id, faultId )
	).returning();
}