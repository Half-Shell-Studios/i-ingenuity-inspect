import { dbExists, downloadWorkOrdersDb } from "@/src/api/workOrders";
import { openDb, type AppDatabase } from "@/src/db";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getActiveWorkOrderUuid, removeActiveWorkOrderUuid, setActiveWorkOrderUuid } from "../utils/storage";

interface WorkOrderDbState {
	isReady: boolean;
	error: string | null;
	db: AppDatabase | null;
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
	return useContext(WorkOrderDbContext);
}

export function WorkOrderDbProvider({ children }: { children: ReactNode }) {
	const [ isReady, setIsReady ] = useState( false );
	const [ error, setError ] = useState<string | null>( null );
	const [ db, setDb ] = useState<AppDatabase | null>( null );
	const [ activeWorkOrderId, setActiveWorkOrderId ] = useState<string | null>( null );

	// Track the underlying sqlite connection for cleanup
	const sqliteRef = useRef<ReturnType<typeof import("expo-sqlite").openDatabaseSync> | null>( null );
	
	const closeExisting = useCallback(async () => {
		if( sqliteRef.current ) {
			sqliteRef.current.closeSync();
			sqliteRef.current = null;
		}
		
		setDb( null );
	}, []);

	const openWorkOrder = useCallback( async( uuid: string ) => {
		try {
			setError( null );
			setIsReady( false );

			// 1. Download if not already on device
			if( !dbExists( uuid ) ) {
				await downloadWorkOrdersDb( uuid );
			}

			// 2. Close any previous connection
			await closeExisting();

			// 3. Open and wrap with Drizzle
			const drizzleDb = openDb( `${uuid}.sqlite` );
			setDb( drizzleDb );

			// 4. Persist active work order
			await setActiveWorkOrderUuid( uuid );
			setActiveWorkOrderId( uuid );

			setIsReady( true );
		} catch( err ) {
			setError( err instanceof Error ? err.message : "Failed to load database", );
		}
	}, [ closeExisting ]);

	const closeWorkOrder = useCallback(async () => {
		await closeExisting();
		setActiveWorkOrderId( null );
		setIsReady( false );
		await removeActiveWorkOrderUuid();
	}, [ closeExisting ]);

	const refresh = useCallback(async () => {
		if( activeWorkOrderId ) {
			await openWorkOrder( activeWorkOrderId );
		}
	}, [ activeWorkOrderId, openWorkOrder ]);

	// Restore previous session on mount
	useEffect(() => {
		let cancelled = false;

		getActiveWorkOrderUuid().then( uuid => {
			if( cancelled || !uuid ) return;
			openWorkOrder( uuid );
		});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	return (
		<WorkOrderDbContext.Provider value={{ isReady, error, db, activeWorkOrderId, openWorkOrder, closeWorkOrder, refresh, }}>
			{ children }
		</WorkOrderDbContext.Provider>
	);
}