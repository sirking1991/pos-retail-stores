"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

const loginSchema = z.object({
    storeCode: z.string().length(5, "Store code must be exactly 5 characters").toUpperCase(),
    userCode: z.string().length(5, "User code must be exactly 5 characters").toUpperCase(),
})

export function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            storeCode: "",
            userCode: "",
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true)
        try {
            // 1. Find store by code
            const { data: store, error: storeError } = await supabase
                .from("stores")
                .select("id, account_id")
                .eq("code", values.storeCode)
                .single()

            if (storeError || !store) {
                throw new Error("Invalid store code")
            }

            // 2. Find user by code and check mapping to this store
            const { data: user, error: userError } = await supabase
                .from("users")
                .select(`
          id,
          name,
          role,
          user_stores!inner(store_id)
        `)
                .eq("code", values.userCode)
                .eq("user_stores.store_id", store.id)
                .single()

            if (userError || !user) {
                throw new Error("Invalid user code for this store")
            }

            // 3. Set session via API route (to handle cookies securely)
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storeId: store.id,
                    userId: user.id,
                    accountId: store.account_id,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to create session")
            }

            toast.success(`Welcome back, ${user.name}!`)
            router.push("/")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Failed to login")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>POS Login</CardTitle>
                <CardDescription>Enter your store and user codes to access the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="storeCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ABCDE" className="uppercase font-mono text-lg tracking-widest" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="*****"
                                            className="uppercase font-mono text-lg tracking-widest"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                        Register here
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
