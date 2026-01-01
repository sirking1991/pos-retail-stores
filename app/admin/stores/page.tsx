import { redirect } from "next/navigation"
import { getAuthSession, isAdmin } from "@/lib/auth"
import { StoreList } from "@/components/store-list"

export default async function AdminStoresPage() {
    const session = await getAuthSession()

    if (!session.isLoggedIn) {
        redirect("/login")
    }

    if (!(await isAdmin())) {
        redirect("/")
    }

    return (
        <main className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your stores and account settings.
                    </p>
                </div>
                <StoreList />
            </div>
        </main>
    )
}
