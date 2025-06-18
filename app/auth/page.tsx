"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Eye, EyeOff, Loader2, User, Mail, Lock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation";


interface LoginData {
    email: string
    mdp: string
}

interface RegisterData {
    email: string
    mdp: string
    nom: string
    adresse: string
}

interface AuthResponse {
    access_token?: string
    refresh_token?: string
    user_id?: number
    message?: string
}

export default function AuthForm() {
    const [activeTab, setActiveTab] = useState("login")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter();


    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        mdp: "",
    })

    const [registerData, setRegisterData] = useState<RegisterData>({
        email: "",
        mdp: "",
        nom: "",
        adresse: "",
    })

    const API_BASE_URL = "https://test.nanodata.cloud"

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const data: AuthResponse = await response.json();

            if (response.ok) {
                if (data.access_token) {
                    localStorage.setItem("access_token", data.access_token);
                }
                if (data.refresh_token) {
                    localStorage.setItem("refresh_token", data.refresh_token);
                }
                if (data.user_id) {
                    localStorage.setItem("user_id", data.user_id.toString());
                }

                setSuccess("Connexion réussie ! Bienvenue.");
                setLoginData({ email: "", mdp: "" });
                // Redirection vers la page d'infos du compte
                router.push("/userAccount");
                return;
            } else {
                setError(data.message || "Échec de la connexion");
            }
        } catch (err) {
            setError("Erreur réseau. Veuillez vérifier votre connexion et réessayer.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        if (!registerData.email || !registerData.mdp || !registerData.nom || !registerData.adresse) {
            setError("Tous les champs sont obligatoires")
            setIsLoading(false)
            return
        }

        if (registerData.mdp.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            })

            const data: AuthResponse = await response.json()

            if (response.ok) {
                setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.")
                setRegisterData({ email: "", mdp: "", nom: "", adresse: "" })
                setActiveTab("login")
            } else {
                setError(data.message || "Échec de l'inscription")
            }
        } catch (err) {
            setError("Erreur réseau. Veuillez vérifier votre connexion et réessayer.")
            console.error("Registration error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLoginData((prev) => ({ ...prev, [name]: value }))
    }

    const handleRegisterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRegisterData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-green-700">OUTREPIE</h2>
                    <p className="text-gray-600 mt-1">Bienvenue sur votre plateforme de signalement environnemental</p>
                </div>

                <div className="px-6 pb-6">
                    <div className="flex border-b mb-4">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-2 font-medium text-sm ${
                                activeTab === "login"
                                    ? "text-green-600 border-b-2 border-green-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 py-2 font-medium text-sm ${
                                activeTab === "register"
                                    ? "text-green-600 border-b-2 border-green-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Inscription
                        </button>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">{success}</div>
                    )}

                    {activeTab === "login" && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={loginData.email}
                                        onChange={handleLoginInputChange}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
                                    <input
                                        id="login-password"
                                        name="mdp"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Entrez votre mot de passe"
                                        value={loginData.mdp}
                                        onChange={handleLoginInputChange}
                                        className="pl-10 pr-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 h-5 w-5 text-gray-900"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Connexion...
                                    </>
                                ) : (
                                    "Connexion"
                                )}
                            </button>
                        </form>
                    )}

                    {activeTab === "register" && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
                                    <input
                                        id="register-name"
                                        name="nom"
                                        type="text"
                                        placeholder="Jean Dupont"
                                        value={registerData.nom}
                                        onChange={handleRegisterInputChange}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
                                    <input
                                        id="register-email"
                                        name="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={registerData.email}
                                        onChange={handleRegisterInputChange}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Adresse
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
                                    <input
                                        id="register-address"
                                        name="adresse"
                                        type="text"
                                        placeholder="123 Rue Principale, Ville, Pays"
                                        value={registerData.adresse}
                                        onChange={handleRegisterInputChange}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
                                    <input
                                        id="register-password"
                                        name="mdp"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Créer un mot de passe (min. 6 caractères)"
                                        value={registerData.mdp}
                                        onChange={handleRegisterInputChange}
                                        className="pl-10 pr-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                        minLength={6}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 h-5 w-5 text-gray-900"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Création du compte...
                                    </>
                                ) : (
                                    "Créer un compte"
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>En utilisant OUTREPIE, vous acceptez d'aider à protéger notre environnement</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
