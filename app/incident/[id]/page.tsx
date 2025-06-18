"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, User, Camera, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Incident {
  id: number
  categorie: string
  message: string
  date: string
  status: boolean
  id_user: number
  photo_path?: string
}

export default function IncidentDetail() {
  const [incident, setIncident] = useState<Incident | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string

  useEffect(() => {
    fetchIncident()
  }, [incidentId])

  const fetchIncident = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`https://test.nanodata.cloud/api/signalement/${incidentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIncident(data)
        
        const userResponse = await fetch(`https://test.nanodata.cloud/api/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserInfo(userData)
        }
      } else {
        //router.push("/main")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'incident :", error)
      //router.push("/main")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!incident) return

    setIsUpdating(true)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`https://test.nanodata.cloud/api/signalement/${incident.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !incident.status }),
      })

      if (response.ok) {
        setIncident({ ...incident, status: !incident.status })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de l'incident :", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Pollution: "bg-red-100 text-red-700 border-red-200",
      Infrastructure: "bg-blue-100 text-blue-700 border-blue-200",
      Déchets: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Énergie: "bg-green-100 text-green-700 border-green-200",
      Transport: "bg-purple-100 text-purple-700 border-purple-200",
    }
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-green-600 text-lg">Chargement des détails de l'incident...</div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Incident non trouvé</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux incidents
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-lg border ${getCategoryColor(incident.categorie)}`}
                  >
                    {incident.categorie}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${
                      incident.status
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    {incident.status ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Résolu
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        En attente
                      </div>
                    )}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Incident n°{incident.id}</h1>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(incident.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {userInfo ? userInfo.nom : `Utilisateur n°${incident.id_user}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {userInfo ? userInfo.adresse : "Communauté Greenda"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 ${
                  incident.status
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                    : "bg-green-100 hover:bg-green-200 text-green-700"
                }`}
              >
                {isUpdating ? "Mise à jour..." : incident.status ? "Marquer comme en attente" : "Marquer comme résolu"}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{incident.message}</p>
              </div>
              {incident.photo_path && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Preuve photo
                  </h2>
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`https://test.nanodata.cloud/${incident.photo_path}`}
                      alt="Photo de l'incident"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Informations supplémentaires</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">ID de l'incident :</span> n°{incident.id}
                </div>
                <div>
                  <span className="font-medium">Catégorie :</span> {incident.categorie}
                </div>
                <div>
                  <span className="font-medium">Signalé par :</span> {userInfo ? userInfo.nom : `Utilisateur n°${incident.id_user}`}
                </div>
                <div>
                  <span className="font-medium">Statut actuel :</span> {incident.status ? "Résolu" : "En attente"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}