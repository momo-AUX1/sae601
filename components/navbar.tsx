"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsLoggedIn(typeof window !== "undefined" && !!localStorage.getItem("access_token"))
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false)
    closeMenu()
    router.push("/")
  }

  const scrollToPropos = () => {
    const mapSection = document.getElementById("propos")
    mapSection?.scrollIntoView({ behavior: "smooth" })
    closeMenu()
    window.location.reload()
  }

  const navLinks = isLoggedIn
    ? [
        { name: "Accueil", href: "/", isButton: false },
        { name: "À propos", href: "#", isButton: false },
        { name: "Compte", href: "/main", isButton: false },
        { name: "Déconnexion", href: "#", isButton: true, onClick: handleLogout },
      ]
    : [
        { name: "Accueil", href: "/", isButton: false },
        { name: "À propos", href: "#", isButton: false },
        { name: "Compte", href: "/main", isButton: false },
        { name: "Connexion", href: "/auth", isButton: true },
      ]

  return (

    <nav className="flex justify-between items-center px-8 py-6 z-20 relative">
      {/* Logo*/}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image
            src="/logo.svg"
            alt="OutrePie Logo"
            width={200}
            height={200}
        />
        <span className="text-xl font-bold text-[#1D2A62]"> </span>
      </Link>
      <div className="hidden md:flex items-center space-x-8">

        <div className="flex  items-center h-16">


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.name === "À propos" ? (
                <button
                  key={link.name}
                  onClick={scrollToPropos}
                  className="text-gray-700 hover:text-[#1D2A62] font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1D2A62] after:transition-all after:duration-200 hover:after:w-full bg-transparent border-none outline-none"
                  type="button"
                >
                  {link.name}
                </button>
              ) : link.name === "Déconnexion" ? (
                <button
                  key={link.name}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#1D2A62] hover:bg-[#5690F9] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  type="button"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className={
                    link.isButton
                      ? "px-4 py-2 bg-[#1D2A62] hover:bg-[#1D2A62] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      : "text-gray-700 hover:text-[#1D2A62] font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1D2A62] after:transition-all after:duration-200 hover:after:w-full"
                  }
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-[#1D2A62] hover:bg-green-50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100 visible" : "max-h-0 opacity-0 invisible overflow-hidden"
          }`}
        >
          <div className="py-4 space-y-3 border-t border-green-100">
            {navLinks.map((link) =>
              link.name === "À propos" ? (
                <button
                  key={link.name}
                  onClick={scrollToPropos}
                  className="block px-4 py-2 text-gray-700 hover:text-[#1D2A62] hover:bg-green-50 rounded-md font-medium transition-all duration-200 w-full text-left bg-transparent border-none outline-none"
                  type="button"
                >
                  {link.name}
                </button>
              ) : link.name === "Déconnexion" ? (
                <button
                  key={link.name}
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-3 bg-[#1D2A62] hover:bg-[#5690F9] text-white font-medium rounded-lg transition-all duration-200 shadow-sm"
                  type="button"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className={
                    link.isButton
                      ? "block w-full text-center px-4 py-3 bg-[#1D2A62] hover:bg-[#1D2A62] text-white font-medium rounded-lg transition-all duration-200 shadow-sm"
                      : "block px-4 py-2 text-gray-700 hover:text-[#1D2A62] hover:bg-green-50 rounded-md font-medium transition-all duration-200"
                  }
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
