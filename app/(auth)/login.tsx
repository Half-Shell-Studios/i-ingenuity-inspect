import AlternativeLockup from "@/assets/images/logos/alternative-lockup.svg";
import DefaultLockup from "@/assets/images/logos/default-lockup.svg";
import { ACCENT_COLOUR, BRAND_COLOUR_NAVY, BRAND_COLOUR_OFFWHITE, BRAND_COLOUR_WHITE, darkModeActive } from '@/src/constants/colours';
import * as Device from 'expo-device';
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
	const { login } = useAuth();
	const [ email, setEmail ] = useState<string>( '' );
	const [ password, setPassword ] = useState<string>( '' );
	const [ loading, setLoading ] = useState<boolean>( false );
	const [ deviceName ] = useState( Device.deviceName ?? '' );

	useEffect(() => {
		setEmail( process?.env?.EXPO_PUBLIC_DEV_USER ?? '' );
		setPassword( process?.env?.EXPO_PUBLIC_DEV_USER_PASS ?? '' );
	}, [])

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
				<View style={{ alignItems: "center", marginBottom: 30 }}>
					{ darkModeActive ? (
						<AlternativeLockup width={ 400 } height={ 50 } />
					) : (
						<DefaultLockup width={ 400 } height={ 50 } />
					)}
				</View>
				<View style={ styles.form }>
					<TextInput style={ styles.input } placeholder="Email" placeholderTextColor={ BRAND_COLOUR_NAVY } value={ email } onChangeText={ setEmail } autoCapitalize="none" keyboardType="email-address" returnKeyType="next" />
					<TextInput style={ styles.input } placeholder="Password" placeholderTextColor={ BRAND_COLOUR_NAVY } value={ password } onChangeText={ setPassword } secureTextEntry returnKeyType="go" onSubmitEditing={ handleLogin } />
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
		backgroundColor: darkModeActive ? BRAND_COLOUR_NAVY : BRAND_COLOUR_OFFWHITE,
	},
	formWrapper: {
		width: '100%',
		maxWidth: 480,
		// backgroundColor: darkModeActive ? BRAND_COLOUR_NAVY : BRAND_COLOUR_WHITE,
	},
	form: {},
	input: {
		color: darkModeActive ? BRAND_COLOUR_WHITE : ACCENT_COLOUR,
		fontSize: 16,
		padding: 14,
		backgroundColor: darkModeActive ? BRAND_COLOUR_NAVY : BRAND_COLOUR_WHITE,
		borderWidth: 1,
		borderColor: ACCENT_COLOUR,
		borderRadius: 10,
		marginBottom: 16,
	},
	button: {
		alignItems: "center",
		padding: 16,
		backgroundColor: ACCENT_COLOUR,
		borderRadius: 10,
		marginBottom: 16,
	},
	buttonDisabled: {
		opacity: 0.7
	},
	buttonText: {
		color: BRAND_COLOUR_WHITE,
		fontSize: 16,
		fontWeight: "600"
	},
	link: {
		textAlign: "center",
		color: "#f9fafb",
		fontSize: 14
	},
});