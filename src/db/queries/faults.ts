import { eq, isNull } from "drizzle-orm";
import { getDb } from "../index";
import { faultsTable } from "@/src/db/schema";

const db = getDb( 'work_orders.db' );

export function getOpenFaults() {
	return db.select().from( faultsTable ).where(
		isNull( faultsTable.closedAt )
	).all();
}

export function closeFault( id: string, userId: string, comment: string ) {
	return db.update( faultsTable ).set({
		closedAt: new Date().toISOString(),
		closedBy: userId,
		closedComment: comment,
	}).where(
		eq( faultsTable.id, id )
	).run();
}