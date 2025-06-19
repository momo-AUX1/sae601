'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

const projects = [
    {
        id: 1,
        top: "58%",
        left: "12%",
        topMobile: "58%",
        leftMobile: "12%",
        icon: "/pictos/picto1.png",
        description: "2022 : Installation de bornes de recharges électriques gratuites pour vélos sur les parkings publics.",
    },
    {
        id: 2,
        top: "25%",
        left: "20%",
        topMobile: "35%",
        leftMobile: "20%",
        icon: "/pictos/picto2.png",
        description: "2024 : Transformation des routes pour ajouter des pistes cyclables sur 85% du centre-ville.",
    },
    {
        id: 3,
        top: "75%",
        left: "50%",
        topMobile: "60%",
        leftMobile: "50%",
        icon: "/pictos/picto3.png",
        description: "2025 : Installation de bornes de réparation pour vélos avec numéro d’urgence.",
    },
    {
        id: 4,
        top: "25%",
        left: "80%",
        topMobile: "35%",
        leftMobile: "80%",
        icon: "/pictos/picto4.png",
        description: "2028 : Passage aux feux connectés sur les routes principales permettant de fluidifier l’intermodalité.",
    },
    {
        id: 5,
        top: "58%",
        left: "88%",
        topMobile: "58%",
        leftMobile: "88%",
        icon: "/pictos/picto5.png",
        description: "2033 : Ajout de dalles piézoélectriques sur les pistes cyclables pour transformer la pression mécanique en électricité.",
    },
];

export default function Timeline() {
    const [hovered, setHovered] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <section className="w-full my-20 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1D2A62]">
                Votre ville évolue
            </h2>

            <div className="relative w-full h-[400px] md:h-[500px] my-20">
                {/* Frise SVG */}
                <Image
                    src="/pictos/BikeLane.svg"
                    alt="Frise Chronologique"
                    fill
                    className="object-contain"
                    quality={90}
                    priority
                />

                {/* Pictos interactifs */}
                {projects.map((proj) => (
                    <div
                        key={proj.id}
                        className="absolute cursor-pointer group"
                        style={{
                            top: isMobile ? proj.topMobile : proj.top,
                            left: isMobile ? proj.leftMobile : proj.left,
                            transform: "translate(-50%, -50%)",
                        }}
                        onMouseEnter={() => setHovered(proj.id)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <Image src={proj.icon} alt={`Projet ${proj.id}`} width={48} height={48} />

                        {/* Tooltip */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] text-sm text-black bg-white px-4 py-3 rounded-xl shadow-md transition-opacity duration-300 z-10 ${
                                hovered === proj.id ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                        >
                            {proj.description}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
