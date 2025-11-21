import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, initializeChat } from './services/geminiService';
import ChatMessageItem from './components/ChatMessageItem';
import LoadingDots from './components/LoadingDots';
import { ChatMessage } from './types';
import { v4 as uuidv4 } from 'uuid'; // We'll use a simple random string generator since we can't install uuid package

// Simple ID generator replacement since we shouldn't assume external packages are pre-installed other than specified
const generateId = () => Math.random().toString(36).substring(2, 15);

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    initializeChat();
    // Add an initial welcome message
    setMessages([
      {
        id: generateId(),
        role: 'model',
        text: "Hello! I am OmniLingua. Ask me anything in any language (Khmer, English, Spanish, etc.) and I will help you.",
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userText);
      
      const modelMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: "Sorry, something went wrong. Please try again.",
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-gray-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              AI
            </div>
            <div>
              <h1 className="font-semibold text-lg text-gray-800">OmniLingua QA</h1>
              <p className="text-xs text-gray-500">Multilingual Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex w-full mb-4 justify-start">
               <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100">
                  <LoadingDots />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputResize}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything in any language..."
              className="w-full bg-transparent border-0 focus:ring-0 resize-none max-h-[120px] min-h-[24px] py-2 px-2 text-gray-800 placeholder:text-gray-400 text-base"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-xl flex-shrink-0 transition-all duration-200 mb-0.5 ${
                input.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-3 flex flex-col gap-1">
             <p className="text-[10px] text-gray-400">Powered by Gemini 2.5 Flash</p>
             <p className="text-[12px] text-indigo-600 font-medium">បង្កើតឡើងដោយនិសិត្សឈ្មោះ​ អ៊ុំ សំអូន</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;