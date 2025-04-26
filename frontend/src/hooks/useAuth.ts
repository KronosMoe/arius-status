import { AuthContext } from "@/context/auth-context"
import { useContext } from "react"

export const useAuth = () => {
    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error('useAuth must be used within a AuthProvider')
    }

    return authContext
}