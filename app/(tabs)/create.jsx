import { useState } from "react"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import COLORS from '../../constants/colors'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { View, Text, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from "react-native"
import styles from "../../styles/create"
import { useAuthStore } from "../../store/authStore"
import { API_URL } from "../../constants/api"

export default function CreateScreen() {
    const [title, setTitle] = useState ("")
    const [caption, setCaption] = useState ("")
    const [rating, setRating] = useState (3)
    const [lat, setLat] = useState (0)
    const [lng, setLng] = useState (0)
    const [image, setImage] = useState (null)
    const [imageBase64, setImageBase64] = useState (null)
    const [loading, setLoading] = useState (false)

    const router = useRouter ()
    const {token} = useAuthStore ()

    const pickImage = async () => {
        try {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "We need permission to access your media library to upload an image.");
                    return;
                }
            }
            const results = ImagePicker.launchImageLibraryAsync ({
                mediaTypes: ['livePhotos', 'images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true
            })
            if (!(await results).canceled) {
                console.log('===============My results=====================');
                console.log(results);
                console.log('====================================');
                setImage ((await results).assets[0].uri)
                if ((await results).assets[0].base64) {
                    setImageBase64 ((await results).assets[0].base64)
                }else {
                    const base64 = await FileSystem.readAsStringAsync ((await results).assets[0].uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                    setImageBase64 (base64)
                }
            }
        } catch (error) {
            console.log('====================================');
            console.log(`ERROR: ${error}`);
            console.log('====================================');
        }

    }
    const handleSubmit = async () => {
        if (!title || !caption || !imageBase64 || rating) {
            Alert.alert ("Validations", "Please Fill In All Field")
            return
        }

        try {
            setLoading (true)
            const uriParts = image.split ('.')
            const fileType = uriParts[uriParts.length - 1]
            const imageType = fileType? `image/${fileType.toLowerCase ()}`: "image/jpeg"

            const imgDataUrl = `data:${imageType};base64,${imageBase64}`
            const response = await fetch (`${API_URL}/report/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify ({
                    title,
                    caption,
                    rating: rating.toString (),
                    image: imgDataUrl
                })
            })
            const data = await response.json ()
            if (!response.ok) throw new Error (data.message || "Something went wrong")
            Alert.alert ("Success", "Your report submission was successful")
            setTitle ("")
            setCaption ("")
            setRating (3)
            setImage (null)
            setLng (0)
            setLat (0)
            setImageBase64 (null)

            router.push ('/')

        } catch (err) {
            console.log('=SUBMISSION ERROR===================================');
            console.log(err);
            console.log('====================================');
        } finally {
            setLoading (false)
        }
    }
    const renderRatingPicker = () => {
        const stars = []
        for (let i = 1; i<=5; i ++) {
            stars.push (
                <TouchableOpacity key={i} onPress={() => setRating (i)} style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? 'star' : 'star-outline'}
                        size={32}
                        color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            )
        }
        return <View style={styles.ratingContainer}>{stars}</View>
    }
    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.scrollViewStyle}
            >
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Submit A Report</Text>
                        <Text style={styles.subtitle}>Share What Affecting Your City</Text>
                    </View>
                    <View style={styles.form}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Report Title</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="book-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Give Your Report A Title"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title}
                                    onChangeText={setTitle}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Your Rating</Text>
                            <>
                                {renderRatingPicker()}
                            </>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Report Image</Text>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <Image source={{url: image}} style={styles.previewImage} />
                                ) : (<View style={styles.placeholderContainer}>
                                    <Ionicons
                                        name="image-outline"
                                        size={40}
                                        color={COLORS.textSecondary}
                                    />
                                    <Text style={styles.placeholderText}> Tap To Select Image</Text>
                                </View>)}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Report Caption</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Write Your Caption"
                                placeholderTextColor={COLORS.placeholderText}
                                value={caption}
                                onChangeText={setCaption}
                                autoCapitalize="none"
                                multiline
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {
                                loading ? (
                                    <ActivityIndicator color="#fff" />
                                ): (
                                    <Text style={styles.buttonText}>Submit Report</Text>
                                )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}