"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Mail, MapPin, Lock, Bell, Trash2, Save, CheckCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserData {
  email: string
  nom: string
  adresse: string
}

interface ApiResponse {
  success: boolean
  message?: string
  data?: any
}

export default function Settings() {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    nom: "",
    adresse: "",
  })
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [pushToken, setPushToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

  const API_BASE_URL = "https://test.nanodata.cloud"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const userId = localStorage.getItem("user_id")
        
        if (!token || !userId) {
          router.push("/login")
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/user`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUserData({
            email: data.email || "",
            nom: data.nom || "",
            adresse: data.adresse || "",
          })
        } else if (response.status === 401) {
          localStorage.clear()
          router.push("/login")
        } else {
          showMessage("error", "Impossible de charger les données utilisateur")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        showMessage("error", "Erreur de connexion au serveur")
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 5000)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userData.email,
          nom: userData.nom,
          adresse: userData.adresse,
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        showMessage("success", "Profil mis à jour avec succès !")
      } else if (response.status === 401) {
        localStorage.clear()
        router.push("/login")
      } else {
        showMessage("error", data.message || "Échec de la mise à jour du profil")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      showMessage("error", "Erreur réseau. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwords.new_password !== passwords.confirm_password) {
      showMessage("error", "Les nouveaux mots de passe ne correspondent pas")
      return
    }

    if (passwords.new_password.length < 6) {
      showMessage("error", "Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwords.old_password,
          new_password: passwords.new_password,
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        showMessage("success", "Mot de passe modifié avec succès !")
        setPasswords({ old_password: "", new_password: "", confirm_password: "" })
      } else if (response.status === 401) {
        localStorage.clear()
        router.push("/login")
      } else {
        showMessage("error", data.message || "Échec du changement de mot de passe")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      showMessage("error", "Erreur réseau. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        showMessage("success", "Compte supprimé avec succès")
        localStorage.clear()
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else if (response.status === 401) {
        localStorage.clear()
        router.push("/login")
      } else {
        const data: ApiResponse = await response.json()
        showMessage("error", data.message || "Échec de la suppression du compte")
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      showMessage("error", "Erreur réseau. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {message.text && (
        <div
          className={`rounded-xl p-4 flex items-center gap-3 shadow-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <User className="h-6 w-6 text-green-600" />
          Informations du profil
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Nom complet</label>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={userData.nom}
                onChange={(e) => setUserData({ ...userData, nom: e.target.value })}
                className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Adresse</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={userData.adresse}
                onChange={(e) => setUserData({ ...userData, adresse: e.target.value })}
                className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Lock className="h-6 w-6 text-green-600" />
          Changer le mot de passe
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Mot de passe actuel</label>
            <input
              type="password"
              value={passwords.old_password}
              onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={passwords.new_password}
              onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium"
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={passwords.confirm_password}
              onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium"
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            <Lock className="h-5 w-5" />
            {isLoading ? "Changement..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
        <h2 className="text-2xl font-bold text-red-600 mb-8 flex items-center gap-3">
          <Trash2 className="h-6 w-6" />
          Zone de danger
        </h2>

        <div className="space-y-6">
          <p className="text-gray-700 font-medium">
            Une fois votre compte supprimé, il n'y a pas de retour en arrière. Veuillez en être certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              Supprimer le compte
            </button>
          ) : (
            <div className="space-y-4 p-6 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-800 font-semibold">Êtes-vous absolument sûr ?</p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Suppression..." : "Oui, supprimer le compte"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}