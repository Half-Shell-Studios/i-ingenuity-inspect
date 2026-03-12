import type { WorkOrder } from "@/src/types/WorkOrder";
import * as SQLite from "expo-sqlite";

const DB_NAME = "work_orders.db";

export async function getAllWorkOrders(): Promise<WorkOrder[]> {
	const db = await SQLite.openDatabaseAsync(DB_NAME);
	const rows = await db.getAllAsync<WorkOrder>(
		"SELECT * FROM work_orders ORDER BY created_at DESC",
	);
	return rows;
}

export async function getWorkOrderById( id: number ): Promise<WorkOrder | null> {
	const db = await SQLite.openDatabaseAsync(DB_NAME);
	const row = await db.getFirstAsync<WorkOrder>(
		"SELECT * FROM work_orders WHERE id = ?",
		[id],
	);
	return row ?? null;
}

export async function searchWorkOrders( query: string ): Promise<WorkOrder[]> {
	const db = await SQLite.openDatabaseAsync(DB_NAME);
	const rows = await db.getAllAsync<WorkOrder>(
		"SELECT * FROM work_orders WHERE title LIKE ? OR description LIKE ?",
		[`%${query}%`, `%${query}%`],
	);
return rows;
}