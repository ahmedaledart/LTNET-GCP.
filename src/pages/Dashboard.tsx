import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Ticker } from "../components/Ticker";
import { Chatbot } from "../components/Chatbot";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const oilTrendData = [
  { date: '5 مارس', brent: 81.2, wti: 76.8 },
  { date: '6 مارس', brent: 81.5, wti: 77.1 },
  { date: '7 مارس', brent: 80.8, wti: 76.5 },
  { date: '8 مارس', brent: 82.1, wti: 77.9 },
  { date: '9 مارس', brent: 82.5, wti: 78.2 },
  { date: '10 مارس', brent: 81.9, wti: 77.5 },
  { date: '11 مارس', brent: 82.45, wti: 78.12 },
];

const initialMarketData = {
  energy: [
    { id: 'brent', name: 'خام برنت', symbol: 'BRENT', price: '82.45', change: '+1.2%', up: true, unit: 'USD/bbl' },
    { id: 'wti', name: 'خام غرب تكساس', symbol: 'WTI', price: '78.12', change: '+0.8%', up: true, unit: 'USD/bbl' },
    { id: 'natgas', name: 'الغاز الطبيعي', symbol: 'NATGAS', price: '2.15', change: '-3.4%', up: false, unit: 'USD/MMBtu' },
    { id: 'gaso', name: 'البنزين', symbol: 'GASO', price: '2.54', change: '+0.5%', up: true, unit: 'USD/gal' },
  ],
  metals: [
    { id: 'gold', name: 'الذهب', symbol: 'GOLD', price: '2,150.50', change: '+0.4%', up: true, unit: 'USD/oz' },
    { id: 'silver', name: 'الفضة', symbol: 'SILVER', price: '24.20', change: '-1.1%', up: false, unit: 'USD/oz' },
    { id: 'copper', name: 'النحاس', symbol: 'COPPER', price: '3.85', change: '+2.1%', up: true, unit: 'USD/lb' },
    { id: 'aluminum', name: 'الألومنيوم', symbol: 'ALUM', price: '2,240.00', change: '+0.2%', up: true, unit: 'USD/mt' },
  ],
  agriculture: [
    { id: 'wheat', name: 'القمح', price: '580.25', change: '-1.5%', up: false, unit: 'USD/bu', status: 'مستقر', statusColor: 'text-success' },
    { id: 'corn', name: 'الذرة', price: '430.50', change: '+0.8%', up: true, unit: 'USD/bu', status: 'مستقر', statusColor: 'text-success' },
    { id: 'soybeans', name: 'فول الصويا', price: '1,150.00', change: '-0.2%', up: false, unit: 'USD/bu', status: 'نقص محتمل', statusColor: 'text-primary' },
    { id: 'sugar', name: 'السكر', price: '22.40', change: '+3.1%', up: true, unit: 'USd/lb', status: 'تأخير شحن', statusColor: 'text-danger' },
    { id: 'coffee', name: 'القهوة', price: '185.50', change: '+1.5%', up: true, unit: 'USd/lb', status: 'مستقر', statusColor: 'text-success' },
  ]
};

export function Dashboard() {
  const [marketData, setMarketData] = useState(initialMarketData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const fetchRealPrices = async () => {
    setIsUpdating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        ابحث عن الأسعار الحقيقية الحالية (اليوم) للسلع التالية في الأسواق العالمية:
        الطاقة: خام برنت، خام غرب تكساس، الغاز الطبيعي، البنزين.
        المعادن: الذهب، الفضة، النحاس، الألومنيوم.
        السلع الأساسية: القمح، الذرة، فول الصويا، السكر، القهوة.

        أعد البيانات بتنسيق JSON فقط، ككائن (Object) يحتوي على 3 مصفوفات (Arrays): energy, metals, agriculture.
        كل عنصر في المصفوفة يجب أن يحتوي على:
        - id: معرف السلعة باللغة الإنجليزية
        - name: اسم السلعة باللغة العربية
        - symbol: رمز السلعة (للطاقة والمعادن فقط)
        - price: السعر الحالي (نص مع الفواصل، مثال: "82.45")
        - change: نسبة التغير (نص، مثال: "+1.2%" أو "-0.5%")
        - up: هل التغير إيجابي؟ (true/false)
        - unit: وحدة القياس (مثال: USD/bbl, USD/oz)
        - status: حالة الإمداد (للسلع الأساسية فقط، مثال: "مستقر")
        - statusColor: لون الحالة (للسلع الأساسية فقط، "text-success" أو "text-danger" أو "text-primary")

        لا تقم بإضافة أي نص آخر غير الـ JSON.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      
      let text = response.text || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      if (text) {
        const data = JSON.parse(text);
        if (data.energy && data.metals && data.agriculture) {
          setMarketData(data);
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error("Error fetching real prices:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchRealPrices();
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Ticker />
      <Header />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">نظرة عامة على الأسواق العالمية</h1>
              <p className="text-text-muted text-base">تحديث مباشر لأسعار السلع والمؤشرات الاستراتيجية</p>
            </div>
            <div className="text-left flex flex-col items-end gap-2">
              <div className="text-2xl font-bold text-white" dir="ltr">
                {lastUpdated.toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <button 
                onClick={fetchRealPrices} 
                disabled={isUpdating}
                className="flex items-center gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isUpdating ? 'animate-spin' : ''}`}>sync</span>
                {isUpdating ? 'جاري التحديث...' : 'تحديث مباشر للأسعار'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button onClick={() => setActiveFilter('all')} className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeFilter === 'all' ? 'bg-primary text-bg-dark' : 'bg-surface-dark text-white border border-border-dark hover:border-primary/50'}`}>الكل</button>
            <button onClick={() => setActiveFilter('energy')} className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeFilter === 'energy' ? 'bg-primary text-bg-dark' : 'bg-surface-dark text-white border border-border-dark hover:border-primary/50'}`}>الطاقة</button>
            <button onClick={() => setActiveFilter('metals')} className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeFilter === 'metals' ? 'bg-primary text-bg-dark' : 'bg-surface-dark text-white border border-border-dark hover:border-primary/50'}`}>المعادن</button>
            <button onClick={() => setActiveFilter('agriculture')} className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeFilter === 'agriculture' ? 'bg-primary text-bg-dark' : 'bg-surface-dark text-white border border-border-dark hover:border-primary/50'}`}>السلع الأساسية</button>
          </div>

          {/* Energy Market */}
          {(activeFilter === 'all' || activeFilter === 'energy') && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">oil_barrel</span>
                قطاع الطاقة
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketData.energy.map((item: any) => (
                <AssetCard key={item.id} title={item.name} symbol={item.symbol} price={item.price} change={item.change} up={item.up} unit={item.unit} onClick={() => setSelectedAsset(item)} />
              ))}
            </div>
            
            {/* Oil Price Trend Chart */}
            <div className="mt-8 bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">اتجاهات أسعار النفط (آخر 7 أيام)</h3>
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={oilTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                    <XAxis dataKey="date" stroke="#8E9299" tick={{ fill: '#8E9299', fontSize: 12 }} tickMargin={10} />
                    <YAxis stroke="#8E9299" tick={{ fill: '#8E9299', fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151619', borderColor: '#2a2a2a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="brent" name="خام برنت" stroke="#e0b629" strokeWidth={3} dot={{ r: 4, fill: '#e0b629', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#e0b62950', strokeWidth: 4 }} />
                    <Line type="monotone" dataKey="wti" name="خام غرب تكساس" stroke="#4a90e2" strokeWidth={3} dot={{ r: 4, fill: '#4a90e2', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
          )}

          {/* Metals Market */}
          {(activeFilter === 'all' || activeFilter === 'metals') && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">diamond</span>
                قطاع المعادن
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketData.metals.map((item: any) => (
                <AssetCard key={item.id} title={item.name} symbol={item.symbol} price={item.price} change={item.change} up={item.up} unit={item.unit} onClick={() => setSelectedAsset(item)} />
              ))}
            </div>
          </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Agriculture Table */}
            {(activeFilter === 'all' || activeFilter === 'agriculture') && (
            <div className="lg:col-span-2 bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">agriculture</span>
                قطاع السلع الأساسية (الزراعية)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-base">
                  <thead>
                    <tr className="text-text-muted border-b border-border-dark">
                      <th className="pb-4 font-medium">السلعة</th>
                      <th className="pb-4 font-medium">السعر</th>
                      <th className="pb-4 font-medium">التغير اليومي</th>
                      <th className="pb-4 font-medium">الوحدة</th>
                      <th className="pb-4 font-medium">مؤشر الإمداد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dark">
                    {marketData.agriculture.map((item: any) => (
                      <TableRow key={item.id} name={item.name} price={item.price} change={item.change} up={item.up} unit={item.unit} status={item.status || 'مستقر'} statusColor={item.statusColor || 'text-success'} onClick={() => setSelectedAsset(item)} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {/* Shipping & Trade */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl flex flex-col">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">directions_boat</span>
                مؤشرات الشحن
              </h2>
              <div className="space-y-6 flex-1">
                <div className="p-5 bg-bg-dark rounded-xl border border-border-dark">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base text-text-muted">مؤشر البلطيق الجاف</span>
                    <span className="text-sm font-bold text-success bg-success/10 px-3 py-1 rounded-full">+2.5%</span>
                  </div>
                  <div className="text-4xl font-bold text-white">1,850</div>
                </div>
                <div className="p-5 bg-bg-dark rounded-xl border border-border-dark relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-1 bg-danger"></div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base text-text-muted">تكلفة الشحن (آسيا - المتوسط)</span>
                    <span className="text-sm font-bold text-danger bg-danger/10 px-3 py-1 rounded-full">+12.4%</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">$4,250 <span className="text-lg text-text-muted font-normal">/ TEU</span></div>
                  <div className="mt-4 text-sm text-danger flex items-center gap-2 bg-danger/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    تأثير أزمة البحر الأحمر مستمر
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedAsset(null)}>
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedAsset.name || selectedAsset.title}</h2>
                <span className="text-text-muted">{selectedAsset.symbol || 'سلعة أساسية'}</span>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="text-text-muted hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-bg-dark p-4 rounded-xl border border-border-dark">
                <div className="text-sm text-text-muted mb-1">السعر الحالي</div>
                <div className="text-xl font-bold text-white">{selectedAsset.price} <span className="text-sm font-normal text-text-muted">{selectedAsset.unit}</span></div>
              </div>
              <div className="bg-bg-dark p-4 rounded-xl border border-border-dark">
                <div className="text-sm text-text-muted mb-1">التغير اليومي</div>
                <div className={`text-xl font-bold flex items-center gap-1 ${selectedAsset.up ? 'text-success' : 'text-danger'}`}>
                  <span className="material-symbols-outlined text-[20px]">{selectedAsset.up ? 'trending_up' : 'trending_down'}</span>
                  {selectedAsset.change}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-border-dark pb-2">تفاصيل إضافية</h3>
              <div className="flex justify-between items-center p-2 hover:bg-bg-dark rounded-lg transition-colors">
                <span className="text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">calendar_today</span> تاريخ التحديث</span>
                <span className="text-white font-medium">{new Date().toLocaleDateString('ar-LY')}</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-bg-dark rounded-lg transition-colors">
                <span className="text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">inventory_2</span> المخزون الحالي (تقديري)</span>
                <span className="text-white font-medium">{Math.floor(Math.random() * 5000) + 1000} {selectedAsset.unit?.split('/')[1] || 'طن'}</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-bg-dark rounded-lg transition-colors">
                <span className="text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">schedule</span> آخر صفقة</span>
                <span className="text-white font-medium">منذ {Math.floor(Math.random() * 59) + 1} دقيقة</span>
              </div>
            </div>
            
            <button onClick={() => setSelectedAsset(null)} className="w-full mt-8 bg-primary text-bg-dark font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              إغلاق
            </button>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}

function AssetCard({ title, symbol, price, change, up, unit, onClick }: any) {
  return (
    <div onClick={onClick} className={`bg-surface-dark border border-border-dark rounded-2xl p-6 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg relative overflow-hidden hover:-translate-y-1 ${up ? 'hover:border-success/40 hover:shadow-success/5' : 'hover:border-danger/40 hover:shadow-danger/5'}`}>
      {/* Subtle top border highlight */}
      <div className={`absolute top-0 left-0 w-full h-1 opacity-30 group-hover:opacity-100 transition-opacity duration-300 ${up ? 'bg-success' : 'bg-danger'}`}></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <span className="text-sm text-text-muted">{symbol}</span>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${up ? 'bg-success/10 text-success group-hover:bg-success/20' : 'bg-danger/10 text-danger group-hover:bg-danger/20'}`}>
          <span className="material-symbols-outlined text-[24px]">{up ? 'trending_up' : 'trending_down'}</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-2">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-white tracking-tight">{price}</span>
          <span className="text-xs text-text-muted mt-1">{unit}</span>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${up ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>
          <span className="material-symbols-outlined text-[16px]">
            {up ? 'call_made' : 'call_received'}
          </span>
          <span dir="ltr">{change}</span>
        </div>
      </div>
    </div>
  );
}

function TableRow({ name, price, change, up, unit, status, statusColor, onClick }: any) {
  return (
    <tr onClick={onClick} className="hover:bg-bg-dark/50 transition-colors cursor-pointer">
      <td className="py-4 text-white font-bold text-base">{name}</td>
      <td className="py-4 text-white text-lg">{price}</td>
      <td className={`py-4 font-bold ${up ? 'text-success' : 'text-danger'} flex items-center gap-1`}>
        <span className="material-symbols-outlined text-[18px]">{up ? 'arrow_upward' : 'arrow_downward'}</span>
        {change}
      </td>
      <td className="py-4 text-text-muted">{unit}</td>
      <td className={`py-4 font-bold ${statusColor}`}>{status}</td>
    </tr>
  );
}
