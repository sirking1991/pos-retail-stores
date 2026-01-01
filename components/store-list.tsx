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
import { Edit2, Plus } from "lucide-react"
import { StoreDialog } from "./store-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Store {
    id: string
    name: string
    code: string
    created_at: string
}

export function StoreList() {
    const [stores, setStores] = useState<Store[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)

    const fetchStores = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/stores")
            if (response.ok) {
                const data = await response.json()
                setStores(data)
            }
        } catch (error) {
            console.error("Failed to fetch stores:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const handleAdd = () => {
        setSelectedStore(null)
        setDialogOpen(true)
    }

    const handleEdit = (store: Store) => {
        setSelectedStore(store)
        setDialogOpen(true)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Stores</CardTitle>
                <Button onClick={handleAdd} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Store
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : stores.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No stores found. Click "Add Store" to create your first store.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Store Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell>
                                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
                                            {store.code}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(store.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(store)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <StoreDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                store={selectedStore}
                onSuccess={fetchStores}
            />
        </Card>
    )
}
