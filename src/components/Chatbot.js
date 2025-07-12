'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, XCircle, Volume2, VolumeX, Mic, MicOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    if (chat.length > 0 && chat[chat.length - 1].sender === 'bot') {
      setHasNewMessage(true);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    if (open && chat.length === 0) {
      setChat([
        {
          sender: 'bot',
          text: "👋 Hi! I'm your Nike AI Assistant. Need help with shopping, orders, or account?",
        },
      ]);
    }
    if (open) setHasNewMessage(false);
  }, [open]);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setChat(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      console.log('🟡 Sending user question to Gemini route:', input);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion: input }), // ✅ FIXED prompt → input
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('🟢 Gemini replied:', data.reply);

      setChat(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error('❌ Chatbot error:', err.message);
      setChat(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Gemini failed to generate a response. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    const synth = synthRef.current;
    if (!synth) return;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const lastBotMsg = [...chat].reverse().find(msg => msg.sender === 'bot');
    if (!lastBotMsg) return;

    const voices = synth.getVoices();
    const preferredVoice = voices.find(v =>
      v.lang.includes('en') &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('google'))
    );

    const utterance = new SpeechSynthesisUtterance(lastBotMsg.text);
    utterance.voice = preferredVoice || voices[0];
    utterance.rate = 1;
    utterance.pitch = 1.1;
    utterance.lang = 'en-US';
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
    setIsSpeaking(true);
  };

  const handleMicToggle = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = e => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white animate-bounce"
          whileHover={{ scale: 1.1 }}
        >
          <Bot className="w-6 h-6" />
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              1
            </span>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-6 w-[360px] max-h-[70vh] flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-black dark:bg-gray-800 text-white">
              <div className="flex items-center gap-2 animate-pulse">
                <Bot size={20} className="text-green-400" />
                <span className="font-medium text-sm">Nike AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleVoiceToggle} className="text-white">
                  {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={handleMicToggle} className="text-white">
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button onClick={() => setOpen(false)}>
                  <XCircle size={20} className="text-gray-300 hover:text-red-400 transition" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-900 text-sm scroll-smooth">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-blue-600 text-white'
                      : 'mr-auto bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="mr-auto bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-xl max-w-[80%] flex gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask me anything Nike..."
                className="flex-1 bg-transparent text-sm text-black dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                onClick={handleAsk}
                className="text-blue-600 hover:text-blue-500 transition ml-2"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
