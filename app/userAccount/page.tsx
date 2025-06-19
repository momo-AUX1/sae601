'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, MapPin, LogOut, Settings, Shield, Bell } from "lucide-react";

interface UserInfo {
    id: number;
    email: string;
    nom: string;
    adresse: string;
}

const API_BASE_URL = "https://test.nanodata.cloud";

const UserAccountPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

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
                } else {
                    router.push('/auth');
                }
            })
            .catch(() => {
                router.push('/auth');
            })
            .finally(() => setLoading(false));
    }, [router]);

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
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🌱</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">OUTREPIE</h1>
                                <p className="text-sm text-gray-500">Tableau de bord</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                            <LogOut size={20} />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Bonjour, {user.nom} 👋
                    </h2>
                    <p className="text-lg text-gray-600">
                        Gérez votre compte et vos préférences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
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
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
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
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Membre depuis</span>
                                    <span className="font-semibold text-gray-900">2024</span>
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
        </div>
    );
};

export default UserAccountPage;