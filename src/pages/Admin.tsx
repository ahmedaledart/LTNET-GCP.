import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export function Admin() {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">لوحة الإدارة</h1>
              <p className="text-text-muted text-sm">إدارة النظام، واجهات برمجة التطبيقات، والمستخدمين</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger border border-danger/30 rounded-lg text-sm font-bold hover:bg-danger hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              تفعيل وضع الطوارئ
            </button>
          </div>

          {/* System Health Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="المستخدمين النشطين" value="1,248" icon="group" color="text-primary" />
            <StatCard title="حالة الـ API" value="99.9%" icon="api" color="text-success" />
            <StatCard title="صحة النظام" value="مستقر" icon="health_and_safety" color="text-success" />
            <StatCard title="التجاوزات اليدوية" value="3" icon="front_hand" color="text-danger" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* API Connections */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">cable</span>
                  اتصالات API
                </h2>
                <button className="text-sm text-primary hover:underline">إضافة اتصال</button>
              </div>
              <div className="space-y-3">
                <ApiConnection name="Bloomberg Terminal" status="متصل" latency="45ms" />
                <ApiConnection name="Reuters Eikon" status="متصل" latency="62ms" />
                <ApiConnection name="MarineTraffic" status="متصل" latency="120ms" />
                <ApiConnection name="Local Customs DB" status="مفصول" latency="--" error />
              </div>
            </div>

            {/* Fallback Settings */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">backup</span>
                إعدادات الطوارئ (Fallback)
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-bg-dark rounded-lg border border-border-dark">
                  <div>
                    <div className="text-sm font-bold text-white">تحديث الأسعار التلقائي</div>
                    <div className="text-xs text-text-muted">التبديل للمصدر البديل عند فشل المصدر الرئيسي</div>
                  </div>
                  <Toggle active={true} />
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-dark rounded-lg border border-border-dark">
                  <div>
                    <div className="text-sm font-bold text-white">تثبيت الأسعار (Freeze)</div>
                    <div className="text-xs text-text-muted">إيقاف تحديث الأسعار وعرض آخر سعر معروف</div>
                  </div>
                  <Toggle active={false} />
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-dark rounded-lg border border-border-dark">
                  <div>
                    <div className="text-sm font-bold text-white">وضع القراءة فقط</div>
                    <div className="text-xs text-text-muted">منع المستخدمين من إجراء أي تعديلات أو إعداد تنبيهات</div>
                  </div>
                  <Toggle active={false} />
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                إدارة المستخدمين
              </h2>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="بحث عن مستخدم..." 
                  className="bg-bg-dark border border-border-dark rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-primary"
                />
                <button className="bg-primary text-bg-dark px-3 py-1.5 rounded-lg text-sm font-bold">إضافة</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="text-text-muted border-b border-border-dark">
                    <th className="pb-3 font-medium">الاسم</th>
                    <th className="pb-3 font-medium">البريد الإلكتروني</th>
                    <th className="pb-3 font-medium">الدور</th>
                    <th className="pb-3 font-medium">الحالة</th>
                    <th className="pb-3 font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                  <UserRow name="أحمد محمد" email="ahmed@ltn.ly" role="مدير نظام" status="نشط" />
                  <UserRow name="سالم عبدالله" email="salem@ltn.ly" role="محلل" status="نشط" />
                  <UserRow name="فاطمة علي" email="fatima@ltn.ly" role="مراقب" status="غير نشط" />
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg bg-bg-dark border border-border-dark flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div>
        <div className="text-sm text-text-muted mb-1">{title}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

function ApiConnection({ name, status, latency, error }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-bg-dark rounded-lg border border-border-dark">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${error ? 'bg-danger' : 'bg-success'}`}></div>
        <span className="text-sm font-medium text-white">{name}</span>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="text-text-muted">الاستجابة: <span className={error ? 'text-danger' : 'text-white'}>{latency}</span></span>
        <span className={`px-2 py-1 rounded font-bold ${error ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>{status}</span>
        <button className="text-text-muted hover:text-white"><span className="material-symbols-outlined text-[16px]">more_vert</span></button>
      </div>
    </div>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-primary' : 'bg-border-dark'}`}>
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${active ? 'left-1' : 'right-1'}`}></div>
    </div>
  );
}

function UserRow({ name, email, role, status }: any) {
  const isActive = status === 'نشط';
  return (
    <tr className="hover:bg-bg-dark/50 transition-colors">
      <td className="py-3 text-white font-medium">{name}</td>
      <td className="py-3 text-text-muted">{email}</td>
      <td className="py-3 text-white"><span className="bg-bg-dark border border-border-dark px-2 py-1 rounded text-xs">{role}</span></td>
      <td className="py-3">
        <span className={`text-xs font-bold px-2 py-1 rounded ${isActive ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'}`}>
          {status}
        </span>
      </td>
      <td className="py-3">
        <div className="flex gap-2">
          <button className="text-text-muted hover:text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
          <button className="text-text-muted hover:text-danger"><span className="material-symbols-outlined text-[18px]">delete</span></button>
        </div>
      </td>
    </tr>
  );
}
