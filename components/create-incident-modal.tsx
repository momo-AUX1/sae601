"use client"

import type React from "react"

import { useState } from "react"
import { X, Camera, MapPin, AlertTriangle, Upload } from "lucide-react"

interface CreateIncidentModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateIncidentModal({ isOpen, onClose }: CreateIncidentModalProps) {
    const [formData, setFormData] = useState({
        categorie: "",
        message: "",
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const categories = ["Pollution", "Infrastructure", "Déchets", "Énergie", "Transport"]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("access_token")
            const formDataToSend = new FormData()
            formDataToSend.append("categorie", formData.categorie)
            formDataToSend.append("message", formData.message)

            if (selectedFile) {
                formDataToSend.append("photo", selectedFile)
            }

            const response = await fetch("https://test.nanodata.cloud/api/submit_signalement", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            })

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    onClose()
                    setFormData({ categorie: "", message: "" })
                    setSelectedFile(null)
                }, 2000)
            } else {
                throw new Error("Failed to submit incident")
            }
        } catch (error) {
            console.error("Error submitting incident:", error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-green-600" />
                        Signaler un incident
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {success && (
                    <div className="p-6 bg-green-50 border-b border-green-200">
                        <div className="flex items-center gap-2 text-green-800 font-semibold">
                            <AlertTriangle className="h-5 w-5" />
                            Incident signalé avec succès !
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Catégorie</label>
                        <select
                            value={formData.categorie}
                            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium"
                            required
                        >
                            <option value="">Sélectionnez une catégorie</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Décrivez l'incident en détail..."
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 font-medium resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Preuve photo (optionnel)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
                            <label htmlFor="photo-upload" className="cursor-pointer">
                                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 font-medium">
                                    {selectedFile ? selectedFile.name : "Cliquez pour télécharger une photo"}
                                </p>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || success}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Upload className="h-4 w-4 animate-spin" />
                                Soumission...
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-4 w-4" />
                                Signaler un incident
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}