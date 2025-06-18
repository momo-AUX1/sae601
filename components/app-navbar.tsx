"use client"

import { useState } from "react"
import { Leaf, User, AlertTriangle, Settings, Menu, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface AppNavbarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

export default function AppNavbar({ activeTab, setActiveTab }: AppNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_id")
        router.push("/")
    }

    const navItems = [
        { id: "account", name: "Compte", icon: User },
        { id: "incidents", name: "Incidents", icon: AlertTriangle },
        { id: "settings", name: "Paramètres", icon: Settings },
    ]

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <Leaf className="h-8 w-8 text-green-600" />
                        <span className="text-xl font-bold text-green-700">Greenda</span>
                        <span className="text-sm text-gray-500 ml-2 font-medium">Tableau de bord</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        activeTab === item.id
                                            ? "bg-green-100 text-green-700 shadow-sm"
                                            : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </button>
                            )
                        })}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen ? "max-h-80 opacity-100 visible" : "max-h-0 opacity-0 invisible overflow-hidden"
                    }`}
                >
                    <div className="py-4 space-y-2 border-t border-green-100">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id)
                                        setIsMenuOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        activeTab === item.id
                                            ? "bg-green-100 text-green-700"
                                            : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </button>
                            )
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
