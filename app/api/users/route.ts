import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthSession, isAdmin } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getAuthSession()
        if (!session.accountId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const supabase = await createClient()

        // Fetch users and their assigned stores
        const { data: users, error } = await supabase
            .from("users")
            .select(`
                *,
                user_stores (
                    store_id
                )
            `)
            .eq("account_id", session.accountId)
            .order("name", { ascending: true })

        if (error) throw error

        return NextResponse.json(users)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
