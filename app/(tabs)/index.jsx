import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native"
import { Image } from "expo-image"
import { useAuthStore } from "../../store/authStore"
import { useEffect, useState } from "react"
import styles from "../../styles/home"
import { API_URL } from "../../constants/api"
import { Ionicons } from "@expo/vector-icons"
import COLORS from "../../constants/colors"
import { formatMemberPublishedDate, sleep } from "../../lib/utils"
import Loader from "../../components/loader"

export default function HomeScreen() {
    const { token } = useAuthStore ()
    const [reports, setReports] = useState ([])
    const [loading, setLoading] = useState (true)
    const [refreshing, setRefreshing] = useState (false)
    const [page, setPage] = useState (1)
    const [hasMore, setHasMore] = useState (true)

    const fetchReports = async (pageNum=1, refresh=false) => {
        try {
            if (refresh) setRefreshing (true)
            else if (pageNum === 1) setLoading (true)
            const response = await fetch (`${API_URL}/report?page=${pageNum}&limit=2`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json ()
            if (!response.ok) throw new Error (data.message || "Failed to fetch reports")

            // setReports((prevReports) => [...prevReports, ...data.reports])
            const uniqueReports = refresh || pageNum === 1 ? data.reports : Array.from (
                new Set ([...reports, ...data.reports].map ((report) => report._id))
            ).map ((id) => [...reports, ...data.reports].find((report) => report._id === id))
            setReports (uniqueReports)
            setHasMore(pageNum < data.totalPages)
            setPage (pageNum)

        } catch (error) {
            console.log('===========ERROR FETCHING REPORTS=========================');
            console.log(`ERROR: ${error}`);
            console.log('====================================');
        }finally {
            if (refresh) {
                await sleep (800)
                setRefreshing (false)
            }
            else setLoading (false)
        }
    }

    useEffect (() => {
        fetchReports ()
    }, [])

    const handleLoadMore = async () => {
        if (hasMore && !loading && !refreshing) {
            await fetchReports (page+1)
        }
    }
    const renderItem = ({item}) => (
        <View style={styles.bookCard}>
            <View style={styles.bookHeader}>
                <View style={styles.userInfo}>
                    <Image
                        source={item.user?.profileImage}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>{`${item.user.firstName} ${item.user?.otherNames || ''} ${item.user.lastName}`}</Text>
                </View>
            </View>
            <View style={styles.bookImageContainer}>
                <Image source={item.image} style={styles.bookImage} contentFit="cover" />
            </View>
            <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <View style={styles.ratingContainer}>{renderRatingStars (item?.rating || 0)}</View>
                <Text style={styles.caption}>{item.caption}</Text>
                <Text style={styles.date}>Reported on {formatMemberPublishedDate (item.createdAt)}</Text>
            </View>
        </View>
    )

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

    if (loading) return (
        <Loader size={70 } />
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={reports}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchReports (1, true)}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Fix My City Reports</Text>
                        <Text style={styles.headerSubtitle}>Discover other reports</Text>
                    </View>
                }
                ListFooterComponent={hasMore && reports.length > 0 ? (
                    <ActivityIndicator
                        style={styles.footerLoader}
                        size="small"
                        color={COLORS.primary}
                    />
                ) : null}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="book-outline"
                            size={60}
                            color={COLORS.textSecondary}
                        />
                        <Text style={styles.emptyText}>No Reports Found</Text>
                        <Text style={styles.emptySubtext}>Be The First To Report</Text>
                    </View>
                }
            />
        </View>
    )
}