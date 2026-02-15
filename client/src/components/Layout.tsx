import { Link, useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Package, Hammer, Files, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '/app' },
    { icon: FileText, label: t('quotes'), href: '/app/quotes' },
    { icon: Package, label: t('materials'), href: '/app/materials' },
    { icon: Hammer, label: t('labor'), href: '/app/labor' },
    { icon: Files, label: t('templates'), href: '/app/templates' },
    { icon: Settings, label: t('settings'), href: '/app/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/app') return location === '/' || location === '/app';
    return location.startsWith(href);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#1e293b] text-white">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-tight">OrçaPro</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-all duration-150",
                isActive(item.href)
                  ? "bg-blue-600/20 text-white border-l-[3px] border-blue-500 ml-0 pl-[9px]"
                  : "text-slate-400 hover:text-white hover:bg-[#334155]"
              )}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-3 border-t border-white/10 pt-3 shrink-0">
        <div className="flex bg-[#0f172a] rounded-lg p-1">
          <button
            onClick={() => setLanguage('pt')}
            className={cn(
              "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all duration-150",
              language === 'pt' ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
            )}
          >PT</button>
          <button
            onClick={() => setLanguage('fr')}
            className={cn(
              "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all duration-150",
              language === 'fr' ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
            )}
          >FR</button>
        </div>

        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">LB</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">LuxBuild</p>
            <p className="text-xs text-slate-500 truncate">Admin</p>
          </div>
          <button className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-md hover:bg-white/5">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-3 left-3 z-50 p-2 bg-[#1e293b] text-white rounded-lg shadow-lg">
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[280px] h-full shadow-2xl animate-slide-in-left">
            <NavContent />
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 z-40">
        <NavContent />
      </div>

      <main className="md:pl-60 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .animate-slide-in-left { animation: slideInLeft 200ms ease-out; }
      `}</style>
    </div>
  );
}
