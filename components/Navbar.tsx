"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Brain,
  Camera,
  MessageCircle,
  Gamepad2,
  Grid,
} from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Quiz", href: "/quiz", icon: Brain },
    { name: "Screenshot Guesser", href: "/guess-episode", icon: Camera },
    { name: "Quote Guesser", href: "/guess-quote", icon: MessageCircle },
    { name: "Island Adventure", href: "/game", icon: Gamepad2 },
    { name: "Level Editor", href: "/level-editor", icon: Grid },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl">🏝️</span>
            <span className="text-xl font-bold text-white">The LOST Quiz</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gray-900 border-gray-800 w-72"
              >
                <SheetHeader className="pb-6">
                  <SheetTitle className="text-white text-left flex items-center space-x-2">
                    <span className="text-2xl">🏝️</span>
                    <span>The LOST Quiz</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-3 rounded-lg hover:bg-gray-800"
                        onClick={() => setIsOpen(false)}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
