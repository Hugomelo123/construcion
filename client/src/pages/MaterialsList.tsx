import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Plus, Search, Trash2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  'Carrelage/Cerâmica', 'Peinture/Tintas', 'Colles et Mortiers/Cimentos',
  'Étanchéité/Impermeabilização', 'Sols/Pavimentos', 'Plomberie/Canalização',
  'Électricité/Eletricidade', 'Quincaillerie/Ferragens', 'Isolation/Isolamento',
  'Bois/Madeiras', 'Autre/Outros',
];

export default function MaterialsList() {
  const { t } = useLanguage();
  const { materials, addMaterial, deleteMaterial } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMat, setNewMat] = useState({ name: '', category: CATEGORIES[0], unit: 'un', cost_price: 0, sell_price: 0, supplier: '', reference: '' });

  const filtered = materials.filter(m => {
    const term = search.toLowerCase();
    const matchSearch = !term || m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term);
    const matchCat = catFilter === 'all' || m.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    if (!newMat.name.trim()) { toast({ title: t('error'), description: t('required'), variant: "destructive" }); return; }
    addMaterial({ id: Math.random().toString(36).substr(2, 9), ...newMat, category: newMat.category as any });
    setNewMat({ name: '', category: CATEGORIES[0], unit: 'un', cost_price: 0, sell_price: 0, supplier: '', reference: '' });
    setDialogOpen(false);
    toast({ title: t('success'), description: t('materialAdded') });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">{t('materials')}</h1>
          <p className="text-sm text-[#475569] mt-1">{t('manageMaterials')}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> {t('addMaterial')}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-xl">
            <DialogHeader><DialogTitle>{t('addMaterial')}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('name')} <span className="text-red-500">*</span></label>
                <Input value={newMat.name} onChange={(e) => setNewMat({ ...newMat, name: e.target.value })} placeholder="Ex: Carrelage 60x60" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('category')}</label>
                  <Select value={newMat.category} onValueChange={(v) => setNewMat({ ...newMat, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.split('/')[0]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('unit')}</label>
                  <Select value={newMat.unit} onValueChange={(v) => setNewMat({ ...newMat, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['un', 'm²', 'ml', 'kg', 'L', 'vg'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('cost')} (€)</label>
                  <Input type="number" step="0.01" value={newMat.cost_price} onChange={(e) => setNewMat({ ...newMat, cost_price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('sellPrice')} (€)</label>
                  <Input type="number" step="0.01" value={newMat.sell_price} onChange={(e) => setNewMat({ ...newMat, sell_price: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('supplier')}</label>
                  <Input value={newMat.supplier} onChange={(e) => setNewMat({ ...newMat, supplier: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-[#475569]">{t('reference')}</label>
                  <Input value={newMat.reference} onChange={(e) => setNewMat({ ...newMat, reference: e.target.value })} />
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

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94a3b8]" />
          <input type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[#94a3b8]" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-48 bg-white"><SelectValue placeholder={t('allCategories')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.split('/')[0]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider hidden md:table-cell">{t('category')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider w-20">{t('unit')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('cost')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{t('sellPrice')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 hover:bg-[#f0f7ff] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#0f172a]">{m.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-[#475569]">{m.category.split('/')[0]}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-[#475569]">{m.unit}</td>
                    <td className="px-4 py-3 text-right text-[#475569] tabular-nums">€{m.cost_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 tabular-nums">€{m.sell_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { if (confirm(t('deleteConfirm'))) { deleteMaterial(m.id); toast({ title: t('success'), description: t('materialDeleted') }); }}} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
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
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#0f172a]">{search || catFilter !== 'all' ? t('noResults') : t('noMaterials')}</h3>
          <p className="text-sm text-[#94a3b8] mt-1">{t('noMaterialsDesc')}</p>
        </div>
      )}
    </Layout>
  );
}
