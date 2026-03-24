import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((msg: any) => msg.userId === user.uid);
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userText = input;
    setInput("");
    setIsLoading(true);

    try {
      // Save user message
      await addDoc(collection(db, "chats"), {
        userId: user.uid,
        role: "user",
        text: userText,
        timestamp: serverTimestamp()
      });

      // Call Gemini with tools
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userText,
        config: {
          systemInstruction: "أنت مساعد ذكي لشبكة ليبيا للتجارة. أجب باللغة العربية. يمكنك استخدام أدوات البحث لتوفير معلومات دقيقة حول الأسواق والموانئ.",
          tools: [{ googleSearch: {} }]
        }
      });

      let aiText = response.text || "عذراً، لم أتمكن من معالجة طلبك.";
      
      // Extract grounding chunks (URLs)
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      let sources = [];
      if (chunks && chunks.length > 0) {
        sources = chunks.map((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
            return `[${chunk.web.title}](${chunk.web.uri})`;
          }
          return null;
        }).filter(Boolean);
        
        if (sources.length > 0) {
          aiText += "\n\n**المصادر:**\n" + sources.map(s => `- ${s}`).join("\n");
        }
      }

      // Save AI message
      await addDoc(collection(db, "chats"), {
        userId: user.uid,
        role: "model",
        text: aiText,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Chat error:", error);
      await addDoc(collection(db, "chats"), {
        userId: user.uid,
        role: "model",
        text: "حدث خطأ أثناء الاتصال بالخادم.",
        timestamp: serverTimestamp()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-bg-dark rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-surface-dark border border-border-dark rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-bg-dark p-4 border-b border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div>
                <h3 className="text-white font-bold">المساعد الذكي</h3>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success"></span> متصل
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!user ? (
              <div className="text-center text-text-muted mt-10">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">lock</span>
                <p>يرجى تسجيل الدخول لاستخدام المحادثة</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-text-muted mt-10">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
                <p>كيف يمكنني مساعدتك اليوم؟</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg.id || idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-primary text-bg-dark rounded-tl-none' : 'bg-bg-dark border border-border-dark text-white rounded-tr-none'}`}>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-bg-dark border border-border-dark p-3 rounded-xl rounded-tr-none flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-bg-dark border-t border-border-dark">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب رسالتك هنا..."
                disabled={!user || isLoading}
                className="flex-1 bg-surface-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!user || isLoading || !input.trim()}
                className="w-10 h-10 bg-primary text-bg-dark rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
