"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ShoppingCart, Package, DollarSign, BarChart3, BoxIcon } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/sales", label: "Sales", icon: ShoppingCart },
    { href: "/purchases", label: "Purchases", icon: Package },
    { href: "/expenses", label: "Expenses", icon: DollarSign },
    { href: "/inventory", label: "Inventory", icon: BoxIcon },
    { href: "/reports", label: "Reports", icon: BarChart3 },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold">Simple Retail POS</h1>
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
