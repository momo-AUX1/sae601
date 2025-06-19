'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, MapPin, LogOut, Settings, Shield, Bell, AlertTriangle, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import CreateIncidentModal from "../components/create-incident-modal"

interface UserInfo {
    id: number;
    email: string;
    nom: string;
    adresse: string;
}

interface Signalement {
    id: number;
    titre: string;
    description: string;
    statut: string; // Now required
    date_creation: string;
    date_modification?: string;
    categorie: string; // Add category field
}

const API_BASE_URL = "https://test.nanodata.cloud";

const UserAccountPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [signalements, setSignalements] = useState<Signalement[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSignalements, setLoadingSignalements] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false)

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        if (!token) {
            router.push('/auth');
            return;
        }

        fetch(`${API_BASE_URL}/api/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (res.status === 401 || res.status === 403) {
                    router.push('/auth');
                } else if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    loadSignalements(token);
                } else {
                    router.push('/auth');
                }
            })
            .catch(() => {
                router.push('/auth');
            })
            .finally(() => setLoading(false));
    }, [router]);

    const loadSignalements = async (token: string) => {
        setLoadingSignalements(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/signalements`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                // Transform backend data to frontend format
                const transformedData = data.map((s: any) => ({
                    id: s.id,
                    titre: s.categorie, // Use category as title
                    description: s.message,
                    statut: s.status ? 'resolu' : 'en_cours', // Convert boolean to string
                    date_creation: new Date(s.date).toISOString(), // Ensure ISO format
                    categorie: s.categorie // Add category
                }));
                setSignalements(transformedData);
            }
        } catch (error) {
            console.error('Error loading signalements:', error);
        } finally {
            setLoadingSignalements(false);
        }
    };

    const getStatusIcon = (statut?: string) => { // Accepte string | undefined
        if (!statut) return <AlertCircle size={16} className="text-gray-600" />;

        switch (statut.toLowerCase()) {
            case 'en_cours':
                return <Clock size={16} className="text-yellow-600" />;
            case 'resolu':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'ferme':
                return <XCircle size={16} className="text-red-600" />;
            default:
                return <AlertCircle size={16} className="text-gray-600" />;
        }
    };

    const getStatusColor = (statut?: string) => { // Accepte string | undefined
        if (!statut) return 'bg-gray-100 text-gray-800';

        switch (statut.toLowerCase()) {
            case 'en_cours':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolu':
                return 'bg-green-100 text-green-800';
            case 'ferme':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        router.push('/auth');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-green-800 text-lg font-semibold">Chargement de votre profil...</div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Bonjour, {user.nom} 👋
                    </h2>
                    <p className="text-lg text-gray-600">
                        Gérez votre compte et vos préférences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-8">
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <User size={32} className="text-white" />
                                    </div>
                                    <div className="text-white">
                                        <h3 className="text-2xl font-bold">{user.nom}</h3>
                                        <p className="text-green-100">Membre OUTREPIE</p>
                                        <p className="text-sm text-green-100 mt-1">ID: {user.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h4 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h4>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Adresse email</p>
                                            <p className="text-gray-600 break-all">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} className="text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Adresse</p>
                                            <p className="text-gray-600">{user.adresse}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-8">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-orange-600" />
                                    Historique des signalements
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">Vos incidents signalés et leur statut</p>
                            </div>

                            <div className="p-6">
                                {loadingSignalements ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                                        <span className="ml-3 text-gray-600">Chargement des signalements...</span>
                                    </div>
                                ) : signalements.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
                                         <p className="text-gray-500 text-lg">Aucun signalement trouvé</p>
                                        <p className="text-gray-400 text-sm mt-1">Vous n'avez encore signalé aucun incident</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {signalements.map((signalement) => (
                                            <div key={signalement.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors" onClick={() => router.push(`/incident/${signalement.id}`)}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h5 className="font-semibold text-gray-900">{signalement.titre}</h5>
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(signalement.statut)}`}>
                                                                {getStatusIcon(signalement.statut)}
                                                                {signalement.statut.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                                                                {signalement.categorie}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{signalement.description}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>Créé le {formatDate(signalement.date_creation)}</span>
                                                            {signalement.date_modification && (
                                                                <span>Modifié le {formatDate(signalement.date_modification)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-gray-400">#{signalement.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h4>
                            <div className="space-y-3">
                                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Settings size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Paramètres</p>
                                        <p className="text-sm text-gray-500">Modifier le profil</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Shield size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Sécurité</p>
                                        <p className="text-sm text-gray-500">Mot de passe</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Bell size={18} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Notifications</p>
                                        <p className="text-sm text-gray-500">Préférences</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-xl transition-colors group">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                        <AlertTriangle size={18} className="text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 group-hover:text-red-700" onClick={() => setShowCreateModal(true)}>Signaler un incident</p>
                                        <p className="text-sm text-gray-500">Support technique</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Membre depuis</span>
                                    <span className="font-semibold text-gray-900">2025</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Statut</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Actif
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <CreateIncidentModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
        </div>
    );
};

export default UserAccountPage;