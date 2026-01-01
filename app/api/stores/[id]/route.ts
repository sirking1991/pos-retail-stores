import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/auth"

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { name } = await req.json()
        const { id } = await params

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: store, error } = await supabase
            .from("stores")
            .update({ name })
            .eq("id", id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(store)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
