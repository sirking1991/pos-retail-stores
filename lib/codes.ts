import { createClient } from "@/lib/supabase/client"

/**
 * Generates a random alphanumeric string of a given length.
 */
export function generateRandomCode(length: number = 5): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Removed ambiguous chars (I, O, 0, 1)
    let result = ""
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Generates a unique store code.
 */
export async function generateUniqueStoreCode(): Promise<string> {
    const supabase = createClient()
    let code = generateRandomCode(5)
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
        const { data } = await supabase.from("stores").select("code").eq("code", code).single()
        if (!data) {
            isUnique = true
        } else {
            code = generateRandomCode(5)
            attempts++
        }
    }

    return code
}

/**
 * Generates a unique user code for a given account.
 */
export async function generateUniqueUserCode(accountId: string): Promise<string> {
    const supabase = createClient()
    let code = generateRandomCode(5)
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
        const { data } = await supabase
            .from("users")
            .select("code")
            .eq("account_id", accountId)
            .eq("code", code)
            .single()
        if (!data) {
            isUnique = true
        } else {
            code = generateRandomCode(5)
            attempts++
        }
    }

    return code
}
