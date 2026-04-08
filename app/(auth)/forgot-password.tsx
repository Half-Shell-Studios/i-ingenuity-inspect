import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function RegisterScreen() {
	const { register } = useAuth();
	const [ name, setName ] = useState( "" );
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const [ confirmPassword, setConfirmPassword ] = useState( "" );
	const [ loading, setLoading ] = useState( false );

	const handleRegister = async () => {
		if( !name.trim() || !email.trim() || !password || !confirmPassword ) {
			Alert.alert( "Error", "Please fill in all fields." );
			return;
		}

		if( password !== confirmPassword ) {
			Alert.alert( "Error", "Passwords do not match." );
			return;
		}

		setLoading( true );

		try {
			await register( name.trim(), email.trim(), password, confirmPassword );
		} catch( error: any ) {
			const errors = error.response?.data?.errors;
			const message = errors ? Object.values( errors ).flat().join( "\n" ) : "Registration failed.";
			Alert.alert( "Registration Failed", message );
		} finally {
			setLoading( false );
		}
	};

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<ScrollView contentContainerStyle={ styles.container } keyboardShouldPersistTaps="handled">
				<Text style={ styles.title }>Create Account</Text>

				<TextInput style={ styles.input } placeholder="Name" placeholderTextColor="#9ca3af" value={ name } onChangeText={ setName } returnKeyType="next" />
				<TextInput style={ styles.input } placeholder="Email" placeholderTextColor="#9ca3af" value={ email } onChangeText={ setEmail } autoCapitalize="none" keyboardType="email-address" returnKeyType="next" />
				<TextInput style={ styles.input } placeholder="Password" placeholderTextColor="#9ca3af" value={ password } onChangeText={ setPassword } secureTextEntry returnKeyType="next" />
				<TextInput style={ styles.input } placeholder="Confirm Password" placeholderTextColor="#9ca3af" value={ confirmPassword } onChangeText={ setConfirmPassword } secureTextEntry returnKeyType="go" onSubmitEditing={ handleRegister } />
				<TouchableOpacity style={[ styles.button, loading && styles.buttonDisabled ]} onPress={ handleRegister } disabled={ loading }>
					{ loading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={ styles.buttonText }>Register</Text>
					)}
				</TouchableOpacity>

				<Link href="/(auth)/login" style={ styles.link }>
					Already have an account? Log In
				</Link>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 24
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 32,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 10,
		padding: 14,
		marginBottom: 16,
		fontSize: 16,
		backgroundColor: "#f9fafb",
	},
	button: {
		backgroundColor: "#4f46e5",
		padding: 16,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 16,
	},
	buttonDisabled: {
		opacity: 0.7
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600"
	},
	link: {
		textAlign: "center",
		color: "#4f46e5",
		fontSize: 14
	},
});