import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getDeviceNameSync } from 'react-native-device-info';
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
	const { login } = useAuth();
	const [ email, setEmail ] = useState( '' );
	const [ password, setPassword ] = useState( '' );
	const [ loading, setLoading ] = useState( false );
	const [ deviceName ] = useState( getDeviceNameSync() )

	const handleLogin = async () => {
		if( !email.trim() || !password ) {
			Alert.alert( 'Error', 'Please fill in all fields.' );
			return;
		}
		
		setLoading( true );
		
		try {
			await login( email.trim(), password, deviceName );
		} catch( error: any ) {
			console.error( error );
			const message = error.response?.data?.message ?? 'Login failed. Please try again.';
			Alert.alert( 'Login Failed', message );
		} finally {
			setTimeout(() => {
				setLoading( false );
			}, 1000)
		}
	};

	return (	
		<KeyboardAvoidingView style={ styles.container } behavior={ Platform.OS === "ios" ? "padding" : "height" }>
			<View style={ styles.formWrapper }>
				<Text style={{ textAlign: "center", fontSize: 36, fontWeight: 800, color: "#8e51ff", marginBottom: 20 }}>I-Ingenuity</Text>
				<View style={ styles.form }>
					<TextInput style={ styles.input } placeholder="Email" placeholderTextColor="#9ca3af" value={ email } onChangeText={ setEmail } autoCapitalize="none" keyboardType="email-address" returnKeyType="next" />
					<TextInput style={ styles.input } placeholder="Password" placeholderTextColor="#9ca3af" value={ password } onChangeText={ setPassword } secureTextEntry returnKeyType="go" onSubmitEditing={ handleLogin } />
					<Link href="/(auth)/forgot-password" style={{ ...styles.link, textAlign: "right", marginBottom: 10 }}>Forgot your password?</Link>
					<TouchableOpacity style={[ styles.button, loading && styles.buttonDisabled ]} onPress={ handleLogin } disabled={ loading }>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={ styles.buttonText }>Log In</Text>
						)}
					</TouchableOpacity>
					
					<Link href="/(auth)/register" style={ styles.link }>
						Don't have an account? Register
					</Link>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		backgroundColor: "#0f172b"
	},
	formWrapper: {
		width: '100%',
		maxWidth: 480,
	},
	form: {},
	input: {
		color: "#ffffff",
		fontSize: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: "#8e51ff",
		borderRadius: 10,
		marginBottom: 16,
	},
	button: {
		alignItems: "center",
		padding: 16,
		backgroundColor: "#8e51ff",
		borderRadius: 10,
		marginBottom: 16,
	},
	buttonDisabled: {
		opacity: 0.7
	},
	buttonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600"
	},
	link: {
		textAlign: "center",
		color: "#f9fafb",
		fontSize: 14
	},
});