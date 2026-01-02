import { RegisterForm } from "@/components/register-form"
import { ShoppingBag, Star, Zap, Globe } from "lucide-react"

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen bg-transparent">
            {/* Left Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-background order-2 lg:order-1">
                <div className="w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:hidden flex items-center gap-2 text-2xl font-bold mb-8">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                        <span>BizWerks POS for Retail Stores</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
                        <p className="text-muted-foreground">Join thousands of businesses streamlining their operations.</p>
                    </div>
                    <RegisterForm />
                </div>
            </div>

            {/* Right Side: Marketing Section */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden order-1 lg:order-2">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-2xl font-bold mb-12">
                        <ShoppingBag className="w-8 h-8" />
                        <span>BizWerks POS for Retail Stores</span>
                    </div>

                    <div className="space-y-12 max-w-lg">
                        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                            Scale your business with confidence.
                        </h1>

                        <div className="grid gap-8">
                            <div className="flex gap-4">
                                <div className="p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 shrink-0 h-fit">
                                    <Star className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Premium Features</h3>
                                    <p className="text-primary-foreground/80">Access advanced inventory tracking, automated restocking alerts, and more.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 shrink-0 h-fit">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Lightning Fast</h3>
                                    <p className="text-primary-foreground/80">Our cloud-native platform ensures your POS is always responsive and ready for the next customer.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 shrink-0 h-fit">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Multi-location Ready</h3>
                                    <p className="text-primary-foreground/80">Whether you have one store or a hundred, BizWerks scales with your growth effortlessly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-primary-foreground/60">
                    © 2026 BizWerks Retail Inc. All rights reserved.
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-24 -right-24 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/2 -left-24 w-64 h-64 bg-primary-foreground/5 rounded-full blur-2xl" />
            </div>
        </div>
    )
}
