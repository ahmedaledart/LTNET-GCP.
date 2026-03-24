import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  
  const links = [
    { to: "/dashboard", icon: "dashboard", label: "نظرة عامة" },
    { to: "/map", icon: "map", label: "الخريطة والتتبع" },
    { to: "/reports", icon: "analytics", label: "التقارير الذكية" },
    { to: "/admin", icon: "admin_panel_settings", label: "لوحة الإدارة" },
  ];

  return (
    <aside className={cn("w-64 bg-surface-dark border-l border-border-dark flex flex-col h-[calc(100vh-73px)] sticky top-[73px]", className)}>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-text-muted hover:bg-bg-dark hover:text-white"
              )}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
