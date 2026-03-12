import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const LAST_ROUTE_KEY = "last_route";

export const setToken = (token: string) => SecureStore.setItemAsync( TOKEN_KEY, token );

export const getToken = () => SecureStore.getItemAsync( TOKEN_KEY );

export const removeToken = () => SecureStore.deleteItemAsync( TOKEN_KEY );

export const setLastRoute = (route: string) => SecureStore.setItemAsync( LAST_ROUTE_KEY, route );

export const getLastRoute = () => SecureStore.getItemAsync( LAST_ROUTE_KEY );

export const removeLastRoute = () => SecureStore.deleteItemAsync( LAST_ROUTE_KEY );