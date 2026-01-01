"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Copy } from "lucide-react"
import { toast } from "sonner"

export default function RegisterSuccessPage() {
    const searchParams = useSearchParams()
    const storeCode = searchParams.get("storeCode")
    const userCode = searchParams.get("userCode")

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied!`)
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary">Registration Successful!</CardTitle>
                    <CardDescription>
                        Your account and store have been created. Please save these codes carefully.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Store Code</p>
                                <p className="text-2xl font-mono font-bold tracking-widest">{storeCode}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(storeCode || "", "Store Code")}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">User Code (Admin)</p>
                                <p className="text-2xl font-mono font-bold tracking-widest">{userCode}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(userCode || "", "User Code")}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-sm text-amber-600 font-medium">
                        IMPORTANT: Use these codes to log in to the POS system.
                    </div>

                    <Button asChild className="w-full py-6 text-lg font-semibold">
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
