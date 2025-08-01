import { Text, TouchableOpacity, Alert } from 'react-native'
import { useAuthStore } from '../store/authStore'
import styles from '../styles/profile'
import { Ionicons } from "@expo/vector-icons"
import COLORS from '../constants/colors'


const LogoutBtn = () => {
    const { logOut, user } = useAuthStore ()
    const confirmLogout = () => {
        Alert.alert ("Logout", "Are you sure you want to logout?", [
            {text: "Cancel", style: "cancel"},
            {text: "Logout", onPress: () => logOut (), style: "destructive"},
        ])
    }
    if (!user) return null
    return (
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Ionicons name='log-out-outline' size={20} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    )
}

export default LogoutBtn