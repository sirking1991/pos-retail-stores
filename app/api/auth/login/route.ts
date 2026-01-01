import { NextRequest, NextResponse } from "next/server"
import { setAuthSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const { storeId, userId, accountId } = await req.json()

        if (!storeId || !userId || !accountId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        await setAuthSession(storeId, userId, accountId)

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
