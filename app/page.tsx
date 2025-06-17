"use client"

import { useState, useEffect } from "react"
import { MapPin, Zap, Leaf, Users, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import Footer from "../components/footer"

const InteractiveMap = dynamic(() => import("../components/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Chargement de la carte...</div>
    </div>
  ),
})

export default function LandingPage() {
  const [isMapReady, setIsMapReady] = useState(false)

  useEffect(() => {
    setIsMapReady(true)
  }, [])

  const scrollToMap = () => {
    const mapSection = document.getElementById("map-section")
    mapSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 opacity-40">
          <video 
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
          >
        <source src="/bg-video.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-34 relative z-10">
          <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-green-600 mb-6">OUTREPIE</h1>
        <p className="text-xl md:text-2xl text-gray-800 mb-4">La ville écologique du futur</p>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
          Découvrez une vie urbaine durable où la technologie rencontre la nature. Planifiez, explorez et contribuez à construire la ville intelligente la plus verte de la planète.
        </p> 

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToMap}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <MapPin className="h-5 w-5" />
            Explorer la ville
          </button>
          <a
            href="/main"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-green-700 font-semibold rounded-lg shadow-lg border-2 border-green-200 transition-all duration-200 flex items-center gap-2"
          >
            Commencer
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Construire demain, aujourd'hui</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              OUTREPIE combine urbanisme de pointe et conscience environnementale pour créer la communauté durable idéale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">100% Renouvelable</h3>
              <p className="text-gray-600">
                Alimentée entièrement par des sources d'énergie propre, dont le solaire, l'éolien et des technologies vertes innovantes pour un avenir neutre en carbone.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Infrastructure intelligente</h3>
              <p className="text-gray-600">
                Des systèmes de gestion urbaine pilotés par l'IA optimisent la circulation, la consommation d'énergie et la distribution des ressources pour une efficacité maximale.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">La communauté avant tout</h3>
              <p className="text-gray-600">
                Conçue pour les habitants, avec de nombreux espaces verts, des jardins partagés et des lieux de vie collaboratifs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="map-section" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Planifiez votre OUTREPIE</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Utilisez notre carte interactive pour explorer la ville, ajouter des points d'intérêt et mettre en avant les itinéraires importants. Cliquez n'importe où pour ajouter des marqueurs et planifier votre ville durable idéale.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Cliquez pour ajouter des points</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Tracez pour mettre en avant les itinéraires</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">{isMapReady && <InteractiveMap />}</div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à rejoindre le futur ?</h2>
          <p className="text-xl text-green-100 mb-8">
            Faites partie de la première véritable ville intelligente et durable. Inscrivez-vous dès aujourd'hui et aidez-nous à construire OUTREPIE ensemble.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-green-700 font-semibold rounded-lg shadow-lg transition-all duration-200"
            >
              Inscrivez-vous
            </a>
            <a
              href="/main"
              className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-lg border-2 border-white transition-all duration-200"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
