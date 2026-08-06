import ScreenTitle from '@/src/components/ScreenTitle';
import { BRAND_COLOUR_GREY, BRAND_COLOUR_WHITE, ERROR_COLOUR } from '@/src/constants/colours';
import { AUTH_ROUTE } from '@/src/constants/routes';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Settings() {
	const router = useRouter();
	const { user, logout } = useAuth();
	const [ currentTeam, setCurrentTeam ] = useState();
	const [ showLogoutConfirm, setShowLogoutConfirm ] = useState(false);
	const [ confirmInput, setConfirmInput ] = useState('');

	const handleLogout = async () => {
		try {
			await logout();
		} finally {
			router.replace( AUTH_ROUTE );
		}
	}

	const openLogoutConfirm = () => {
		setConfirmInput('');
		setShowLogoutConfirm(true);
	}

	const closeLogoutConfirm = () => {
		setShowLogoutConfirm(false);
		setConfirmInput('');
	}

	const handleConfirmLogout = async () => {
		if (confirmInput.trim().toUpperCase() !== 'LOGOUT') return;
		try {
			await logout();
		} finally {
			setShowLogoutConfirm(false);
			router.replace( AUTH_ROUTE );
		}
	}

	if( !user ) return handleLogout();

	return (
		<View style={ styles.container }>
			<ScreenTitle title="Settings" />
			
			<Text>Name</Text>
			<Text style={ styles.title }>{ user.name }</Text>
			
			<Text>Email</Text>
			<Text style={ styles.title }>{ user.email }</Text>
			
			<Text>Current Team</Text>
			<Text style={ styles.title }>{ user.current_team_id }</Text>

			<TouchableOpacity style={ styles.logoutButton } onPress={ openLogoutConfirm } accessibilityRole="button">
				<Text style={ styles.logoutText }>Log out</Text>
			</TouchableOpacity>

			<Modal visible={ showLogoutConfirm } transparent={ true } animationType="fade" onRequestClose={ closeLogoutConfirm }>
				<View style={ styles.modalOverlay }>
					<View style={ styles.modalContent }>
						<Text style={ styles.modalTitle }>Are you sure you want to log out?</Text>
						<Text style={ styles.modalMessage }>Any changes you've made on this device will be lost if they're not uploaded.</Text>
						<TextInput style={ styles.modalInput } value={ confirmInput } onChangeText={ setConfirmInput } placeholder="Type LOGOUT to confirm" autoCapitalize="characters" autoCorrect={ false } accessibilityLabel="Logout confirmation input" />
						<View style={ styles.modalButtons }>
							<TouchableOpacity style={ styles.modalButton } onPress={ closeLogoutConfirm }>
								<Text>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[ styles.modalButton, confirmInput.trim().toUpperCase() === 'LOGOUT' ? styles.modalConfirmButton : styles.modalConfirmButtonDisabled ]} onPress={ handleConfirmLogout } disabled={ confirmInput.trim().toUpperCase() !== 'LOGOUT' } accessibilityRole="button">
								<Text style={ confirmInput.trim().toUpperCase() === 'LOGOUT' ? styles.logoutText : undefined }>Confirm</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	title: {
		fontSize: 20,
		marginBottom: 24,
	},
	logoutButton: {
		backgroundColor: ERROR_COLOUR,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	logoutText: {
		color: BRAND_COLOUR_WHITE,
		fontWeight: '600',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: BRAND_COLOUR_WHITE,
		padding: 20,
		borderRadius: 8,
		width: '85%',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 8,
	},
	modalMessage: {
		marginBottom: 12,
	},
	modalInput: {
		borderWidth: 1,
		borderColor: BRAND_COLOUR_GREY,
		padding: 10,
		borderRadius: 6,
		marginBottom: 12,
		textAlign: 'center',
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	modalButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginLeft: 8,
	},
	modalConfirmButton: {
		backgroundColor: ERROR_COLOUR,
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	modalConfirmButtonDisabled: {
		backgroundColor: BRAND_COLOUR_GREY,
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
})