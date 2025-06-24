
import styles from '../../styles/signup'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { Link } from "expo-router"
import { useState } from 'react'
import COLORS from '../../constants/colors'
import { Ionicons } from "@expo/vector-icons"
import { useAuthStore } from '../../store/authStore'

const SignUp = () => {
    const [password, setPassword] = useState ("")
    const [email, setEmail] = useState ("")
    const [firstName, setFirstName] = useState ("")
    const [lastName, setLastName] = useState ("")
    const [nrc, setNrc] = useState ("")
    const [phone, setPhone] = useState ("")
    const [showPassword, setShowPassword] = useState (false)

    const {isLoading, register } = useAuthStore ()
    const handleSignUp  = async () => {
        const res = await register (
            password,
            firstName,
            email,
            phone,
            nrc,
            lastName,
        )
        if (!res.success) Alert.alert ("Error", res.error)
    }
    return (
        <ScrollView
            style={{
                flex: 1,
            }}
        >
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Fix My City🏙️</Text>
                            <Text style={styles.subtitle}>Help fix your city by reporting anomalies.</Text>
                        </View>
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>First Name</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="person-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Your First Name"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Last Name</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="person-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Your Last Name"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={lastName}
                                        onChangeText={setLastName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>NRC No</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="id-card-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Your NRC No"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={nrc}
                                        onChangeText={setNrc}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Your Email Address"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType='email-address'
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="call-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Your Phone Number"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={phone}
                                        onChangeText={setPhone}
                                        autoCapitalize="none"
                                        keyboardType='phone-pad'
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
                                onPress={handleSignUp}
                                disabled={isLoading}
                            >
                                {
                                    isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ): (
                                        <Text style={styles.buttonText}>Signup</Text>
                                    )
                                }
                            </TouchableOpacity>

                            <View
                                style={styles.footer}
                            >
                                <Text style={styles.footerText}>Already have an account?</Text>
                                <Link href="/(auth)" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link}>Login</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default SignUp