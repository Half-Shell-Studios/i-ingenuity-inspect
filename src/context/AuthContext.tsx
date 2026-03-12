import type { User } from "@/src/types/User";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";
import { getToken, removeLastRoute, removeToken, setToken } from "../utils/storage";

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: ( email: string, password: string, deviceName: string ) => Promise<void>;
	register: ( name: string, email: string, password: string, passwordConfirmation: string ) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [ user, setUser ] = useState<User | null>( null );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isAuthenticated, setIsAuthenticated ] = useState( false );

	useEffect(() => {
		(async () => {
			try {
				const token = await getToken();
				if( !token ) return;

				const { data } = await client.get( '/user' );
				setUser( data );
				setIsAuthenticated( true );
			} catch {
				await removeToken();
			} finally {
				setIsLoading( false );
			}
		})();
	}, []);

	const login = useCallback(async ( email: string, password: string, deviceName: string ) => {
		const { data } = await client.post( '/login', { email, password, device_name: deviceName } );
		await setToken( data.token );
		setUser( data.user );
		setIsAuthenticated( true );
	}, []);

	const register = useCallback(async ( name: string, email: string, password: string, passwordConfirmation: string, ) => {
		const { data } = await client.post( '/register', { name, email, password, password_confirmation: passwordConfirmation } );
		await setToken( data.token );
		setUser( data.user );
		setIsAuthenticated( true );
	}, []);

	const logout = useCallback(async () => {
		try {
			await client.post( '/logout' );
		} catch {
			// token may already be invalid
		} finally {
			await removeToken();
			await removeLastRoute();
			setUser( null );
			setIsAuthenticated( false );
		}
	}, []);

	const value = useMemo(() => ({
		user, isLoading, isAuthenticated, login, register, logout
	}), [ user, isLoading, isAuthenticated, login, register, logout ]);

	return ( 
		<AuthContext.Provider value={ value }>
			{ children }
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext( AuthContext );
	if( !context ) {
		throw new Error( "useAuth must be used within an AuthProvider" );
	}
	return context;
}