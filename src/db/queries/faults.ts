import { eq, isNull } from "drizzle-orm";
import { getDb } from "../index";
import { faults } from "../schemas/workOrder";

const db = getDb( 'work_orders.db' );

export function getOpenFaults() {
	return db.select().from( faults ).where(
		isNull( faults.closedAt )
	).all();
}

export function closeFault( id: string, userId: string, comment: string ) {
	return db.update( faults ).set({
		closedAt: new Date().toISOString(),
		closedBy: userId,
		closedComment: comment,
	}).where(
		eq( faults.id, id )
	).run();
}