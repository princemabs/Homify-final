
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import HomeScreen from './screens/HomeScreen'; 
import FavoritesScreen from './screens/FavoritesScreen';
import PropertyDetailsScreen from './screens/PropertyDetailsScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import ChatScreen from './screens/ChatScreen'; 
import MainAi from './screens/Aisection/MainAi';
import SettingsScreen from './screens/SettingScreen';


export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isChatting, setIsChatting] = useState(false); 

  const renderContent = () => {
    if (isChatting) {
      return (
        <ChatScreen 
          onBack={() => setIsChatting(false)} 
          agentName="Agent Immobilier" 
        />
      );
    }
    if (selectedPropertyId !== null) {
      return (
        <PropertyDetailsScreen 
          propertyId={selectedPropertyId} // On passe l'ID
          onBack={() => setSelectedPropertyId(null)} // Bouton retour remet l'ID à null
          onBookNow={() => setIsChatting(true)} 
        />
      );
    }

    switch (activeTab) {
      case 'Home':
        return <HomeScreen onPropertyClick={(id) => setSelectedPropertyId(id)} />;
      case 'Favorites':
        return <FavoritesScreen onHotelClick={(hotel) => setSelectedPropertyId(hotel.id)} />;
      case 'Profile':
        return <MyProfileScreen />;
      case 'Settings':
        return <SettingsScreen />;
      case 'Assist':
        return <MainAi/>
      default:
        return <HomeScreen onPropertyClick={(id) => setSelectedPropertyId(id)} />;
    }
  };
  if (isChatting) {
  return (
    <ChatScreen 
      onBack={() => setIsChatting(false)} 
      agentName="Agent Immobilier" // Ce prop sera ignoré ou utilisé par défaut, pas grave
    />
  );
}
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="pt-0 md:ml-64 relative"> 
        {renderContent()}
      </div>

      {!selectedPropertyId && !isChatting && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}


// import React, { useState } from 'react';
// import { BottomNav } from './components/BottomNav';
// import HomeScreen from './screens/HomeScreen'; 
// import FavoritesScreen from './screens/FavoritesScreen';
// import PropertyDetailsScreen from './screens/PropertyDetailsScreen';
// import MyProfileScreen from './screens/MyProfileScreen';
// import ChatScreen from './screens/ChatScreen'; 
// import MainAi from './screens/Aisection/MainAi';
// import SettingsScreen from './screens/SettingScreen';

// // Type pour les données d'initialisation du chat
// export interface ChatInitData {
//   propertyId: number;
//   partnerId: number;
//   partnerName: string;
//   propertyTitle: string;
//   propertyImage: string;
// }

// export default function App() {
//   const [activeTab, setActiveTab] = useState('Home');
//   const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  
//   const [isChatting, setIsChatting] = useState(false); 
  
//   // NOUVEAU : Stocke les infos pour initier une conversation spécifique
//   const [chatInitData, setChatInitData] = useState<ChatInitData | null>(null);

//   const renderContent = () => {
//     if (isChatting) {
//       return (
//         <ChatScreen 
//           onBack={() => {
//             setIsChatting(false);
//             setChatInitData(null); // On nettoie les données en sortant
//           }} 
//           // On passe les données d'initialisation au ChatScreen
//           initialData={chatInitData}
//         />
//       );
//     }
//     if (selectedPropertyId !== null) {
//       return (
//         <PropertyDetailsScreen 
//           propertyId={selectedPropertyId} 
//           onBack={() => setSelectedPropertyId(null)} 
//           // MODIFIÉ : On récupère les infos nécessaires pour démarrer le chat
//           onBookNow={(data) => {
//             setChatInitData(data); // On sauvegarde les infos
//             setIsChatting(true);   // On ouvre le chat
//             // Optionnel : On laisse selectedPropertyId actif si on veut revenir aux détails en faisant "Retour" depuis le chat
//              setSelectedPropertyId(null); 
//           }} 
//         />
//       );
//     }

//     switch (activeTab) {
//       case 'Home':
//         return <HomeScreen onPropertyClick={(id) => setSelectedPropertyId(id)} />;
//       case 'Favorites':
//         return <FavoritesScreen onHotelClick={(hotel) => setSelectedPropertyId(hotel.id)} />;
//       case 'Profile':
//         return <MyProfileScreen />;
//       case 'Settings':
//         return <SettingsScreen />;
//       case 'Assist':
//         return <MainAi/>
//       default:
//         return <HomeScreen onPropertyClick={(id) => setSelectedPropertyId(id)} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-800">
//       <div className="pt-0 md:ml-64 relative h-screen flex flex-col"> 
//          <div className="flex-1 overflow-hidden relative">
//             {renderContent()}
//          </div>
//       </div>

//       {!selectedPropertyId && !isChatting && (
//         <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
//       )}
//     </div>
//   );
// }