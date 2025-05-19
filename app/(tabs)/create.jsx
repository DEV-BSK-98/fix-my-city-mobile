import { useState } from "react"
import { useRouter } from "expo-router"
import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from "react-native"
import styles from "../../styles/create"

export default function CreateScreen() {
    const [title, setTitle] = useState ("")
    const [caption, setCaption] = useState ("")
    const [rating, setRatingn] = useState (3)
    const [lat, setlat] = useState (0)
    const [lng, setLng] = useState (0)
    const [image, setImage] = useState (null)
    const [imageBase64, setImageBase64] = useState (null)
    const [loading, setLoading] = useState (false)

    const router = useRouter ()

    const pickImage = async () => {}
    const handleSubmit = async () => {}
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
                        
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}