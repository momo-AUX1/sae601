import React, { useState } from "react";
import { Lock, Trash2 } from "lucide-react";

const SecurityModal = ({ isOpen, onClose, onAccountDelete }) => {
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwords.new_password !== passwords.confirm_password) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (passwords.new_password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("https://test.nanodata.cloud/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwords.old_password,
          new_password: passwords.new_password,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Échec du changement de mot de passe");
        return;
      }
      
      setSuccess("Mot de passe modifié avec succès !");
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("https://test.nanodata.cloud/api/user", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Échec de la suppression du compte");
        return;
      }
      
      onAccountDelete();
      onClose();
    } catch (err) {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-900 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Sécurité du compte</h2>
        
        <div className="mb-8">
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Mot de passe actuel</label>
              <input
                type="password"
                value={passwords.old_password}
                onChange={(e) => setPasswords({...passwords, old_password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 text-black"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={passwords.new_password}
                onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 text-black"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 text-black"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            
            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Enregistrement..." : "Changer le mot de passe"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Zone de danger
          </h3>
          
          <p className="text-gray-700 mb-4">
            La suppression de votre compte est permanente. Toutes vos données seront définitivement supprimées.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              disabled={loading}
            >
              Supprimer le compte
            </button>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-800">Êtes-vous absolument sûr ?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? "Suppression..." : "Oui, supprimer"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;