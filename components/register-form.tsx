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
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { generateUniqueStoreCode, generateUniqueUserCode } from "@/lib/codes"

const registerSchema = z.object({
    accountName: z.string().min(2, "Account name must be at least 2 characters"),
    storeName: z.string().min(2, "Store name must be at least 2 characters"),
    adminName: z.string().min(2, "Admin name must be at least 2 characters"),
    adminEmail: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            accountName: "",
            storeName: "",
            adminName: "",
            adminEmail: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsLoading(true)
        try {
            // 1. Sign up user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: values.adminEmail,
                password: values.password,
            })

            if (authError) throw authError

            console.log("Auth signup successful:", authData)

            // 2. Create Account
            console.log("Creating account record...")
            const { data: account, error: accountError } = await supabase
                .from("accounts")
                .insert({
                    name: values.accountName,
                    admin_email: values.adminEmail,
                })
                .select()
                .single()

            if (accountError) {
                console.error("Account creation error detail:", accountError)
                throw new Error(`Failed to create account record: ${accountError.message} (${accountError.code})`)
            }

            // 3. Create Store
            console.log("Creating store record...")
            const storeCode = await generateUniqueStoreCode()
            const { data: store, error: storeError } = await supabase
                .from("stores")
                .insert({
                    account_id: account.id,
                    name: values.storeName,
                    code: storeCode,
                })
                .select()
                .single()

            if (storeError) {
                console.error("Store creation error detail:", storeError)
                throw storeError
            }

            // 4. Create User (Staff/Admin)
            console.log("Creating user record...")
            const userCode = await generateUniqueUserCode(account.id)
            const { data: user, error: userError } = await supabase
                .from("users")
                .insert({
                    account_id: account.id,
                    name: values.adminName,
                    code: userCode,
                    role: "admin",
                })
                .select()
                .single()

            if (userError) {
                console.error("User record creation error detail:", userError)
                throw userError
            }

            // 5. Map User to Store
            console.log("Mapping user to store...")
            const { error: mappingError } = await supabase
                .from("user_stores")
                .insert({
                    user_id: user.id,
                    store_id: store.id,
                })

            if (mappingError) {
                console.error("Mapping error detail:", mappingError)
                throw mappingError
            }

            toast.success("Account created successfully!")
            router.push(`/register/success?storeCode=${storeCode}&userCode=${userCode}`)
        } catch (error: any) {
            console.error("Registration flow caught error:", error)
            toast.error(error.message || "Failed to register")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="accountName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/70 text-xs uppercase tracking-wider font-semibold">Business Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Corp" className="h-11 border-muted-foreground/20 focus-visible:ring-primary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="storeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/70 text-xs uppercase tracking-wider font-semibold">First Store Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Main Branch" className="h-11 border-muted-foreground/20 focus-visible:ring-primary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-muted-foreground/10 space-y-4">
                        <h3 className="text-sm font-semibold text-foreground/80">Administrator Details</h3>
                        <FormField
                            control={form.control}
                            name="adminName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/70 text-xs uppercase tracking-wider font-bold">Admin Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" className="h-11 border-muted-foreground/20 bg-background focus-visible:ring-primary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="adminEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/70 text-xs uppercase tracking-wider font-bold">Admin Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@example.com" className="h-11 border-muted-foreground/20 bg-background focus-visible:ring-primary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/70 text-xs uppercase tracking-wider font-bold">Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" className="h-11 border-muted-foreground/20 bg-background focus-visible:ring-primary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" disabled={isLoading}>
                        {isLoading ? "Creating Business Profile..." : "Complete Registration"}
                    </Button>
                </form>
            </Form>
            <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                    Sign in to your store
                </Link>
            </div>
        </div>
    )
}
