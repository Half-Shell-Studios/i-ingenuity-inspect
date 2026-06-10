import axios from "axios";
import { getToken, removeToken } from "../utils/storage";

const client = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

client.interceptors.request.use(async( config ) => {
	const token = await getToken();
	if( token ) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

client.interceptors.response.use( response => {
	return response;
}, async( error ) => {
	if( error.response?.status === 401 ) {
		await removeToken();
	}
		return Promise.reject( error );
	},
);

export default client;