import { redirect } from "next/navigation"
import { getAuthSession, isAdmin } from "@/lib/auth"
import { UserList } from "@/components/user-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AdminUsersPage() {
    const session = await getAuthSession()

    if (!session.isLoggedIn) {
        redirect("/login")
    }

    if (!(await isAdmin())) {
        redirect("/")
    }

    return (
        <main className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Button variant="ghost" size="sm" asChild className="-ml-2">
                                <Link href="/admin/stores">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to Stores
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage staff users and their access to specific stores.
                        </p>
                    </div>
                </div>
                <UserList />
            </div>
        </main>
    )
}
