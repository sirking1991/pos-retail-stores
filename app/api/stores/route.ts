import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthSession, isAdmin } from "@/lib/auth"
import { generateUniqueStoreCode } from "@/lib/codes"

export async function GET() {
    try {
        const session = await getAuthSession()
        if (!session.accountId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const supabase = await createClient()
        const { data: stores, error } = await supabase
            .from("stores")
            .select("*")
            .eq("account_id", session.accountId)
            .order("name", { ascending: true })

        if (error) throw error

        return NextResponse.json(stores)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const session = await getAuthSession()
        const { name } = await req.json()

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }

        const code = await generateUniqueStoreCode()
        const supabase = await createClient()

        const { data: store, error } = await supabase
            .from("stores")
            .insert({
                name,
                code,
                account_id: session.accountId,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(store)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
