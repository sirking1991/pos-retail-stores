import { NextResponse } from "next/server"
import { getAuthSession, getUserRole } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getAuthSession()
        const role = await getUserRole()

        let accountName = null
        let storeName = null

        if (session.accountId || session.storeId) {
            const { createClient } = await import("@/lib/supabase/server")
            const supabase = await createClient()

            if (session.accountId) {
                const { data: account } = await supabase
                    .from("accounts")
                    .select("name")
                    .eq("id", session.accountId)
                    .single()
                accountName = account?.name
            }

            if (session.storeId) {
                const { data: store } = await supabase
                    .from("stores")
                    .select("name")
                    .eq("id", session.storeId)
                    .single()
                storeName = store?.name
            }
        }

        return NextResponse.json({
            ...session,
            role,
            accountName,
            storeName,
        })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
