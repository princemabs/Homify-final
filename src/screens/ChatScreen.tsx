import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, MessageSquareOff, User } from 'lucide-react';
import { UIConversation } from '../types/types';
// import { getGroupedConversations, sendMessage } from '../services/chatService';
import { getUserProfile } from '../services/authServices';
// import { ChatInitData } from '../App'; // Import du type depuis App

interface ChatScreenProps {
  onBack: () => void;
  agentName?: string;
  initialData?: ChatInitData | null; // NOUVEAU PROP
}

export default function ChatScreen({ onBack, initialData }: ChatScreenProps) {
  const [conversations, setConversations] = useState<UIConversation[]>([]);
  const [activeConv, setActiveConv] = useState<UIConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<number | null>(null);
  
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les données + Gérer l'initialisation directe
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const user = await getUserProfile();
        if (user) setMyId(user.id);
        
        const data = await getGroupedConversations();
        setConversations(data);

        // LOGIQUE D'OUVERTURE AUTOMATIQUE
        if (initialData) {
            // 1. Chercher si une conversation existe déjà pour ce logement
            const existingConv = data.find(c => c.propertyId === initialData.propertyId);
            
            if (existingConv) {
                setActiveConv(existingConv);
            } else {
                // 2. Si elle n'existe pas, créer un objet "Conversation Temporaire"
                // Cela permet d'afficher l'interface de chat vide, prête à envoyer
                const tempConv: UIConversation = {
                    propertyId: initialData.propertyId,
                    partnerId: initialData.partnerId,
                    partnerName: initialData.partnerName,
                    propertyTitle: initialData.propertyTitle,
                    propertyImage: initialData.propertyImage,
                    lastMessage: "Nouvelle discussion",
                    lastMessageDate: new Date().toLocaleDateString(),
                    unreadCount: 0,
                    messages: [] // Liste vide = chat vide
                };
                setActiveConv(tempConv);
            }
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [initialData]); // Se relance si initialData change

  useEffect(() => {
    if (activeConv) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConv, activeConv?.messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConv) return;
    setSending(true);
    try {
      // Envoi API
      const newMsg = await sendMessage(activeConv.propertyId, inputText);
      
      // Mise à jour locale
      const updatedConv = {
          ...activeConv,
          messages: [...activeConv.messages, newMsg],
          lastMessage: newMsg.content,
          lastMessageDate: new Date().toLocaleDateString()
      };
      
      setActiveConv(updatedConv);
      setInputText("");

      // Mettre à jour la liste principale
      setConversations(prev => {
          const exists = prev.find(c => c.propertyId === updatedConv.propertyId);
          if (exists) {
              return prev.map(c => c.propertyId === updatedConv.propertyId ? updatedConv : c);
          } else {
              // Si c'était une nouvelle conversation, on l'ajoute à la liste maintenant
              return [updatedConv, ...prev];
          }
      });

    } catch (error) {
      alert("Erreur lors de l'envoi");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  // --- Rendu VUE DÉTAIL ---
  if (activeConv) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shadow-sm sticky top-0 z-10">
            <button onClick={() => setActiveConv(null)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={22} />
            </button>
            <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">{activeConv.partnerName}</h3>
                <p className="text-xs text-blue-600 truncate max-w-[200px]">{activeConv.propertyTitle}</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-3 pb-24">
            {activeConv.messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                    <p>C'est le début de votre conversation avec {activeConv.partnerName}.</p>
                    <p className="text-xs mt-1">Posez une question sur {activeConv.propertyTitle}.</p>
                </div>
            )}
            
            {activeConv.messages.map((msg) => {
                const isMe = msg.sender.id === myId;
                return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                    }`}>
                        <p className="leading-relaxed mb-1">{msg.content}</p>
                        <p className={`text-[10px] text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                            {new Date(msg.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 w-full bg-white border-t p-3 pb-6">
            <div className="flex gap-2">
                <input 
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Écrivez un message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                onClick={handleSendMessage} 
                disabled={sending || !inputText.trim()}
                className="bg-blue-600 text-white p-2 rounded-full disabled:bg-gray-300 flex items-center justify-center w-10 h-10"
                >
                {sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- Rendu VUE LISTE ---
  return (
    <div className="flex flex-col h-full bg-white px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-blue-600"/></div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
           <MessageSquareOff size={48} className="mb-2 opacity-50"/>
           <p>Aucune discussion.</p>
        </div>
      ) : (
        <div className="space-y-2 pb-24 overflow-y-auto">
           {conversations.map((conv) => (
             <button 
               key={conv.propertyId}
               onClick={() => setActiveConv(conv)}
               className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100 group"
             >
               <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                  {conv.propertyImage ? (
                    <img src={conv.propertyImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200"><User size={20}/></div>
                  )}
               </div>

               <div className="flex-1 text-left overflow-hidden">
                 <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-gray-900 truncate text-sm">{conv.partnerName}</h3>
                    <span className="text-[10px] text-gray-400">{conv.lastMessageDate}</span>
                 </div>
                 <p className="text-xs text-blue-600 font-medium mb-1 truncate">🏠 {conv.propertyTitle}</p>
                 <div className="flex justify-between items-center">
                    <p className={`text-sm truncate pr-2 ${conv.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                        {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                 </div>
               </div>
             </button>
           ))}
        </div>
      )}
    </div>
  );
}