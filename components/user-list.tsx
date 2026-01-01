"use client"

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { UserDialog } from "./user-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { deleteUser } from "@/lib/actions/user-actions"

interface Store {
    id: string
    name: string
}

interface User {
    id: string
    name: string
    code: string
    role: string
    account_id: string
    created_at: string
    user_stores: { store_id: string }[]
}

export function UserList() {
    const [users, setUsers] = useState<User[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [accountId, setAccountId] = useState<string>("")

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [usersRes, storesRes, sessionRes] = await Promise.all([
                fetch("/api/users"),
                fetch("/api/stores"),
                fetch("/api/auth/session")
            ])

            if (usersRes.ok && storesRes.ok && sessionRes.ok) {
                const usersData = await usersRes.json()
                const storesData = await storesRes.json()
                const sessionData = await sessionRes.json()

                setUsers(usersData)
                setStores(storesData)
                setAccountId(sessionData.accountId)
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
            toast.error("Failed to load users")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAdd = () => {
        setSelectedUser(null)
        setDialogOpen(true)
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setDialogOpen(true)
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            await deleteUser(userId)
            toast.success("User deleted successfully")
            fetchData()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Users</CardTitle>
                <Button onClick={handleAdd} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No users found. Click "Add User" to create your first staff member.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Stores</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
                                            {user.code}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.user_stores.length === 0 ? (
                                                <span className="text-xs text-muted-foreground italic">No stores assigned</span>
                                            ) : (
                                                user.user_stores.map(us => {
                                                    const store = stores.find(s => s.id === us.store_id)
                                                    return (
                                                        <Badge key={us.store_id} variant="outline" className="text-[10px] px-1 py-0 h-5">
                                                            {store?.name || "Unknown Store"}
                                                        </Badge>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(user.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={selectedUser}
                stores={stores}
                accountId={accountId}
                onSuccess={fetchData}
            />
        </Card>
    )
}
