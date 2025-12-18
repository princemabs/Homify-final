import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { ApiMessage, UIConversation } from '../types/types';
import { sendMessage } from '../services/chatService';
import { getUserProfile } from '../services/authServices';

interface ChatDetailProps {
  conversation: UIConversation;
  onBack: () => void;
}

export default function ChatDetailScreen({ conversation, onBack }: ChatDetailProps) {
  // On initialise avec les messages passés via les props
  const [messages, setMessages] = useState<ApiMessage[]>(conversation.messages);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [myId, setMyId] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On récupère l'ID du user actuel pour savoir aligner les bulles (droite/gauche)
    getUserProfile().then(u => u && setMyId(u.id));
    // Scroll en bas au chargement
    messagesEndRef.current?.scrollIntoView();
  }, []);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setSending(true);

    try {
      // Appel API
      const newMsg = await sendMessage(
          conversation.propertyId, // ID requis par l'API
          inputText,
          `Message concernant ${conversation.propertyTitle}` // Sujet
      );

      // On ajoute le message retourné par l'API à la liste locale
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
    } catch (error) {
      alert("Erreur lors de l'envoi");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!myId) return <div className="flex justify-center py-10"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="flex flex-col h-full bg-white relative z-50">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600"><ArrowLeft size={22} /></button>
        <div>
            <h3 className="font-bold text-gray-900 text-sm">{conversation.partnerName}</h3>
            <p className="text-xs text-blue-600 truncate max-w-[200px]">{conversation.propertyTitle}</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 pb-24 space-y-3">
         {messages.map((msg) => {
             const isMe = msg.sender.id === myId;
             return (
               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm relative text-sm ${
                    isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  }`}>
                     <p className="leading-relaxed mb-1">{msg.content}</p>
                     <p className={`text-[10px] text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                        {formatTime(msg.sent_at)}
                     </p>
                  </div>
               </div>
             );
         })}
         <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="absolute bottom-0 w-full bg-white border-t p-3 pb-6">
         <div className="flex gap-2">
            <input 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Écrivez un message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend} 
              disabled={sending || !inputText.trim()}
              className="bg-blue-600 text-white p-2 rounded-full disabled:bg-gray-300"
            >
               {sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
            </button>
         </div>
      </div>
    </div>
  );
}