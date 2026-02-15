import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Plus, Search, FileText, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const fmt = (n: number) => n.toLocaleString('fr-LU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function QuotesList() {
  const { t } = useLanguage();
  const { quotes, deleteQuote } = useApp();
  const [search, setSearch] = useState('');

  const filtered = quotes.filter(q => {
    const term = search.toLowerCase();
    if (!term) return true;
    return q.client_name.toLowerCase().includes(term) || q.quote_number.toLowerCase().includes(term) || q.client_address.toLowerCase().includes(term);
  });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-amber-100 text-amber-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return (
      <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", styles[status] || styles.draft)}>
        {t(status)}
      </span>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">{t('quotes')}</h1>
          <p className="text-sm text-[#475569] mt-1">{t('manageQuotes')}</p>
        </div>
        <Link href="/app/quotes/new">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> {t('newQuote')}
          </button>
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 max-w-md">
        <Search className="w-4 h-4 text-[#94a3b8]" />
        <input
          type="text"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-[#0f172a] placeholder:text-[#94a3b8]"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">#</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('client')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider hidden md:table-cell">{t('address')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('total')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider hidden sm:table-cell">{t('date')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider w-24">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} className="border-b border-slate-100 hover:bg-[#f0f7ff] transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/app/quotes/${q.id}`}>
                        <span className="text-blue-600 font-medium hover:underline cursor-pointer">{q.quote_number}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0f172a]">{q.client_name}</td>
                    <td className="px-4 py-3 text-[#475569] truncate max-w-[200px] hidden md:table-cell">{q.client_address}</td>
                    <td className="px-4 py-3">{statusBadge(q.status)}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#0f172a] tabular-nums">€{fmt(q.total)}</td>
                    <td className="px-4 py-3 text-right text-[#475569] hidden sm:table-cell">{new Date(q.created_at).toLocaleDateString('pt-PT')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/app/quotes/${q.id}`}>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title={t('edit')}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button onClick={() => { if (confirm(t('deleteConfirm'))) deleteQuote(q.id); }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title={t('delete')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 py-16 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#0f172a]">{search ? t('noResults') : t('noQuotes')}</h3>
          <p className="text-sm text-[#94a3b8] mt-1">{t('noQuotesDesc')}</p>
          {!search && (
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/app/quotes/new">
                <button className="px-4 py-2 bg-[#2563eb] text-white rounded-md text-sm font-medium hover:bg-[#1d4ed8] transition-colors">{t('newQuote')}</button>
              </Link>
              <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-md text-sm font-medium cursor-not-allowed">
                {t('generateAI')} <span className="text-xs ml-1">({t('aiComingSoon')})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
