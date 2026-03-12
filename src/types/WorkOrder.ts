// src/types/workOrder.ts
export interface WorkOrder {
	id: string;
	name: string;
	description: string;
	database_path: string;
	// status: "open" | "in_progress" | "completed" | "cancelled";
	// priority: "low" | "medium" | "high" | "critical";
	// assignedTo?: string;
	// createdAt: string;
	// updatedAt: string;
}

export interface CreateWorkOrderPayload {
	title: string;
	description: string;
	assignedTo?: string;
}

export interface UpdateWorkOrderPayload
	extends Partial<CreateWorkOrderPayload> {
}