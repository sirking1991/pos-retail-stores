"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateUniqueUserCode } from "@/lib/codes"

export async function createUser(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const accountId = formData.get("accountId") as string

    if (!name || !role || !accountId) {
        throw new Error("Missing required fields")
    }

    const code = await generateUniqueUserCode(accountId)

    const { data: user, error } = await supabase
        .from("users")
        .insert({
            name,
            role,
            account_id: accountId,
            code,
        })
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/users")
    return user
}

export async function updateUser(userId: string, formData: FormData) {
    const supabase = await createClient()
    const name = formData.get("name") as string
    const role = formData.get("role") as string

    const { error } = await supabase
        .from("users")
        .update({ name, role })
        .eq("id", userId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/users")
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/admin/users")
}

export async function updateUserStores(userId: string, storeIds: string[]) {
    const supabase = await createClient()

    // Delete existing mappings
    const { error: deleteError } = await supabase
        .from("user_stores")
        .delete()
        .eq("user_id", userId)

    if (deleteError) {
        throw new Error(deleteError.message)
    }

    // Insert new mappings
    if (storeIds.length > 0) {
        const mappings = storeIds.map(storeId => ({
            user_id: userId,
            store_id: storeId
        }))

        const { error: insertError } = await supabase
            .from("user_stores")
            .insert(mappings)

        if (insertError) {
            throw new Error(insertError.message)
        }
    }

    revalidatePath("/admin/users")
}
