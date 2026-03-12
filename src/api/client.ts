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

	// console.log(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
	// console.log("Headers:", config.headers);
	// console.log("Data:", config.data);

	return config;
});

client.interceptors.response.use( response => {
	// console.log("Headers:", response?.headers);
	// console.log("Data:", response?.data);

	return response;
}, async( error ) => {
	// console.log("Request failed:", error.message);
    // console.log("Code:", error.code);
    // console.log("Response:", error.response?.status, error.response?.data);
	// console.log( "Error:", error );
	if( error.response?.status === 401 ) {
		await removeToken();
	}
	return Promise.reject( error );
  },
);

export default client;