"use client"
import { useState, useEffect } from "react"
import { User, Mail, MapPin, Calendar, AlertTriangle, Bell, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserData {
    id: number
    email: string
    nom: string
    adresse: string
}

interface Incident {
    id: number
    categorie: string
    message: string
    date: string
    status: boolean
    photo_path?: string
    user_id: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://test.nanodata.cloud'

export default function Account() {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [userIncidents, setUserIncidents] = useState<Incident[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchUserData()
        fetchUserIncidents()
    }, [])

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

    const fetchUserData = async () => {
        try {
            const headers = getAuthHeaders()
            if (!headers) return

            const response = await fetch(`${API_BASE_URL}/api/user`, {
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
            setUserData(data)
        } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur :", error)
            setError("Impossible de charger les informations utilisateur")
        }
    }

    const fetchUserIncidents = async () => {
        try {
            const headers = getAuthHeaders()
            if (!headers) return

            const response = await fetch(`${API_BASE_URL}/api/user/signalements`, {
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
            setUserIncidents(data)
        } catch (error) {
            console.error("Erreur lors de la récupération des incidents utilisateur :", error)
            setError("Impossible de charger les incidents")
        } finally {
            setIsLoading(false)
        }
    }

    const handleIncidentClick = (incidentId: number) => {
        router.push(`/incident/${incidentId}`)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-800 font-medium">Chargement des informations du compte...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-red-600 font-medium">{error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {showNewsletterSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">Abonnement à la newsletter réussi !</span>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{userData?.nom}</h1>
                        <p className="text-gray-600 text-lg">Membre de la communauté OutrePie</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-800 font-medium">{userData?.email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-800 font-medium">{userData?.adresse}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-green-600" />
                    Vos incidents ({userIncidents.length})
                </h2>

                {userIncidents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium">Aucun incident signalé pour le moment</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userIncidents.map((incident) => (
                            <div
                                key={incident.id}
                                onClick={() => handleIncidentClick(incident.id)}
                                className="border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                                                {incident.categorie}
                                            </span>
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                                                    incident.status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {incident.status ? "Résolu" : "En attente"}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-semibold text-lg mb-3">{incident.message}</p>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">{formatDate(incident.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}