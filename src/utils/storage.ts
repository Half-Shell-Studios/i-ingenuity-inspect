import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = 'auth_token';
const LAST_ROUTE_KEY = 'last_route';
const ACTIVE_WORK_ORDER_KEY = 'active_work_order_uuid';

export const setToken = (token: string) => SecureStore.setItemAsync( TOKEN_KEY, token );

export const getToken = () => SecureStore.getItemAsync( TOKEN_KEY );

export const removeToken = () => SecureStore.deleteItemAsync( TOKEN_KEY );

export const setLastRoute = (route: string) => SecureStore.setItemAsync( LAST_ROUTE_KEY, route );

export const getLastRoute = () => SecureStore.getItemAsync( LAST_ROUTE_KEY );

export const removeLastRoute = () => SecureStore.deleteItemAsync( LAST_ROUTE_KEY );

export const setActiveWorkOrderUuid = (uuid: string) => SecureStore.setItemAsync( ACTIVE_WORK_ORDER_KEY, uuid );

export const getActiveWorkOrderUuid = () => SecureStore.getItemAsync( ACTIVE_WORK_ORDER_KEY );

export const removeActiveWorkOrderUuid = () => SecureStore.deleteItemAsync( ACTIVE_WORK_ORDER_KEY );