import { dbExists, downloadWorkOrdersDb } from "@/src/api/workOrders";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getActiveWorkOrderUuid, setActiveWorkOrderUuid } from "../utils/storage";

interface WorkOrderDbState {
	isReady: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	setWorkOrderId: (id: string) => Promise<void>;
}

const WorkOrderDbContext = createContext<WorkOrderDbState>({
	isReady: false,
	error: null,
	refresh: async () => {},
	setWorkOrderId: async () => {},
});

export function useWorkOrderDb() {
	return useContext( WorkOrderDbContext );
}

export function WorkOrderDbProvider({ children }: { children: ReactNode }) {
	const [ isReady, setIsReady ] = useState( false );
	const [ error, setError ] = useState<string | null>( null );
	const [ itemId, setItemId ] = useState<string>( '' );

	async function loadDb() {
		try {
			setError( null );
			setIsReady( false );

			if( !dbExists( itemId ) ) {
				await downloadWorkOrdersDb( itemId );
			} else {
				// DB exists, make sure it's set as active
				await setActiveWorkOrderUuid( itemId );
			}

			setIsReady( true );
		} catch( err ) {
			setError(
				err instanceof Error ? err.message : "Failed to load database"
			);
		}
	}

	useEffect(() => {
		getActiveWorkOrderUuid().then(( uuid ) => {
			const id = uuid === null ? '' : uuid;
			
			setItemId( id );
		});
	}, []);

	useEffect(() => {
		loadDb();
		console.log( itemId );
	}, [ itemId ]);

	async function setWorkOrderId( id: string ) {
		await setActiveWorkOrderUuid( id );
		setItemId( id );
	}

	return (
		<WorkOrderDbContext.Provider value={{ isReady, error, refresh: loadDb, setWorkOrderId }}>
			{ children }
		</WorkOrderDbContext.Provider>
	);
}