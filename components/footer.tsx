import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Leaf className="h-8 w-8 text-green-400" />
                            <h3 className="text-2xl font-bold text-green-400">OUTREPIE</h3>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md">
                            Construire la ville écologique du futur où la durabilité rencontre l'innovation. Rejoignez-nous pour créer un monde plus vert et plus intelligent pour les générations à venir.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                                    Accueil
                                </a>
                            </li>
                            <li>
                                <a href="/auth" className="text-gray-300 hover:text-green-400 transition-colors">
                                    S'inscrire
                                </a>
                            </li>
                            <li>
                                <a href="/main" className="text-gray-300 hover:text-green-400 transition-colors">
                                    Tableau de bord
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                                    À propos
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-green-400" />
                                <span className="text-gray-300">hello@OUTREPIE.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-green-400" />
                                <span className="text-gray-300">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-green-400" />
                                <span className="text-gray-300">Vallée Verte, Ville du Futur</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 OUTREPIE. Tous droits réservés. Construisons ensemble un avenir durable.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                            Politique de confidentialité
                        </a>
                        <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                            Conditions d'utilisation
                        </a>
                        <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                            Politique de cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
