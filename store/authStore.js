import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {API_URL} from "../constants/api"

export const useAuthStore = create ((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,
    // register: async (
    //     password,
    //     firstName,
    //     email,
    //     phone,
    //     nrc,
    //     lastName
    // ) => {
    //     set ({isLoading: true})
    //     try {
    //         const res = await fetch (`${API_URL}/auth/register`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify ({
    //                 firstName,
    //                 email,
    //                 password,
    //                 phone,
    //                 nrc,
    //                 lastName,
    //             })
    //         })

    //         const data = await res.json ()
    //         if (!res.ok) throw new Error (data.msg || "Something Went Wrong")
    //         await AsyncStorage.setItem ("user", JSON.stringify (data.user))
    //         await AsyncStorage.setItem ("token", data.token)

    //         set ({
    //             token: data.token,
    //             user: data.user
    //         })
    //         return {success: true}
    //     } catch (err) {
    //         console.log('====================================')
    //         console.log(`ERROR: ${err}`)
    //         console.log('====================================')
    //         return {success: false, error: err.message}
    //     } finally {
    //         set ({isLoading: false})
    //     }
    // },
    register: async (
        password,
        firstName,
        email,
        phone,
        nrc,
        lastName
    ) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    email,
                    password,
                    phone,
                    nrc,
                    lastName,
                }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                throw new Error("Server error: " + text.substring(0, 100));
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Something Went Wrong");
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({
                token: data.token,
                user: data.user,
            });
            return { success: true };
        } catch (err) {
            console.log('====================================');
            console.log(`ERROR: ${err}`);
            console.log('====================================');
            return { success: false, error: `${err.message}` };
        } finally {
            set({ isLoading: false });
        }
    },
    login: async ({
        password,
        email
    }) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password,
                    email,
                }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                throw new Error("Server error: " + text.substring(0, 100));
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Something Went Wrong");
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({
                token: data.token,
                user: data.user,
            });
            return { success: true };
        } catch (error) {
            console.log(`ERROR: ${error} During Login`);
            return { success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    // checkAuth: async () => {
    //     try {
    //         const token = await AsyncStorage.getItem ('token')
    //         const userJson = await AsyncStorage.getItem ('user')
    //         const user = JSON.parse (userJson)
    //         set ({token, user})
    //     } catch (err) {
    //         console.log (`ERROR: ${err} while checking User Auth`)
    //     }finally {
    //         set({isCheckingAuth: false})
    //     }
    // },
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');

            let user = null;

            if (userJson) {
                try {
                    user = JSON.parse(userJson);
                } catch (jsonErr) {
                    console.log(`Invalid JSON in 'user': ${jsonErr}`);
                }
            }else{
                await AsyncStorage.removeItem ("user")
                await AsyncStorage.removeItem ("token")
                set ({token: null, user: null})
            }

            set({ token, user });
        } catch (err) {
            console.log(`ERROR: ${err} while checking User Auth`);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    logOut: async () => {
        await AsyncStorage.removeItem ("user")
        await AsyncStorage.removeItem ("token")
        set ({token: null, user: null})
    },
    // login: async ({
    //     password,
    //     email
    // }) => {
    //     set ({isLoading: true})
    //     try {
    //         const res = await fetch (`${API_URL}/auth/login`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify ({
    //                 password,
    //                 email,
    //             })
    //         })
    //         const data = await res.json ()
    //         if (!res.ok) throw new Error (data.msg || "Something Went Wrong")
    //         await AsyncStorage.setItem ("user", JSON.stringify (data.user))
    //         await AsyncStorage.setItem ("token", data.token)

    //         set ({
    //             token: data.token,
    //             user: data.user
    //         })
    //         return {success: true}
    //     } catch (error) {
    //         console.log (`ERROR: ${error} During Login`)
    //         return {success: false, error: error.message}
    //     } finally {
    //         set ({isLoading: false})
    //     }
    // }
}))