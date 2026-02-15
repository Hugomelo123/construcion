import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { FileText, TrendingUp, Percent, Calculator, Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const fmt = (n: number) => n.toLocaleString('fr-LU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Dashboard() {
  const { t } = useLanguage();
  const { quotes } = useApp();

  const totalValue = quotes.reduce((s, q) => s + (q.total || 0), 0);
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted');
  const conversionRate = quotes.length > 0 ? Math.round((acceptedQuotes.length / quotes.length) * 100) : 0;
  const avgValue = quotes.length > 0 ? totalValue / quotes.length : 0;

  const chartData = [
    { name: 'Set', total: 4200 }, { name: 'Out', total: 3800 },
    { name: 'Nov', total: 5100 }, { name: 'Dez', total: 6780 },
    { name: 'Jan', total: 4890 }, { name: 'Fev', total: totalValue || 7390 },
  ];

  const metrics = [
    { label: t('totalQuotes'), value: String(quotes.length), trend: '+2', icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { label: t('activeValue'), value: `€${fmt(totalValue)}`, trend: '+19%', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
    { label: t('conversionRate'), value: `${conversionRate}%`, trend: '+5%', icon: Percent, color: 'bg-amber-100 text-amber-600' },
    { label: t('avgQuoteValue'), value: `€${fmt(avgValue)}`, trend: null, icon: Calculator, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">{t('dashboard')}</h1>
        <p className="text-sm text-[#475569] mt-1">{t('overview')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{m.label}</p>
                <p className="text-2xl font-bold text-[#0f172a] mt-2 tabular-nums">{m.value}</p>
                {m.trend && <p className="text-xs text-emerald-600 font-medium mt-1">{m.trend} {t('fromLastMonth')}</p>}
              </div>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", m.color)}>
                <m.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-[#0f172a] mb-4">{t('overview')}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip cursor={{ fill: 'rgba(37,99,235,0.05)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 13 }} formatter={(value: number) => [`€${fmt(value)}`, 'Total']} />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-3">{t('quickActions')}</h3>
            <div className="space-y-2">
              <Link href="/app/quotes/new">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> {t('newQuote')}
                </button>
              </Link>
              <button disabled className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 text-slate-400 rounded-md text-sm font-medium cursor-not-allowed">
                <Calculator className="w-4 h-4" /> {t('generateAI')}
                <span className="ml-auto text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{t('aiComingSoon')}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0f172a]">{t('recentQuotes')}</h3>
              <Link href="/app/quotes"><span className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">{t('viewAll')} <ArrowRight className="w-3 h-3" /></span></Link>
            </div>
            <div className="space-y-1">
              {quotes.slice(0, 4).map((q) => (
                <Link key={q.id} href={`/app/quotes/${q.id}`}>
                  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-md transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0f172a] truncate">{q.client_name}</p>
                      <p className="text-xs text-[#94a3b8]">{q.quote_number}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                      <span className="text-sm font-bold tabular-nums">€{fmt(q.total)}</span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold",
                        q.status === 'draft' && "bg-amber-100 text-amber-700",
                        q.status === 'sent' && "bg-blue-100 text-blue-700",
                        q.status === 'accepted' && "bg-emerald-100 text-emerald-700",
                        q.status === 'rejected' && "bg-red-100 text-red-700",
                      )}>{t(q.status)}</span>
                    </div>
                  </div>
                </Link>
              ))}
              {quotes.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-[#94a3b8]">{t('noQuotes')}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">{t('noQuotesDesc')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
