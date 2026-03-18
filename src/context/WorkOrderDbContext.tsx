import { dbExists, downloadWorkOrdersDb } from "@/src/api/workOrders";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface WorkOrderDbState {
	isReady: boolean;
	error: string | null;
	refresh: () => Promise<void>;
}

const WorkOrderDbContext = createContext<WorkOrderDbState>({
	isReady: false,
	error: null,
	refresh: async () => {},
});

export function useWorkOrderDb() {
	return useContext( WorkOrderDbContext );
}

export function WorkOrderDbProvider({ itemId, children }: { itemId: string; children: ReactNode }) {
	const [ isReady, setIsReady ] = useState( false );
	const [ error, setError ] = useState<string | null>( null );

	async function loadDb() {
		try {
			setError( null );
			await downloadWorkOrdersDb( itemId );
			setIsReady( true );
		} catch( err ) {
			// Fall back to local copy if available
			if( dbExists() ) {
				setIsReady( true );
			} else {
				setError( err instanceof Error ? err.message : "Failed to load database" );

			}
		}
	}

	useEffect(() => {
		loadDb();
	}, [ itemId ]);

	return (
		<WorkOrderDbContext.Provider value={{ isReady, error, refresh: loadDb }}>
			{ children }
		</WorkOrderDbContext.Provider>
	);
}