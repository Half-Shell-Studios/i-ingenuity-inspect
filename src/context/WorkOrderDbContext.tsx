import { deleteAllLocalDbs, downloadWorkOrdersDb } from "@/src/api/workOrders";
import { openDb, type AppDatabase } from "@/src/db";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getActiveWorkOrderUuid, removeActiveWorkOrderUuid, setActiveWorkOrderUuid } from "../utils/storage";
import { useAuth } from "./AuthContext";

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
	const { isAuthenticated, isLoading } = useAuth();
	const [ isReady, setIsReady ] = useState( false );
	const [ error, setError ] = useState<string | null>( null );
	const [ db, setDb ] = useState<AppDatabase | null>( null );
	const [ activeWorkOrderId, setActiveWorkOrderId ] = useState<string | null>( null );

	// Track the underlying sqlite connection for cleanup
	const sqliteRef = useRef<ReturnType<typeof import("expo-sqlite").openDatabaseSync> | null>( null );
	const activeIdRef = useRef<string | null>( null );
	
	const closeExisting = useCallback(async () => {
		if( sqliteRef.current ) {
			sqliteRef.current.closeSync();
			sqliteRef.current = null;
		}
		activeIdRef.current = null;
		
		setDb( null );
	}, []);

	const openWorkOrder = useCallback( async( uuid: string ) => {
		if( sqliteRef.current && activeIdRef.current === uuid ) {
			setIsReady( true );
			return;
		}

		try {
			setError( null );
			setIsReady( false );

			await closeExisting();
			await downloadWorkOrdersDb( uuid );

			const opened = openDb( `${uuid}.sqlite` );
			sqliteRef.current = opened.sqlite;
			activeIdRef.current = uuid;
			setDb( opened.db );

			await setActiveWorkOrderUuid( uuid );
			setActiveWorkOrderId( uuid );

			setIsReady( true );
		} catch( err ) {
			activeIdRef.current = null;
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

	useEffect(() => {
		if( isLoading ) return;

		if( !isAuthenticated ) {
			void ( async () => {
				await closeExisting();
				setActiveWorkOrderId( null );
				setIsReady( false );
				setError( null );

				try {
					await deleteAllLocalDbs();
				} catch ( cleanupError ) {
					console.warn( "Failed to delete local work order database on logout", cleanupError );
				}
			})();
			return;
		}

		let cancelled = false;

		getActiveWorkOrderUuid().then( uuid => {
			if( cancelled || !uuid ) return;
			openWorkOrder( uuid );
		});

		return () => {
			cancelled = true;
		};
	}, [ isAuthenticated, isLoading, openWorkOrder ]);
	
	return (
		<WorkOrderDbContext.Provider value={{ isReady, error, db, activeWorkOrderId, openWorkOrder, closeWorkOrder, refresh, }}>
			{ children }
		</WorkOrderDbContext.Provider>
	);
}