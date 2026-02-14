import { Link, useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Package, Hammer, Files, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
// Import the logo we generated (important: importing images in Vite)
import logoImg from "@/assets/logo.png";

export function Sidebar() {
  const { t, language, setLanguage } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '/app' },
    { icon: FileText, label: t('quotes'), href: '/app/quotes' },
    { icon: Package, label: t('materials'), href: '/app/materials' },
    { icon: Hammer, label: t('labor'), href: '/app/labor' },
    { icon: Files, label: t('templates'), href: '/app/templates' },
    { icon: Settings, label: t('settings'), href: '/app/settings' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[var(--color-brand-navy)] text-white">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <img src={logoImg} alt="OrçaPro" className="w-8 h-8 object-contain bg-white rounded-md p-1" />
        <span className="font-bold text-xl tracking-tight">OrçaPro</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer",
                location === item.href || (item.href !== '/app' && location.startsWith(item.href))
                  ? "bg-blue-600 text-white shadow-md font-medium"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-4">
        {/* Language Toggle */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setLanguage('pt')}
            className={cn(
              "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
              language === 'pt' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
            )}
          >
            PT
          </button>
          <button
            onClick={() => setLanguage('fr')}
            className={cn(
              "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
              language === 'fr' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
            )}
          >
            FR
          </button>
        </div>

        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Jean Dupont</p>
            <p className="text-xs text-slate-400 truncate">Admin</p>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden bg-slate-900 text-white">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 bg-[var(--color-brand-navy)]">
        <NavContent />
      </div>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="md:pl-64 min-h-screen transition-all duration-200">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
