import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Bell, Moon, Globe, Shield, CreditCard, 
  HelpCircle, LogOut, ChevronRight, Smartphone, Mail, Trash2 
} from 'lucide-react';

// --- COMPOSANT SWITCH (Interrupteur iOS style) ---
const Switch = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
  <button 
    onClick={onChange}
    disabled={disabled}
    className={`
      relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none
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

// --- COMPOSANT SECTION HEADER ---
const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6 px-2">
    {title}
  </h3>
);

// --- COMPOSANT ITEM ---
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
  <div className="flex items-center justify-between p-4 bg-white first:rounded-t-xl last:rounded-b-xl border-b last:border-b-0 border-gray-100">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
        <Icon size={20} />
      </div>
      <div>
        <div className="font-semibold text-gray-900 text-sm md:text-base">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
      </div>
    </div>
    <div>{action}</div>
  </div>
);

export default function SettingsScreen() {
  // --- STATES ---
  // Dans une vraie app, ces valeurs viendraient de ton API ou du LocalStorage
  const [settings, setSettings] = useState({
    push_new_property: true,
    push_messages: true,
    email_digest: false,
    dark_mode: false,
    two_factor: false,
    currency: 'XAF', // FCFA
    language: 'fr'
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fonction pour basculer un switch
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    // Simulation d'auto-save (Toast ou appel API silencieux)
    console.log(`Setting ${key} updated`);
  };

  const handleChange = (key: keyof typeof settings, value: string) => {
     setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
        alert("Compte marqué pour suppression.");
        // Appel API DELETE /api/auth/me/
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Paramètres</h1>
          </div>
        </div>
      </header>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="max-w-2xl mx-auto px-4 pt-2">

        {/* SECTION 1: PREFERENCES */}
        <SectionHeader title="Général" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
           
           {/* Langue */}
           <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Globe size={20} /></div>
                <div className="font-semibold text-gray-900 text-sm">Langue</div>
              </div>
              <select 
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="bg-gray-50 border-none text-sm font-medium text-gray-700 rounded-lg focus:ring-0 cursor-pointer py-1.5 pl-3 pr-8"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
           </div>

           {/* Devise */}
           <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><CreditCard size={20} /></div>
                <div>
                    <div className="font-semibold text-gray-900 text-sm">Devise</div>
                    <div className="text-xs text-gray-500">Pour l'affichage des prix</div>
                </div>
              </div>
              <select 
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="bg-gray-50 border-none text-sm font-medium text-gray-700 rounded-lg focus:ring-0 cursor-pointer py-1.5 pl-3 pr-8"
              >
                <option value="XAF">XAF (FCFA)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
           </div>
        </div>


        {/* SECTION 2: NOTIFICATIONS */}
        <SectionHeader title="Notifications" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <SettingsItem 
            icon={Bell} 
            title="Nouveaux biens" 
            subtitle="Alertes quand un bien correspond à vos recherches"
            action={<Switch checked={settings.push_new_property} onChange={() => toggleSetting('push_new_property')} />}
          />
          <SettingsItem 
            icon={Smartphone} 
            title="Messages Push" 
            subtitle="Notifications sur votre téléphone"
            action={<Switch checked={settings.push_messages} onChange={() => toggleSetting('push_messages')} />}
          />
          <SettingsItem 
            icon={Mail} 
            title="Résumé Email" 
            subtitle="Recevoir un récapitulatif hebdomadaire"
            action={<Switch checked={settings.email_digest} onChange={() => toggleSetting('email_digest')} />}
          />
        </div>

        {/* SECTION 3: APPARENCE */}
        <SectionHeader title="Apparence" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
           <SettingsItem 
            icon={Moon} 
            title="Mode Sombre" 
            subtitle="Moins fatiguant pour les yeux la nuit"
            action={<Switch checked={settings.dark_mode} onChange={() => toggleSetting('dark_mode')} />}
          />
        </div>

        {/* SECTION 4: SÉCURITÉ */}
        <SectionHeader title="Sécurité & Confidentialité" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
           <SettingsItem 
            icon={Shield} 
            title="Double Authentification (2FA)" 
            subtitle="Sécuriser votre compte via SMS"
            action={<Switch checked={settings.two_factor} onChange={() => toggleSetting('two_factor')} />}
          />
          
          {/* Lien cliquable (pas un switch) */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><HelpCircle size={20} /></div>
                <div className="font-semibold text-gray-900 text-sm">Centre d'aide</div>
             </div>
             <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* SECTION 5: DANGER ZONE */}
        <SectionHeader title="Zone de danger" />
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
          <button 
             onClick={handleDeleteAccount}
             className="w-full flex items-center gap-4 p-4 text-red-600 hover:bg-red-50 transition text-left"
          >
            <div className="p-2 bg-red-100 rounded-lg"><Trash2 size={20} /></div>
            <div>
                <div className="font-bold text-sm">Supprimer mon compte</div>
                <div className="text-xs text-red-400">Cette action est définitive</div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">Version 1.0.2 • Build 2024</p>
            <button className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto">
               <LogOut size={16}/> Se déconnecter
            </button>
        </div>

      </main>
    </div>
  );
}