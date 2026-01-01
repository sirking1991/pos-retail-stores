"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { createUser, updateUser, updateUserStores } from "@/lib/actions/user-actions"

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.enum(["admin", "staff"]),
})

type UserFormValues = z.infer<typeof userSchema>

interface Store {
    id: string
    name: string
}

interface User {
    id: string
    name: string
    role: string
    account_id: string
    user_stores?: { store_id: string }[]
}

interface UserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User | null
    stores: Store[]
    accountId: string
    onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, stores, accountId, onSuccess }: UserDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedStores, setSelectedStores] = useState<string[]>([])

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            role: "staff",
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                role: user.role as "admin" | "staff",
            })
            setSelectedStores(user.user_stores?.map(s => s.store_id) || [])
        } else {
            form.reset({
                name: "",
                role: "staff",
            })
            setSelectedStores([])
        }
    }, [user, form, open])

    const handleStoreToggle = (storeId: string) => {
        setSelectedStores(current =>
            current.includes(storeId)
                ? current.filter(id => id !== storeId)
                : [...current, storeId]
        )
    }

    async function onSubmit(values: UserFormValues) {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("role", values.role)
            formData.append("accountId", accountId)

            let userId = user?.id

            if (user) {
                await updateUser(user.id, formData)
            } else {
                const newUser = await createUser(formData)
                userId = newUser.id
            }

            if (userId) {
                await updateUserStores(userId, selectedStores)
            }

            toast.success(user ? "User updated successfully" : "User created successfully")
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription>
                        {user ? "Update user details and store access." : "Create a new user and assign store access."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Store Access</FormLabel>
                            <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto">
                                {stores.map((store) => (
                                    <div key={store.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`store-${store.id}`}
                                            checked={selectedStores.includes(store.id)}
                                            onCheckedChange={() => handleStoreToggle(store.id)}
                                        />
                                        <label
                                            htmlFor={`store-${store.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {store.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
