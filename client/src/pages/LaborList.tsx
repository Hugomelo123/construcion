import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Plus, Search, Trash2, Hammer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const TRADES = [
  'Maçonnerie / Alvenaria', 'Carrelage / Ladrilhos', 'Peinture / Pintura',
  'Plomberie / Canalização', 'Électricité / Eletricidade', 'Plâtrerie / Estuque',
  'Menuiserie / Carpintaria', 'Serrurerie / Serralharia', 'Démolition / Demolição',
  'Général / Geral',
];

export default function LaborList() {
  const { t } = useLanguage();
  const { labor, addLabor, deleteLabor } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLab, setNewLab] = useState({ name: '', trade: TRADES[0], unit: 'h', price_lux: 0, price_pt: 0 });

  const filtered = labor.filter(l => {
    const term = search.toLowerCase();
    if (!term) return true;
    return l.name.toLowerCase().includes(term) || l.trade.toLowerCase().includes(term);
  });

  const handleAdd = () => {
    if (!newLab.name.trim()) { toast({ title: t('error'), description: t('required'), variant: "destructive" }); return; }
    addLabor({ id: Math.random().toString(36).substr(2, 9), ...newLab });
    setNewLab({ name: '', trade: TRADES[0], unit: 'h', price_lux: 0, price_pt: 0 });
    setDialogOpen(false);
    toast({ title: t('success'), description: t('laborAdded') });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">{t('labor')}</h1>
          <p className="text-sm text-[#475569] mt-1">{t('manageLabor')}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> {t('addLabor')}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-xl">
            <DialogHeader><DialogTitle>{t('addLabor')}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('name')} <span className="text-red-500">*</span></label>
                <Input value={newLab.name} onChange={(e) => setNewLab({ ...newLab, name: e.target.value })} placeholder="Ex: Carreleur / Ladrilhador" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('trade')}</label>
                  <Select value={newLab.trade} onValueChange={(v) => setNewLab({ ...newLab, trade: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TRADES.map(tr => <SelectItem key={tr} value={tr}>{tr.split(' / ')[0]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('unit')}</label>
                  <Select value={newLab.unit} onValueChange={(v) => setNewLab({ ...newLab, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['h', 'm²', 'ml', 'un', 'vg'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('priceLux')} (€)</label>
                  <Input type="number" step="0.01" value={newLab.price_lux} onChange={(e) => setNewLab({ ...newLab, price_lux: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('pricePt')} (€)</label>
                  <Input type="number" step="0.01" value={newLab.price_pt} onChange={(e) => setNewLab({ ...newLab, price_pt: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
              <Button onClick={handleAdd} className="bg-[#2563eb] hover:bg-[#1d4ed8]">{t('save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 max-w-md">
        <Search className="w-4 h-4 text-[#94a3b8]" />
        <input type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[#94a3b8]" />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider hidden md:table-cell">{t('trade')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider w-20">{t('unit')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('priceLux')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('pricePt')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 hover:bg-[#f0f7ff] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#0f172a]">{l.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-[#475569]">{l.trade.split(' / ')[0]}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-[#475569]">{l.unit}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 tabular-nums">€{l.price_lux.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-[#475569] tabular-nums">€{l.price_pt.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { if (confirm(t('deleteConfirm'))) { deleteLabor(l.id); toast({ title: t('success'), description: t('laborDeleted') }); }}} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 py-16 text-center">
          <Hammer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#0f172a]">{search ? t('noResults') : t('noLabor')}</h3>
          <p className="text-sm text-[#94a3b8] mt-1">{t('noLaborDesc')}</p>
        </div>
      )}
    </Layout>
  );
}
