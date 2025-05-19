import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const useAuthStore = create ((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    register: async (
        password,
        firstName,
        email,
        phone,
        nrc,
        lastName
    ) => {
        set ({isLoading: true})
        try {
            const res = await fetch ("http://10.0.2.2:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify ({
                    firstName,
                    email,
                    password,
                    phone,
                    nrc,
                    lastName,
                })
            })

            const data = await res.json ()
            if (!res.ok) throw new Error (data.msg || "Something Went Wrong")
            await AsyncStorage.setItem ("user", JSON.stringify (data.user))
            await AsyncStorage.setItem ("token", data.token)

            set ({
                token: data.token,
                user: data.user
            })
            return {success: true}
        } catch (err) {
            console.log('====================================')
            console.log(`ERROR: ${err}`)
            console.log('====================================')
            return {success: false, error: err.message}
        } finally {
            set ({isLoading: false})
        }
    },
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem ('token')
            const userJson = await AsyncStorage.getItem ('user')
            const user = JSON.parse (userJson)
            set ({token, user})
        } catch (err) {
            console.log (`ERROR: ${err} while checking User Auth`)
        }
    },
    logOut: async () => {
        await AsyncStorage.removeItem ("user")
        await AsyncStorage.removeItem ("token")
        set ({token: null, user: null})
    },
    login: async ({
        password,
        email
    }) => {
        set ({isLoading: true})
        try {
            const res = await fetch ("http://10.0.2.2:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify ({
                    password,
                    email,
                })
            })
            const data = await res.json ()
            if (!res.ok) throw new Error (data.msg || "Something Went Wrong")
            await AsyncStorage.setItem ("user", JSON.stringify (data.user))
            await AsyncStorage.setItem ("token", data.token)

            set ({
                token: data.token,
                user: data.user
            })
            return {success: true}
        } catch (error) {
            console.log (`ERROR: ${error} During Login`)
        } finally {
            set ({isLoading: false})
        }
    }
}))