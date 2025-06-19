"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar, MapPin, AlertTriangle, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar";

interface Incident {
    id: number
    categorie: string
    message: string
    date: string
    status: boolean
    user_id: number
    photo_path?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://test.nanodata.cloud'

export default function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const router = useRouter()

    useEffect(() => {
        fetchIncidents()
    }, [])

    useEffect(() => {
        filterIncidents()
    }, [incidents, searchTerm, selectedCategory, selectedStatus])

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access_token")
        if (!token) {
            router.push("/auth")
            return null
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    const fetchIncidents = async () => {
        try {
            const headers = getAuthHeaders()
            if (!headers) return

            const response = await fetch(`${API_BASE_URL}/api/signalements`, {
                method: 'GET',
                headers
            })

            if (response.status === 401) {
                localStorage.removeItem("access_token")
                localStorage.removeItem("user_id")
                router.push("/auth")
                return
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            const transformedIncidents = data.map((incident: any) => ({
                id: incident.id,
                categorie: incident.categorie,
                message: incident.message,
                date: incident.date,
                status: incident.status,
                user_id: incident.user_id,
                photo_path: incident.photo_path
            }))

            setIncidents(transformedIncidents)
        } catch (error) {
            console.error("Erreur lors de la récupération des incidents :", error)
            setError("Impossible de charger les incidents")
        } finally {
            setIsLoading(false)
        }
    }

    const filterIncidents = () => {
        let filtered = incidents

        if (searchTerm) {
            filtered = filtered.filter(
                (incident) =>
                    incident.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    incident.categorie.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter((incident) => incident.categorie === selectedCategory)
        }

        if (selectedStatus !== "all") {
            filtered = filtered.filter((incident) => (selectedStatus === "resolved" ? incident.status : !incident.status))
        }

        setFilteredIncidents(filtered)
    }

    const handleIncidentClick = (incidentId: number) => {
        router.push(`/incident/${incidentId}`)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            Pollution: "bg-red-100 text-red-800",
            Infrastructure: "bg-blue-100 text-blue-800",
            Waste: "bg-yellow-100 text-yellow-800",
            Energy: "bg-green-100 text-green-800",
            Transportation: "bg-purple-100 text-purple-800",
        }
        return colors[category] || "bg-gray-100 text-gray-800"
    }

    const getAvailableCategories = () => {
        const uniqueCategories = [...new Set(incidents.map(incident => incident.categorie))]
        return ["all", ...uniqueCategories]
    }

    // === DESIGN STARTS HERE ===
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pb-16">
            <Navbar/>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-8 w-8 text-green-600" />
                        Incidents Communautaires
                        <span className="ml-2 text-green-600 text-xl">({filteredIncidents.length})</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Retrouvez ici tous les signalements communautaires de la ville d’Outrepie
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-10 px-6 py-8">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Rechercher des incidents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium bg-gray-50"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="pl-12 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium bg-gray-50"
                            >
                                {getAvailableCategories().map((category) => (
                                    <option key={category} value={category}>
                                        {category === "all" ? "Toutes les catégories" : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium bg-gray-50"
                            >
                                {["all", "pending", "resolved"].map((status) => (
                                    <option key={status} value={status}>
                                        {status === "all"
                                            ? "Tous les statuts"
                                            : status === "pending"
                                                ? "En attente"
                                                : "Résolu"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Incidents List */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-600" />
                            Tous les incidents signalés
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredIncidents.length === 1
                                ? "1 incident trouvé"
                                : `${filteredIncidents.length} incidents trouvés`}
                        </p>
                    </div>
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                                <span className="ml-3 text-gray-600">Chargement des incidents...</span>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center py-8">
                                <AlertTriangle className="h-8 w-8 text-red-400 mr-2" />
                                <div className="text-red-600 font-medium">{error}</div>
                            </div>
                        ) : filteredIncidents.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg font-medium">
                                    {incidents.length === 0
                                        ? "Aucun incident signalé pour le moment"
                                        : "Aucun incident trouvé correspondant à vos critères"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredIncidents.map((incident) => (
                                    <div
                                        key={incident.id}
                                        onClick={() => handleIncidentClick(incident.id)}
                                        className="border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-tr from-white via-blue-50 to-green-50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(incident.categorie)}`}
                                                    >
                                                        {incident.categorie}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            incident.status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {incident.status ? "Résolu" : "En attente"}
                                                    </span>
                                                    {incident.photo_path && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            📷 Photo
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-900 font-semibold text-lg mb-3 line-clamp-2">{incident.message}</p>
                                                <div className="flex items-center gap-6 text-xs text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="font-medium">{formatDate(incident.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="font-medium">Incident n°{incident.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-green-600 font-semibold">
                                                <Eye className="h-5 w-5" />
                                                <span>Voir</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
