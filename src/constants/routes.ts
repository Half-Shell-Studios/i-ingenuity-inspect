import type { Href } from "expo-router";

export const AUTH_ROUTE: Href = '/(auth)/login';
export const DEFAULT_ROUTE: Href = '/(app)/work-orders';

export function sanitizeLastRoute( lastRoute: string | null ): Href {
	if( !lastRoute ) return DEFAULT_ROUTE;

	const path = lastRoute.startsWith( '/' ) ? lastRoute : `/${ lastRoute }`;

	if( path === '/dashboard' || path === '/settings' || path === '/work-orders' || path.startsWith( '/work-orders/' ) ) {
		return path as Href;
	}

	return DEFAULT_ROUTE;
}