import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function Map() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleCloseAssistant = () => {
    if (query.trim() || response) {
      setShowConfirmClose(true);
    } else {
      setIsAssistantOpen(false);
    }
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    setIsAssistantOpen(false);
    setQuery("");
    setResponse("");
    setPlaces([]);
  };

  const handleAskAssistant = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse("");
    setPlaces([]);

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          systemInstruction: "أنت مساعد ذكي لخرائط شبكة ليبيا للتجارة. أجب باللغة العربية. استخدم أداة الخرائط لتوفير معلومات دقيقة حول الموانئ، الطرق البحرية، والأماكن.",
          tools: [{ googleMaps: {} }]
        }
      });

      setResponse(result.text || "عذراً، لم أتمكن من العثور على معلومات.");
      
      // Extract Maps grounding chunks
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedPlaces = chunks
          .filter((chunk: any) => chunk.maps?.uri && chunk.maps?.title)
          .map((chunk: any) => ({
            title: chunk.maps.title,
            uri: chunk.maps.uri
          }));
        setPlaces(extractedPlaces);
      }
    } catch (error) {
      console.error("Map Assistant error:", error);
      setResponse("حدث خطأ أثناء الاتصال بالمساعد الذكي.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative flex">
          {/* Map Area (Placeholder) */}
          <div className="flex-1 bg-[#0a192f] relative overflow-hidden" onClick={() => setActiveMarker(null)}>
            {/* Grid pattern for map feel */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#e0b629 1px, transparent 1px), linear-gradient(90deg, #e0b629 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Map Markers */}
            <MapMarker top="40%" left="60%" label="قناة السويس" status="warning" pulse isActive={activeMarker === 'قناة السويس'} onClick={(e: any) => { e.stopPropagation(); setActiveMarker('قناة السويس'); }} />
            <MapMarker top="55%" left="65%" label="باب المندب" status="danger" pulse isActive={activeMarker === 'باب المندب'} onClick={(e: any) => { e.stopPropagation(); setActiveMarker('باب المندب'); }} />
            <MapMarker top="45%" left="75%" label="مضيق هرمز" status="warning" isActive={activeMarker === 'مضيق هرمز'} onClick={(e: any) => { e.stopPropagation(); setActiveMarker('مضيق هرمز'); }} />
            <MapMarker top="35%" left="50%" label="ميناء طرابلس" status="success" isActive={activeMarker === 'ميناء طرابلس'} onClick={(e: any) => { e.stopPropagation(); setActiveMarker('ميناء طرابلس'); }} />
            
            {/* Legend */}
            <div className="absolute bottom-6 left-6 bg-surface-dark/90 backdrop-blur border border-border-dark p-4 rounded-xl">
              <h4 className="text-white text-sm font-bold mb-3">مفتاح الخريطة</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-muted"><span className="w-3 h-3 rounded-full bg-success"></span> حركة طبيعية</div>
                <div className="flex items-center gap-2 text-text-muted"><span className="w-3 h-3 rounded-full bg-primary"></span> ازدحام / تأخير</div>
                <div className="flex items-center gap-2 text-text-muted"><span className="w-3 h-3 rounded-full bg-danger"></span> خطر أمني / توقف</div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <button className="w-10 h-10 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center text-white hover:text-primary"><span className="material-symbols-outlined">add</span></button>
              <button className="w-10 h-10 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center text-white hover:text-primary"><span className="material-symbols-outlined">remove</span></button>
              <button className="w-10 h-10 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center text-white hover:text-primary mt-2"><span className="material-symbols-outlined">my_location</span></button>
            </div>

            {/* AI Assistant Toggle */}
            <button 
              onClick={() => setIsAssistantOpen(!isAssistantOpen)}
              className="absolute top-6 right-6 bg-primary text-bg-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-primary/90 transition-colors z-10"
            >
              <span className="material-symbols-outlined">travel_explore</span>
              مساعد الخرائط الذكي
            </button>

            {/* AI Assistant Panel */}
            {isAssistantOpen && (
              <div className="absolute top-20 right-6 w-96 bg-surface-dark border border-border-dark rounded-xl shadow-2xl flex flex-col max-h-[70vh] z-10 overflow-hidden">
                <div className="p-4 border-b border-border-dark bg-bg-dark flex justify-between items-center">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">travel_explore</span>
                    استكشاف المواقع
                  </h3>
                  <button onClick={handleCloseAssistant} className="text-text-muted hover:text-white">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                {showConfirmClose && (
                  <div className="absolute inset-0 z-20 bg-surface-dark/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                    <span className="material-symbols-outlined text-4xl text-primary mb-4">warning</span>
                    <h4 className="text-white font-bold text-lg mb-2">هل أنت متأكد من الإغلاق؟</h4>
                    <p className="text-text-muted text-sm mb-6">سيتم فقدان المحادثة الحالية ونتائج البحث.</p>
                    <div className="flex gap-3 w-full">
                      <button onClick={confirmClose} className="flex-1 bg-danger text-white py-2 rounded-lg font-bold hover:bg-danger/90 transition-colors">نعم، أغلق</button>
                      <button onClick={() => setShowConfirmClose(false)} className="flex-1 bg-bg-dark border border-border-dark text-white py-2 rounded-lg font-bold hover:bg-bg-dark/80 transition-colors">إلغاء</button>
                    </div>
                  </div>
                )}

                <div className="p-4 flex-1 overflow-y-auto">
                  {response ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <Markdown>{response}</Markdown>
                      
                      {places.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border-dark">
                          <h4 className="text-primary font-bold mb-2 text-sm">روابط الأماكن:</h4>
                          <ul className="space-y-2">
                            {places.map((place, idx) => (
                              <li key={idx}>
                                <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                                  {place.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-text-muted py-8">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">map</span>
                      <p>اسأل عن أي ميناء، مضيق، أو موقع استراتيجي.</p>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-center mt-4">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-border-dark bg-bg-dark">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
                      placeholder="مثال: أين يقع ميناء طرابلس؟"
                      disabled={isLoading}
                      className="flex-1 bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleAskAssistant}
                      disabled={isLoading || !query.trim()}
                      className="w-10 h-10 bg-primary text-bg-dark rounded-lg flex items-center justify-center disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">search</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Panel (Alerts & Stats) */}
          <div className="w-80 bg-surface-dark border-r border-border-dark flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-border-dark">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">radar</span>
                تتبع سلاسل الإمداد
              </h2>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Live Alerts */}
              <div>
                <h3 className="text-sm font-bold text-text-muted mb-3">تنبيهات مباشرة</h3>
                <div className="space-y-3">
                  <AlertCard type="danger" time="منذ 10 دقائق" text="تغيير مسار 4 ناقلات نفط بعيداً عن البحر الأحمر بسبب مخاوف أمنية." />
                  <AlertCard type="warning" time="منذ 45 دقيقة" text="ازدحام في قناة السويس، تأخير متوقع لمدة 12 ساعة للسفن المتجهة شمالاً." />
                  <AlertCard type="success" time="منذ ساعتين" text="وصول شحنة القمح (MV Star) إلى ميناء طرابلس وتفريغها بنجاح." />
                </div>
              </div>
              
              {/* Straits Status */}
              <div>
                <h3 className="text-sm font-bold text-text-muted mb-3">حالة المضائق الاستراتيجية</h3>
                <div className="space-y-2">
                  <StraitStatus name="قناة السويس" status="مزدحم" color="text-primary" bg="bg-primary/10" />
                  <StraitStatus name="باب المندب" status="خطر عالي" color="text-danger" bg="bg-danger/10" />
                  <StraitStatus name="مضيق هرمز" status="حذر" color="text-primary" bg="bg-primary/10" />
                  <StraitStatus name="مضيق جبل طارق" status="طبيعي" color="text-success" bg="bg-success/10" />
                </div>
              </div>
              
              {/* Fleet Stats */}
              <div className="bg-bg-dark border border-border-dark rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-4">إحصائيات الأسطول المتجه لليبيا</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-text-muted">سفن وقود</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">8</div>
                    <div className="text-xs text-text-muted">سفن حبوب</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-text-muted">حاويات بضائع</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-danger">3</div>
                    <div className="text-xs text-text-muted">متأخرة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MapMarker({ top, left, label, status, pulse, isActive, onClick }: any) {
  const colors = {
    success: 'bg-success',
    warning: 'bg-primary',
    danger: 'bg-danger'
  };
  
  return (
    <div 
      className={`absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${isActive ? 'scale-125 z-20' : 'hover:scale-110 z-10'}`} 
      style={{ top, left }}
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center w-6 h-6">
        {pulse && <div className={`absolute inset-0 rounded-full ${colors[status as keyof typeof colors]} animate-ping opacity-75`}></div>}
        <div className={`relative w-3 h-3 rounded-full ${colors[status as keyof typeof colors]} border-2 border-[#0a192f] transition-all duration-300 ${isActive ? 'ring-4 ring-primary/50 shadow-[0_0_15px_rgba(224,182,41,0.8)]' : ''}`}></div>
      </div>
      <div className={`mt-1 px-2 py-1 bg-surface-dark/80 backdrop-blur border ${isActive ? 'border-primary text-primary' : 'border-border-dark text-white'} rounded text-[10px] font-bold whitespace-nowrap transition-colors duration-300`}>
        {label}
      </div>
    </div>
  );
}

function AlertCard({ type, time, text }: any) {
  const styles = {
    danger: { icon: 'warning', color: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/5' },
    warning: { icon: 'info', color: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/5' },
    success: { icon: 'check_circle', color: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
  };
  const s = styles[type as keyof typeof styles];
  
  return (
    <div className={`p-3 rounded-lg border ${s.border} ${s.bg}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`material-symbols-outlined text-[16px] ${s.color}`}>{s.icon}</span>
        <span className="text-[10px] text-text-muted">{time}</span>
      </div>
      <p className="text-xs text-white leading-relaxed">{text}</p>
    </div>
  );
}

function StraitStatus({ name, status, color, bg }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-dark transition-colors">
      <span className="text-sm text-white">{name}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded ${color} ${bg}`}>{status}</span>
    </div>
  );
}
