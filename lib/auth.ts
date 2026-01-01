import { cookies } from "next/headers"

export const COOKIE_STORE_ID = "pos_store_id"
export const COOKIE_USER_ID = "pos_user_id"
export const COOKIE_ACCOUNT_ID = "pos_account_id"

export async function getAuthSession() {
    const cookieStore = await cookies()
    const storeId = cookieStore.get(COOKIE_STORE_ID)?.value
    const userId = cookieStore.get(COOKIE_USER_ID)?.value
    const accountId = cookieStore.get(COOKIE_ACCOUNT_ID)?.value

    return {
        storeId,
        userId,
        accountId,
        isLoggedIn: !!(storeId && userId),
    }
}

export async function setAuthSession(storeId: string, userId: string, accountId: string) {
    const cookieStore = await cookies()
    const options = {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    }

    cookieStore.set(COOKIE_STORE_ID, storeId, options)
    cookieStore.set(COOKIE_USER_ID, userId, options)
    cookieStore.set(COOKIE_ACCOUNT_ID, accountId, options)
}

export async function clearAuthSession() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_STORE_ID)
    cookieStore.delete(COOKIE_USER_ID)
    cookieStore.delete(COOKIE_ACCOUNT_ID)
}

export async function getUserRole() {
    const session = await getAuthSession()
    if (!session.userId) return null

    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.userId)
        .single()

    return user?.role || null
}

export async function isAdmin() {
    const role = await getUserRole()
    return role === "admin"
}
