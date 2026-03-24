import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export function Reports() {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex p-6 gap-6 overflow-hidden">
          
          {/* Main Report Area */}
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">التقارير الذكية</h1>
                <p className="text-text-muted text-sm">تحليلات وتوقعات السوق مدعومة بالذكاء الاصطناعي</p>
              </div>
            </div>
            
            {/* Generator Form */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                توليد تقرير جديد
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">نوع التقرير</label>
                  <select className="w-full bg-bg-dark border border-border-dark rounded-lg py-2 px-3 text-white focus:outline-none focus:border-primary">
                    <option>تحليل تأثير أزمة البحر الأحمر</option>
                    <option>توقعات أسعار القمح</option>
                    <option>ملخص سوق الطاقة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">الإطار الزمني</label>
                  <select className="w-full bg-bg-dark border border-border-dark rounded-lg py-2 px-3 text-white focus:outline-none focus:border-primary">
                    <option>الربع القادم (Q2 2024)</option>
                    <option>الشهر القادم</option>
                    <option>نهاية العام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">السوق المستهدف</label>
                  <select className="w-full bg-bg-dark border border-border-dark rounded-lg py-2 px-3 text-white focus:outline-none focus:border-primary">
                    <option>السوق الليبي (تأثير محلي)</option>
                    <option>السوق العالمي</option>
                    <option>الشرق الأوسط وشمال أفريقيا</option>
                  </select>
                </div>
              </div>
              <button className="bg-primary text-bg-dark font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 w-max">
                <span className="material-symbols-outlined text-[18px]">magic_button</span>
                توليد التقرير
              </button>
            </div>
            
            {/* Generated Report Preview */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-8 flex-1">
              <div className="flex justify-between items-start mb-8 border-b border-border-dark pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">تأثير أزمة البحر الأحمر على واردات ليبيا</h2>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> 12 مارس 2024</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">timer</span> وقت القراءة: 5 دقائق</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-lg border border-border-dark flex items-center justify-center text-text-muted hover:text-white hover:border-white transition-colors"><span className="material-symbols-outlined">share</span></button>
                  <button className="w-10 h-10 rounded-lg border border-border-dark flex items-center justify-center text-text-muted hover:text-white hover:border-white transition-colors"><span className="material-symbols-outlined">picture_as_pdf</span></button>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/90 leading-relaxed mb-6">
                  بناءً على تحليل البيانات الحالية، من المتوقع أن تؤدي الاضطرابات المستمرة في البحر الأحمر إلى زيادة في تكاليف الشحن بنسبة تتراوح بين 15% إلى 25% للواردات القادمة من آسيا إلى الموانئ الليبية خلال الربع الثاني من عام 2024.
                </p>
                
                <div className="grid grid-cols-2 gap-6 my-8">
                  <div className="bg-bg-dark p-6 rounded-xl border border-border-dark">
                    <h4 className="text-primary font-bold mb-2">التأثير على الأسعار المحلية</h4>
                    <p className="text-sm text-text-muted">زيادة متوقعة بنسبة 3-5% في أسعار السلع الاستهلاكية المستوردة من آسيا، خاصة الإلكترونيات وقطع الغيار.</p>
                  </div>
                  <div className="bg-bg-dark p-6 rounded-xl border border-border-dark">
                    <h4 className="text-danger font-bold mb-2">تأخيرات الشحن</h4>
                    <p className="text-sm text-text-muted">متوسط التأخير المتوقع للسفن المحولة عبر رأس الرجاء الصالح هو 12-14 يوماً إضافياً.</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">التوصيات الاستراتيجية</h3>
                <ul className="space-y-3 text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                    زيادة المخزون الاستراتيجي من السلع الأساسية بنسبة 20% للتحوط ضد التأخيرات.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                    تنويع مصادر الاستيراد والتركيز على الأسواق الأوروبية والأمريكية للمواد الحساسة للوقت.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                    التفاوض على عقود شحن طويلة الأجل لتثبيت الأسعار الحالية.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* AI News Feed Sidebar */}
          <div className="w-80 bg-surface-dark border border-border-dark rounded-xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border-dark bg-bg-dark/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">rss_feed</span>
                موجز الأخبار الذكي
              </h3>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <NewsItem 
                source="رويترز" 
                time="منذ ساعة" 
                title="ارتفاع أسعار النفط وسط مخاوف من نقص الإمدادات في الشرق الأوسط" 
                impact="high"
              />
              <NewsItem 
                source="بلومبرغ" 
                time="منذ 3 ساعات" 
                title="توقعات بمحصول قمح قياسي في روسيا قد يضغط على الأسعار العالمية" 
                impact="medium"
              />
              <NewsItem 
                source="فاينانشال تايمز" 
                time="منذ 5 ساعات" 
                title="شركات الشحن الكبرى تمدد تعليق العبور في البحر الأحمر حتى إشعار آخر" 
                impact="high"
              />
              <NewsItem 
                source="وول ستريت جورنال" 
                time="منذ 8 ساعات" 
                title="المركزي الأوروبي يلمح إلى إبقاء أسعار الفائدة مرتفعة لفترة أطول" 
                impact="low"
              />
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

function NewsItem({ source, time, title, impact }: any) {
  const impactColors = {
    high: 'bg-danger/10 text-danger border-danger/20',
    medium: 'bg-primary/10 text-primary border-primary/20',
    low: 'bg-text-muted/10 text-text-muted border-text-muted/20'
  };
  const impactLabels = {
    high: 'تأثير عالي',
    medium: 'تأثير متوسط',
    low: 'تأثير منخفض'
  };
  
  return (
    <div className="border-b border-border-dark pb-4 last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-text-muted">{source}</span>
        <span className="text-[10px] text-text-muted">{time}</span>
      </div>
      <h4 className="text-sm text-white font-medium leading-snug mb-2 hover:text-primary cursor-pointer transition-colors">{title}</h4>
      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${impactColors[impact as keyof typeof impactColors]}`}>
        {impactLabels[impact as keyof typeof impactLabels]}
      </div>
    </div>
  );
}
