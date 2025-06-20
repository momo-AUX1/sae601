"use client"

import { useState, useEffect } from "react"
import { MapPin, Zap, Leaf, Users, ArrowRight } from "lucide-react"
import Image from "next/image";

import dynamic from "next/dynamic"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Timeline from "@/components/timeline"
import {Marker, Popup} from "react-leaflet";



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
      <div className="min-h-screen bg-gradient-to-br from-[#C0DDE6] to-[#EFF7FA] relative overflow-hidden font-syne">
        {/* Navigation */}
        <Navbar />

        {/* Background Decorative Elements */}

        {/* Illustration + Slogan */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between pt-10 md:pt-10">
          {/* Texte en premier sur mobile */}
          <div className="md:w-1/2 text-left mb-10 md:mb-0 order-1 md:order-none">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Le futur des <br /> transports en ville
            </h1>
          </div>

          {/* Vidéo */}
          <div className="md:w-1/2 relative order-2 md:order-none">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto max-h-[1000px]"
            >
              <source src="/bg-video.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </main>


        {/* Decorative Lines (optional SVG background) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* You can add SVG or CSS gradients here for decor */}
        </div>

      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" id="propos">Construire demain, aujourd'hui</h2>
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
                Soucieuse de l’environnement et de ses habitants, Outrepie s’engage vers une transition écologique au long terme. Transports doux, énergies renouvelables... des projets sont en cours pour améliorer au long terme la qualité de vie des citoyens.              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Infrastructure intelligente</h3>
              <p className="text-gray-600">
                Des systèmes de gestion connectés pour fluidifier la circulation, réduire le temps de trajet et accompagner les cyclistes du début à la fin de leur parcours.              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Confort de vie & engagement citoyen</h3>
              <p className="text-gray-600">
                Conçue pour les habitants, avec de
                nombreux espaces verts, des lieux de vie collaboratifs et des solutions accessibles à tous. Outrepie invite ses citoyens à être acteurs du changement et à  faire entendre leur voix.              </p>
            </div>
          </div>
        </div>
      </section>

        <section id="map-section" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Planifiez votre OUTREPIE</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Utilisez notre carte interactive pour explorer la ville, signaler des problèmes, repérer les vélos disponibles et visualiser les zones à forte affluence.
              </p>

              {/* Légende */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Ajout de points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Itinéraires proposés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/pictos/bikes.png" alt="Vélo dispo" width={16} height={16} />
                  <span>Vélos disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/pictos/warning.png" alt="Problème signalé" width={16} height={16} />
                  <span>Problème signalé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                  <span>Circulation fluide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                  <span>Circulation modérée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                  <span>Forte affluence</span>
                </div>
              </div>
            </div>

            {/* Carte */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden relative ">
              {isMapReady && <InteractiveMap />}

            </div>
            <br/>
            <div className="flex justify-end mb-4">
              <a
                  href="/main/"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition"
              >
                Signalement d'incidents
              </a>
            </div>
          </div>
        </section>

        <Timeline />


        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à rejoindre le futur ?</h2>
          <p className="text-xl text-green-100 mb-8">
            Faites partie de la première véritable ville intelligente et durable.
            <br/>
            Venez visiter OUTREPIE.
          </p>

        </div>
      </section>
        <div className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {[
            { top: "-50px", left: "0px", height: 300 },
            { top: "80px", left: "-100px", height: 600 },
            { top: "-100px", left: "300px", height: 250 },
            { top: "80px", left: "30px", height: 260 },
            { top: "-70px", left: "500px", height: 350 },

          ].map((bar, i) => (
              <div
                  key={i}
                  className="absolute w-3 bg-green-600 rounded-full opacity-90"
                  style={{
                    top: bar.top,
                    left: bar.left,
                    height: `${bar.height}px`,
                    transform: 'rotate(-45deg)',
                    backgroundColor: '#31540F',
                  }}
              />
          ))}
        </div>






        <Footer />
    </div>
  )
}
