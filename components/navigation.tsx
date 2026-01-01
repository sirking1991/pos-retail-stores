"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ShoppingCart, Package, DollarSign, BarChart3, BoxIcon, LogOut, Store, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [storeName, setStoreName] = useState<string | null>(null)
  const [accountName, setAccountName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Don't show navigation on login/register pages
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/register/success"

  useEffect(() => {
    async function checkRole() {
      if (isAuthPage) return
      try {
        const res = await fetch("/api/auth/session")
        if (res.ok) {
          const data = await res.json()
          setIsAdmin(data.role === "admin")
          setStoreName(data.storeName)
          setAccountName(data.accountName)
        }
      } catch (err) {
        console.error("Failed to check role")
      }
    }
    checkRole()
  }, [pathname, isAuthPage])

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) {
      toast.success("Logged out successfully")
      router.push("/login")
      router.refresh()
    }
  }

  if (isAuthPage) return null

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/sales", label: "Sales", icon: ShoppingCart },
    { href: "/purchases", label: "Purchases", icon: Package },
    { href: "/expenses", label: "Expenses", icon: DollarSign },
    { href: "/inventory", label: "Inventory", icon: BoxIcon },
    { href: "/reports", label: "Reports", icon: BarChart3 },
  ]

  if (isAdmin) {
    links.push({ href: "/admin/stores", label: "Stores", icon: Store })
    links.push({ href: "/admin/users", label: "Users", icon: User })
  }

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              {accountName && storeName ? `${accountName} | ${storeName}` : "Simple Retail POS"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        <div className="flex overflow-x-auto gap-1 pb-3 -mx-4 px-4">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[80px] py-3 px-4 rounded-lg text-xs font-medium transition-colors",
                  isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10",
                )}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
