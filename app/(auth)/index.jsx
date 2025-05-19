import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Image } from 'expo-image'
import { Link } from "expo-router"
import { useState } from 'react'
import styles from '../../styles/login'
import COLORS from '../../constants/colors'
import { Ionicons } from "@expo/vector-icons"
import { useAuthStore } from "../../store/authStore"

const Login = () => {
    const [password, setPassword] = useState ("")
    const [email, setEmail] = useState ("")
    const [showPassword, setShowPassword] = useState (false)
    const { isLoading, login } = useAuthStore ()

    const handleLogin  = async () => {
        const result = await login ({email, password})
        if (!result.success) Alert.alert ("Error", result.error)
    }

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image
                        source={require ("../../assets/images/fix-splashg.png")}
                        style={styles.illustrationImage}
                        contentFit="contain"
                    />
                </View>
                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your Email"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your Password"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword (!showPassword)}
                                    style={styles.eyeIcon}
                                    size={20}
                                    color={COLORS.primary}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {
                                isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ): (
                                    <Text style={styles.buttonText}>Login</Text>
                                )
                            }
                        </TouchableOpacity>

                        <View
                            style={styles.footer}
                        >
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.link}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login