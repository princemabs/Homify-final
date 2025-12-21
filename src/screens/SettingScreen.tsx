import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import pour la navigation
import { 
  ArrowLeft, Bell, Moon, Globe, Shield, CreditCard, 
  HelpCircle, LogOut, ChevronRight, Smartphone, Mail, Trash2, CheckCircle2 
} from 'lucide-react';

// --- COMPOSANTS UI ---

const Switch = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
  <button 
    onClick={onChange}
    disabled={disabled}
    className={`
      relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      ${checked ? 'bg-blue-600' : 'bg-gray-200'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <span 
      className={`
        inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `} 
    />
  </button>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-8 px-2">
    {title}
  </h3>
);

const SettingsItem = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  action 
}: { 
  icon: any, 
  title: string, 
  subtitle?: string, 
  action: React.ReactNode 
}) => (
  <div className="flex items-center justify-between p-4 bg-white first:rounded-t-2xl last:rounded-b-2xl border-b last:border-b-0 border-gray-100 transition-colors hover:bg-gray-50/50">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <div className="font-semibold text-gray-900 text-sm md:text-base">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
      </div>
    </div>
    <div>{action}</div>
  </div>
);

// --- ÉTAT INITIAL PAR DÉFAUT ---
const DEFAULT_SETTINGS = {
  push_new_property: true,
  push_messages: true,
  email_digest: false,
  dark_mode: false,
  two_factor: false,
  currency: 'XAF',
  language: 'fr'
};

export default function SettingsScreen() {
  const navigate = useNavigate();

  // 1. Initialiser le state avec localStorage s'il existe
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('user_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // 2. Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
    
    // Application immédiate du Dark Mode
    if (settings.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Fonction de modification générique
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: keyof typeof settings, value: string) => {
     setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  // Actions
  const handleBack = () => navigate(-1); // Retour écran précédent

  const handleLogout = () => {
    if(window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("access_token"); // Supprimer le token
      navigate("/"); // Rediriger vers la landing page / login
    }
  };

  const handleDeleteAccount = () => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
        alert("Demande envoyée. Votre compte sera supprimé sous 30 jours.");
        // Ici, tu ferais un appel API réel
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition active:scale-95">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
          </div>
        </div>
      </header>

      {/* --- CONTENU --- */}
      <main className="max-w-2xl mx-auto px-4 pt-2">

        {/* SECTION 1: PREFERENCES */}
        <SectionHeader title="Général" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
           
           {/* Langue */}
           <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50/50 transition">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Globe size={20} /></div>
                <div className="font-semibold text-gray-900 text-sm">Langue</div>
              </div>
              <select 
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="bg-gray-100 border-none text-sm font-bold text-gray-700 rounded-lg focus:ring-0 cursor-pointer py-2 pl-3 pr-8"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
           </div>

           {/* Devise */}
           <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-green-50 rounded-xl text-green-600"><CreditCard size={20} /></div>
                <div>
                    <div className="font-semibold text-gray-900 text-sm">Devise</div>
                    <div className="text-xs text-gray-500">Affichage des prix</div>
                </div>
              </div>
              <select 
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="bg-gray-100 border-none text-sm font-bold text-gray-700 rounded-lg focus:ring-0 cursor-pointer py-2 pl-3 pr-8"
              >
                <option value="XAF">XAF (FCFA)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
           </div>
        </div>


        {/* SECTION 2: NOTIFICATIONS */}
        <SectionHeader title="Notifications" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <SettingsItem 
            icon={Bell} 
            title="Nouveaux biens" 
            subtitle="Alertes recherche"
            action={<Switch checked={settings.push_new_property} onChange={() => toggleSetting('push_new_property')} />}
          />
          <SettingsItem 
            icon={Smartphone} 
            title="Messages Push" 
            subtitle="Sur cet appareil"
            action={<Switch checked={settings.push_messages} onChange={() => toggleSetting('push_messages')} />}
          />
          <SettingsItem 
            icon={Mail} 
            title="Résumé Email" 
            subtitle="Hebdomadaire"
            action={<Switch checked={settings.email_digest} onChange={() => toggleSetting('email_digest')} />}
          />
        </div>

        {/* SECTION 3: APPARENCE */}
        <SectionHeader title="Apparence" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
           <SettingsItem 
            icon={Moon} 
            title="Mode Sombre" 
            subtitle={settings.dark_mode ? "Activé" : "Désactivé"}
            action={<Switch checked={settings.dark_mode} onChange={() => toggleSetting('dark_mode')} />}
          />
        </div>

        {/* SECTION 4: SÉCURITÉ */}
        <SectionHeader title="Sécurité" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100">
           <SettingsItem 
            icon={Shield} 
            title="Double Authentification" 
            subtitle="Via SMS ou Email"
            action={<Switch checked={settings.two_factor} onChange={() => toggleSetting('two_factor')} />}
          />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left group">
             <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition"><HelpCircle size={20} /></div>
                <div className="font-semibold text-gray-900 text-sm">Centre d'aide</div>
             </div>
             <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-400 transition" />
          </button>
        </div>

        {/* SECTION 5: DANGER */}
        <SectionHeader title="Compte" />
        <div className="space-y-4">
          
          {/* Bouton Déconnexion */}
          <button 
             onClick={handleLogout}
             className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-700 font-bold hover:bg-gray-50 hover:text-gray-900 transition shadow-sm active:scale-[0.98]"
          >
             <LogOut size={18}/> Se déconnecter
          </button>

          {/* Bouton Suppression */}
          <button 
             onClick={handleDeleteAccount}
             className="w-full flex items-center justify-center gap-2 p-3 text-red-400 text-xs font-semibold hover:text-red-600 transition"
          >
            <Trash2 size={14} /> Supprimer mon compte
          </button>

          <p className="text-center text-[10px] text-gray-300 uppercase tracking-widest pt-4">
            Homifi v1.0.2 • Build 2024
          </p>
        </div>

      </main>
    </div>
  );
}