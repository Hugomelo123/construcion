import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  'Carrelage/Cerâmica',
  'Peinture/Tintas',
  'Colles et Mortiers/Cimentos',
  'Plomberie/Canalização',
  'Électricité/Eletricidade',
  'Bois/Madeiras',
  'Autre/Outros',
];

export default function MaterialsList() {
  const { t } = useLanguage();
  const { materials, addMaterial, deleteMaterial } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [newMat, setNewMat] = useState({ name: '', category: CATEGORIES[0], unit: 'un', cost_price: 0, sell_price: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = materials.filter(m => {
    const term = search.toLowerCase();
    if (!term) return true;
    return m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term);
  });

  const handleAdd = () => {
    if (!newMat.name.trim()) {
      toast({ title: "Error", description: "Name is required.", variant: "destructive" });
      return;
    }
    addMaterial({
      id: Math.random().toString(36).substr(2, 9),
      ...newMat,
      category: newMat.category as any,
    });
    setNewMat({ name: '', category: CATEGORIES[0], unit: 'un', cost_price: 0, sell_price: 0 });
    setDialogOpen(false);
    toast({ title: t('save'), description: "Material added." });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('materials')}</h1>
          <p className="text-slate-500">Manage your material catalog and prices.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {t('addMaterial')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addMaterial')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('name')} *</label>
                <Input value={newMat.name} onChange={(e) => setNewMat({ ...newMat, name: e.target.value })} placeholder="Material name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('category')}</label>
                  <Select value={newMat.category} onValueChange={(v) => setNewMat({ ...newMat, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('unit')}</label>
                  <Select value={newMat.unit} onValueChange={(v) => setNewMat({ ...newMat, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="un">un</SelectItem>
                      <SelectItem value="m2">m2</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('cost')}</label>
                  <Input type="number" value={newMat.cost_price} onChange={(e) => setNewMat({ ...newMat, cost_price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('price')}</label>
                  <Input type="number" value={newMat.sell_price} onChange={(e) => setNewMat({ ...newMat, sell_price: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">{t('save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 h-9"
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('category')}</TableHead>
              <TableHead className="w-[80px]">{t('unit')}</TableHead>
              <TableHead className="text-right">{t('cost')}</TableHead>
              <TableHead className="text-right font-bold">{t('price')}</TableHead>
              <TableHead className="w-[100px] text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="hidden md:table-cell text-slate-500">
                  <Badge variant="outline" className="font-normal text-xs">{item.category.split('/')[0]}</Badge>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="text-right text-slate-500">€{item.cost_price}</TableCell>
                <TableCell className="text-right font-bold text-blue-600">€{item.sell_price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                    onClick={() => deleteMaterial(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {search ? 'No materials match your search.' : 'No materials yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
