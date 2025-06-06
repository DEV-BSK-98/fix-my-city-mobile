import { useEffect, useState } from "react"
import { View, Text, Alert, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { API_URL } from "../../constants/api"
import { useAuthStore } from "../../store/authStore"
import styles from "../../styles/profile"
import ProfileHeader from "../../components/ProfileHeader"
import LogoutBtn from "../../components/LogoutBtn"
import { Ionicons } from "@expo/vector-icons"
import COLORS from "../../constants/colors"
import { formatMemberPublishedDate, sleep } from "../../lib/utils"
import Loader from "../../components/loader"


export default function ProfileScreen() {
    const { token } = useAuthStore ()
    const [reports, setReports] = useState ([])
    const [loading, setLoading] = useState (true)
    const [refreshing, setRefreshing] = useState (false)
    const [deledreportID, setDeledreportID] = useState (null)

    const router = useRouter ()

    const fetchData = async () => {
        try {
            setLoading (true)
            const res = await fetch (`${API_URL}/report/mine`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json ()
            if (!res.ok) throw new Error (data.message || "Failed to fetch user reports")
            setReports (data)
        } catch (error) {
            console.log('====================================');
            console.log(`ERROR: ${error}`);
            console.log('====================================');
            Alert.alert ("Error", "Failed to load profile data. Pull down to refresh")
        }finally {
            setLoading (false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing (true)
        await sleep (800)
        await fetchData ()
        setRefreshing (false)
    }

    const handleDeletion = async (reportId) => {
        try {
            setDeledreportID (reportId)
            const res = fetch (`${API_URL}/report/${reportId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json ()
            if (!res.ok) throw new Error (data.message || "Deletion Failed")
            setReports (reports.filter ((report) => report._id !== reportId))
            Alert.alert ("Success", "Report Deleted Successfully")
        } catch (error) {
            Alert.alert ("ERROR", error.message || "Failed to delete report")
        }finally {
            setDeledreportID (null)
        }
    }

    const confirmDelete = (id) => {
        Alert.alert ("Logout", "Are you sure you want to logout?", [
            {text: "Cancel", style: "cancel"},
            {text: "Delete", onPress: () => handleDeletion (id), style: "destructive"},
        ])
    }

    useEffect (() => {
        fetchData ()
    }, [])

    const renderRatingStars = (rating) => {
        const stars = []
        for (let i = 1; i<=5; i ++) {
            stars.push (
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                />
            )
        }
        return <View style={styles.ratingContainer}>{stars}</View>
    }

    const renderReportItem = ({ item }) => (
        <View style={styles.bookItem}>
            <Image source={item.Image} style={styles.bookImage} />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <View style={styles.ratingContainer}>{renderRatingStars (item?.rating || 0)}</View>
                <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
                <Text style={styles.date}>Reported on {formatMemberPublishedDate (item.createdAt)}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete (item._id)}>
                {
                    deledreportID === item._id ? (<ActivityIndicator size="small" color={COLORS.primary} />) : (<Ionicons name="trash-outline" color={COLORS.primary} size={20} />)
                }
            </TouchableOpacity>
        </View>
    )

    if (loading && !refreshing) return <Loader size="large" />

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogoutBtn />

            <View style={styles.booksHeader}>
                <Text style={styles.bookTitle}>Your Reports</Text>
                <Text style={styles.booksCount}>{reports?.length || 0} Reports</Text>
            </View>
            <FlatList
                data={reports}
                renderItem={renderReportItem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                />}
                contentContainerStyle={styles.booksList}
                ListEmptyComponent={<View style={styles.emptyContainer}>
                    <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
                    <Text style={styles.emptyText}>No Reports Yet</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.push ("/create")}>
                        <Text style={styles.addButtonText}>Add Your First Report</Text>
                    </TouchableOpacity>
                </View>}

            />
        </View>
    )
}