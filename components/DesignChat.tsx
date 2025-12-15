
import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, Sparkles, Copy } from 'lucide-react';
import { SiteData, ChatMessage } from '../types';
import { createChatSession, generateResponse, generateRenderPrompt } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface DesignChatProps {
  siteData: SiteData;
  onBack: () => void;
}

const DesignChat: React.FC<DesignChatProps> = ({ siteData, onBack }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Chat with current language
    const session = createChatSession(siteData, language);
    setChatSession(session);
    
    // Add initial AI greeting
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: `${t.chat.initMessagePrefix} ${siteData.markers.length} ${t.chat.initMessageSuffix}`
      }
    ]);
  }, [siteData, language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateResponse(chatSession, userMsg.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Auto-generate render prompt if the conversation is long enough or specific keywords are present
      // Keywords check should be language agnostic or include both
      if (messages.length > 3 || input.includes("效果图") || input.toLowerCase().includes("render")) {
        const summary = messages.map(m => m.text).join(' ');
        const prompt = await generateRenderPrompt(summary);
        setGeneratedPrompt(prompt);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: t.chat.error
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10">
        <h2 className="font-bold text-brand-900 flex items-center gap-2">
          <Sparkles size={18} className="text-brand-500" />
          {t.chat.title}
        </h2>
        <button onClick={onBack} className="text-sm text-gray-500">{t.chat.back}</button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Context Bubble */}
        <div className="flex justify-center">
            <div className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                {t.chat.contextBubble}
            </div>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-brand-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
               <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-150"></div>
               <span className="text-xs text-gray-400 ml-1">{t.chat.loading}</span>
             </div>
          </div>
        )}

        {/* Generated Visual Prompt Box */}
        {generatedPrompt && !isLoading && (
           <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl mt-4">
              <div className="flex justify-between items-start mb-2">
                  <h4 className="text-purple-900 text-xs font-bold uppercase flex items-center gap-1">
                      <ImageIcon size={12} /> {t.chat.promptLabel}
                  </h4>
                  <button 
                    onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                      <Copy size={14} />
                  </button>
              </div>
              <p className="text-xs text-purple-800 font-mono break-all">{generatedPrompt}</p>
              <div className="mt-2 text-[10px] text-purple-400">
                  {t.chat.promptDisclaimer}
              </div>
              {/* Mock generated image placeholder */}
              <div className="mt-3 w-full h-32 bg-gray-200 rounded overflow-hidden relative">
                  <img src="https://picsum.photos/400/200?blur=2" alt="Mock Render" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-shadow">
                      {t.chat.renderPlaceholder}
                  </div>
              </div>
           </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-t flex gap-2 items-center">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.chat.inputPlaceholder} 
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 disabled:opacity-50 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default DesignChat;
