import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function Header({ className }: { className?: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className={cn("flex items-center justify-between px-6 py-4 bg-surface-dark border-b border-border-dark sticky top-0 z-50", className)}>
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img 
            src="https://i.postimg.cc/DZVN4Sb1/nshrt-asʿar-alnft-w-alslʿ-covered-07-1-removebg-preview.png" 
            alt="شعار شبكة ليبيا للتجارة" 
            className="h-16 md:h-20 object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl md:text-2xl leading-tight text-white">شبكة ليبيا للتجارة</span>
            <span className="text-sm text-primary">منصة الأسعار العالمية</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-text-muted bg-bg-dark px-4 py-2 rounded-full border border-border-dark">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          تحديث مباشر
        </div>
        <div className="h-8 w-px bg-border-dark mx-2"></div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-white">{user.displayName || "مستخدم"}</div>
              <button onClick={logout} className="text-xs text-danger hover:underline">تسجيل الخروج</button>
            </div>
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=e0b629&color=12110a`} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border border-primary"
            />
          </div>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-bg-dark rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            تسجيل الدخول
          </button>
        )}
      </div>
    </header>
  );
}
