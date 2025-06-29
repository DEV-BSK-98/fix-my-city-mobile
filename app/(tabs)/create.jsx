import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";

import styles from "../../styles/create";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";

export default function CreateScreen() {
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [place, setPlace] = useState("");
    const [rating, setRating] = useState(3);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsgLoc, setErrorMsgLoc] = useState(null);

    const router = useRouter();
    const { token } = useAuthStore();

    const pickImage = async () => {
        try {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'We need permission to access your media library to upload an image.');
                    return;
                }
            }

            const results = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!results.canceled) {
                const asset = results.assets[0];
                setImage(asset.uri);

                if (asset.base64) {
                    setImageBase64(asset.base64);
                } else {
                    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                    });
                    setImageBase64(base64);
                }
            }
        } catch (error) {
            console.error('Image Picker Error:', error);
            Alert.alert('Error', 'Something went wrong while picking the image.');
        }
    };

    const getLoc = async () => {
        try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsgLoc('Permission to access location was denied');
            return;
        }

        const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        const latitude = loc.coords.latitude;
        const longitude = loc.coords.longitude;

        setLat(latitude);
        setLng(longitude);

        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (geocode.length > 0) {
            const placeData = geocode[0];
            const readableLocation = `${placeData.city || placeData.region || placeData.name || "Unknown"}, ${placeData.country}`;
            setPlace(readableLocation);
            console.log("Place set to:", readableLocation);
        }
        } catch (error) {
        console.error("Location Error:", error.message);
        setErrorMsgLoc(error.message);
        }
    };

    const handleSubmit = async () => {
        if (!title || !caption || !imageBase64) {
            Alert.alert("Validations", "Please fill in all required fields");
            return;
        }

        try {
        setLoading(true);

        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
        const imgDataUrl = `data:${imageType};base64,${imageBase64}`;

        const response = await fetch(`${API_URL}/report/`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                caption,
                place,
                rating: rating.toString(),
                image: imgDataUrl,
                lat,
                lng,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("API Error response:", data);
            console.log("Payload being sent:", {
                title,
                caption,
                rating,
                place,
                lat,
                lng,
                image: imgDataUrl.slice(0, 100) + "...",
            });
            console.log('====================================');
            console.log(data);
            console.log('====================================');
            Alert.alert("Error", `${data.msg}`);
            throw new Error(data.msg || "Something went wrong");
        }else {

            Alert.alert("Success", "Your report submission was successful");

            // Reset form
            setTitle("");
            setCaption("");
            setPlace("");
            setRating(3);
            setImage(null);
            setImageBase64(null);
            setLat(0);
            setLng(0);

            router.push('/');
        }
        } catch (err) {
        console.error("SUBMISSION ERROR:", err);
        } finally {
        setLoading(false);
        }
    };

    const renderRatingPicker = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
        stars.push(
            <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
            <Ionicons
                name={i <= rating ? 'star' : 'star-outline'}
                size={32}
                color={i <= rating ? "#f4b400" : COLORS.textSecondary}
            />
            </TouchableOpacity>
        );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    };

    useEffect(() => {
        getLoc();
    }, []);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
            <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Submit A Report</Text>
                <Text style={styles.subtitle}>Share What Affecting Your City</Text>
            </View>
            <View style={styles.form}>
                <View style={styles.formGroup}>
                <Text style={styles.label}>Report Title</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="book-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
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
                <Text style={styles.label}>Report Place</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="pin-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                    style={styles.input}
                    placeholder="Where Are You Reporting From"
                    placeholderTextColor={COLORS.placeholderText}
                    value={place}
                    onChangeText={setPlace}
                    autoCapitalize="none"
                    />
                </View>
                </View>
                <View style={styles.formGroup}>
                <Text style={styles.label}>Your Rating</Text>
                {renderRatingPicker()}
                </View>
                <View style={styles.formGroup}>
                <Text style={styles.label}>Report Image</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                    <View style={styles.placeholderContainer}>
                        <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                        <Text style={styles.placeholderText}>Tap To Select Image</Text>
                    </View>
                    )}
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
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Submit Report</Text>
                )}
                </TouchableOpacity>
            </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}