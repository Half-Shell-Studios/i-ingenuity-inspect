import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? <Redirect href="/(app)/dashboard" /> : <Redirect href="/(auth)/login" />;
}