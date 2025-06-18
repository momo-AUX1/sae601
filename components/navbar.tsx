"use client"

import { useState } from "react"
import { Leaf, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const scrollToPropos = () => {
    const mapSection = document.getElementById("propos")
    mapSection?.scrollIntoView({ behavior: "smooth" })
    closeMenu()
    window.location.reload()
  }

  const navLinks = [
    { name: "Accueil", href: "/", isButton: false },
    { name: "À propos", href: "#", isButton: false },
    { name: "Signalement", href: "/main", isButton: false },
    { name: "Contact", href: "#", isButton: false },
    { name: "Connexion", href: "/auth", isButton: true },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo*/}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.svg" 
              alt="OutrePie Logo" 
              width={128} 
              height={128}
              className="text-green-600"
            />
            <span className="text-xl font-bold text-green-700"> </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={link.name === "À propos" ? scrollToPropos : closeMenu}
                className={
                  link.isButton
                    ? "px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    : "text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all after:duration-200 hover:after:w-full"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={link.name == "À propos" ? scrollToPropos : closeMenu}
                className={
                  link.isButton
                    ? "block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm"
                    : "block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-all duration-200"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
