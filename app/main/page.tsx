"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import AppNavbar from "../../components/navbar"
import Account from "../../components/accounts"
import Incidents from "../incidents/page"
import Settings from "../../components/settings"
import CreateIncidentModal from "../../components/create-incident-modal"

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState("account")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/auth")
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-green-600 text-lg font-medium">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "account":
        return <Account />
      case "incidents":
        return <Incidents />
      case "settings":
        return <Settings />
      default:
        return <Account />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <AppNavbar/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderActiveTab()}</main>

      {/* Create Incident Modal */}
      <CreateIncidentModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  )
}
