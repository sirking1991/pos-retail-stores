import { LoginForm } from "@/components/login-form"
import { ShoppingBag, BarChart3, Users, ShieldCheck } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen bg-transparent">
            {/* Left Side: Marketing Section */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-2xl font-bold mb-12">
                        <ShoppingBag className="w-8 h-8" />
                        <span>BizWerks POS for Retail Stores</span>
                    </div>

                    <div className="space-y-12 max-w-lg">
                        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                            Streamline your retail operations with BizWerks.
                        </h1>

                        <div className="grid gap-8">
                            <div className="flex gap-4">
                                <div className="p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 shrink-0 h-fit">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Real-time Analytics</h3>
                                    <p className="text-primary-foreground/80">Monitor your sales, inventory, and expenses as they happen with powerful built-in reporting.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 shrink-0 h-fit">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Staff Management</h3>
                                    <p className="text-primary-foreground/80">Easily manage user roles and store access for your entire team across multiple locations.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 shrink-0 h-fit">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Enterprise-grade Security</h3>
                                    <p className="text-primary-foreground/80">Your data is safe and secure with our modern authentication systems and persistent backups.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-primary-foreground/60">
                    © 2026 BizWerks Retail Inc. All rights reserved.
                </div>

                {/* Decorative background elements */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary-foreground/5 rounded-full blur-2xl" />
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-background">
                <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:hidden flex items-center gap-2 text-2xl font-bold mb-8">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                        <span>BizWerks POS for Retail Stores</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground">Log in to manage your store and operations.</p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
