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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const storeSchema = z.object({
    name: z.string().min(1, "Store name is required"),
})

type StoreFormValues = z.infer<typeof storeSchema>

interface StoreDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    store?: { id: string; name: string } | null
    onSuccess: () => void
}

export function StoreDialog({ open, onOpenChange, store, onSuccess }: StoreDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: "",
        },
    })

    useEffect(() => {
        if (store) {
            form.reset({ name: store.name })
        } else {
            form.reset({ name: "" })
        }
    }, [store, form])

    async function onSubmit(values: StoreFormValues) {
        setIsLoading(true)
        try {
            const url = store ? `/api/stores/${store.id}` : "/api/stores"
            const method = store ? "PATCH" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Failed to save store")
            }

            toast.success(store ? "Store updated successfully" : "Store created successfully")
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
                    <DialogTitle>{store ? "Edit Store" : "Add Store"}</DialogTitle>
                    <DialogDescription>
                        {store ? "Update your store details below." : "Enter the details for your new store."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Main Street Branch" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Store"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
