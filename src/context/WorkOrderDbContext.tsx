import { dbExists, downloadWorkOrdersDb } from "@/src/api/workOrders";
import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getActiveWorkOrderUuid, removeActiveWorkOrderUuid } from "../utils/storage";

interface WorkOrderDbState {
	isReady: boolean;
	error: string | null;
	db: SQLiteDatabase | null;
	activeWorkOrderId: string | null;
	openWorkOrder: (id: string) => Promise<void>;
	closeWorkOrder: () => Promise<void>;
	refresh: () => Promise<void>;
}

const WorkOrderDbContext = createContext<WorkOrderDbState>({
	isReady: false,
	error: null,
	db: null,
	activeWorkOrderId: null,
	openWorkOrder: async () => {},
	closeWorkOrder: async () => {},
	refresh: async () => {},
});

export function useWorkOrderDb() {
	return useContext( WorkOrderDbContext );
}

export function WorkOrderDbProvider({ children }: { children: ReactNode }) {
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [db, setDb] = useState<SQLiteDatabase | null>(null);
	const [activeWorkOrderId, setActiveWorkOrderId] = useState<string | null>(null);

	const openConnection = useCallback( async( uuid: string ) => {
		// Close any existing connection first
		if( db ) {
			await db.closeAsync();
			setDb( null );
		}

		// The DB file name must match what you saved:
		// e.g. "SQLite/<uuid>.db" — expo-sqlite looks in the
		// SQLite directory by default
		const database = await openDatabaseAsync(`${ uuid }.db`);
		setDb( database );
    }, [ db ]);

	const openWorkOrder = useCallback( async( uuid: string ) => {
		try {
			setError( null );
			setIsReady( false );

			// 1. Download if not already on device
			if( !dbExists( uuid ) ) {
				await downloadWorkOrdersDb( uuid );
			} 
			else {
				await setActiveWorkOrderId( uuid );
			}

			// 2. Open SQLite connection
			await openConnection( uuid );

			// 3. Mark as active
			setActiveWorkOrderId( uuid );

			setIsReady( true );
		} catch( err ) {
			setError( err instanceof Error ? err.message : "Failed to load database", );
		}
    }, [ openConnection ]);

	const closeWorkOrder = useCallback( async() => {
		if( db ) {
			await db.closeAsync();

			setDb( null );
		}
		
		setActiveWorkOrderId( null );
		
		setIsReady( false );
		
		await removeActiveWorkOrderUuid();
	}, [ db ]);
	
	const refresh = useCallback( async() => {
		if( activeWorkOrderId ) {
			await openWorkOrder( activeWorkOrderId );
		}
	}, [ activeWorkOrderId, openWorkOrder ]);
	
	// Restore previous session on mount
	useEffect(() => {
		let cancelled = false;
		
		getActiveWorkOrderUuid().then(( uuid ) => {
			if( cancelled || !uuid ) return;
			openWorkOrder( uuid );
		});
		
		return () => {
			cancelled = true;
		};
		// Only run on mount
		// // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<WorkOrderDbContext.Provider value={{ isReady, error, db, activeWorkOrderId, openWorkOrder, closeWorkOrder, refresh, }}>
			{ children }
		</WorkOrderDbContext.Provider>
	);
}