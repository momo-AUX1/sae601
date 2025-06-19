//@ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface DonneeMarqueur {
    id: string
    position: [number, number]
    titre: string
}

interface DonneeItineraire {
    id: string
    positions: [number, number][]
    couleur: string
}
const bikeIcon = new L.Icon({
    iconUrl: '/pictos/bikes.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

<Marker position={[48.8566, 2.3522]} icon={bikeIcon}>
    <Popup>Vélos disponibles ici</Popup>
</Marker>
function EvenementsCarte({
    onAjouterMarqueur,
    onAjouterItineraire,
}: {
    onAjouterMarqueur: (position: [number, number]) => void
    onAjouterItineraire: (positions: [number, number][]) => void
}) {
    const [enDessin, setEnDessin] = useState(false)
    const [itineraireActuel, setItineraireActuel] = useState<[number, number][]>([])

    const map = useMapEvents({
        click(e) {
            if (!enDessin) {
                onAjouterMarqueur([e.latlng.lat, e.latlng.lng])
            }
        },
        keydown(e) {
            if (e.originalEvent.key === "Shift") {
                setEnDessin(true)
                map.dragging.disable()
            }
        },
        keyup(e) {
            if (e.originalEvent.key === "Shift") {
                setEnDessin(false)
                map.dragging.enable()
                if (itineraireActuel.length > 1) {
                    onAjouterItineraire([...itineraireActuel])
                }
                setItineraireActuel([])
            }
        },
        mousemove(e) {
            if (enDessin) {
                setItineraireActuel((prev) => [...prev, [e.latlng.lat, e.latlng.lng]])
            }
        },
    })

    return itineraireActuel.length > 1 ? <Polyline positions={itineraireActuel} color="blue" weight={3} opacity={0.7} /> : null
}

export default function CarteInteractive() {
    const [marqueurs, setMarqueurs] = useState<DonneeMarqueur[]>([])
    const [itineraires, setItineraires] = useState<DonneeItineraire[]>([])
    const [estClient, setEstClient] = useState(false)

    useEffect(() => {
        setEstClient(true)
    }, [])

    const ajouterMarqueur = (position: [number, number]) => {
        const nouveauMarqueur: DonneeMarqueur = {
            id: Date.now().toString(),
            position,
            titre: `Point ${marqueurs.length + 1}`,
        }
        setMarqueurs((prev) => [...prev, nouveauMarqueur])
    }

    const ajouterItineraire = (positions: [number, number][]) => {
        const nouvelItineraire: DonneeItineraire = {
            id: Date.now().toString(),
            positions,
            couleur: `hsl(${Math.random() * 360}, 70%, 50%)`,
        }
        setItineraires((prev) => [...prev, nouvelItineraire])
    }

    const toutEffacer = () => {
        setMarqueurs([])
        setItineraires([])
    }

    if (!estClient) {
        return (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Chargement de la carte...</div>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Contrôles de la carte</div>
                <div className="text-xs text-gray-500 space-y-1">
                    <div>• Cliquez pour ajouter des points</div>
                    <div>• Shift + la souris pour dessiner des itinéraires</div>
                </div>
                <button
                    onClick={toutEffacer}
                    className="w-full px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                >
                    Tout effacer
                </button>
                <div className="text-xs text-gray-500 pt-2 border-t">
                    <div>Points : {marqueurs.length}</div>
                    <div>Itinéraires : {itineraires.length}</div>
                </div>
            </div>

            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                style={{ height: "500px", width: "100%" }}
                className="rounded-lg"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <EvenementsCarte onAjouterMarqueur={ajouterMarqueur} onAjouterItineraire={ajouterItineraire} />

                {marqueurs.map((marqueur) => (
                    <Marker key={marqueur.id} position={marqueur.position}>
                        <Popup>
                            <div className="text-center">
                                <div className="font-semibold text-green-700">{marqueur.titre}</div>
                                <div className="text-sm text-gray-500">
                                    {marqueur.position[0].toFixed(4)}, {marqueur.position[1].toFixed(4)}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {itineraires.map((itineraire) => (
                    <Polyline key={itineraire.id} positions={itineraire.positions} color={itineraire.couleur} weight={4} opacity={0.8} />
                ))}
            </MapContainer>
        </div>
    )
}
