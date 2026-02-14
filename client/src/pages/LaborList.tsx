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

const TRADES = ['Masonry', 'Tiling', 'Painting', 'Plumbing', 'Electrical', 'Carpentry', 'General'];

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
    if (!newLab.name.trim()) {
      toast({ title: "Error", description: "Name is required.", variant: "destructive" });
      return;
    }
    addLabor({
      id: Math.random().toString(36).substr(2, 9),
      ...newLab,
    });
    setNewLab({ name: '', trade: TRADES[0], unit: 'h', price_lux: 0, price_pt: 0 });
    setDialogOpen(false);
    toast({ title: t('save'), description: "Labor entry added." });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('labor')}</h1>
          <p className="text-slate-500">Manage labor rates for different trades.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {t('addLabor')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addLabor')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('name')} *</label>
                <Input value={newLab.name} onChange={(e) => setNewLab({ ...newLab, name: e.target.value })} placeholder="Worker type" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('trade')}</label>
                  <Select value={newLab.trade} onValueChange={(v) => setNewLab({ ...newLab, trade: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TRADES.map(tr => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('unit')}</label>
                  <Select value={newLab.unit} onValueChange={(v) => setNewLab({ ...newLab, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h">h</SelectItem>
                      <SelectItem value="m2">m2</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="un">un</SelectItem>
                      <SelectItem value="vg">vg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('priceLux')}</label>
                  <Input type="number" value={newLab.price_lux} onChange={(e) => setNewLab({ ...newLab, price_lux: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{t('pricePt')}</label>
                  <Input type="number" value={newLab.price_pt} onChange={(e) => setNewLab({ ...newLab, price_pt: parseFloat(e.target.value) || 0 })} />
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
              <TableHead className="hidden md:table-cell">{t('trade')}</TableHead>
              <TableHead className="w-[80px]">{t('unit')}</TableHead>
              <TableHead className="text-right">{t('priceLux')}</TableHead>
              <TableHead className="text-right">{t('pricePt')}</TableHead>
              <TableHead className="w-[100px] text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="hidden md:table-cell text-slate-500">
                  <Badge variant="secondary" className="font-normal text-xs">{item.trade}</Badge>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="text-right font-medium">€{item.price_lux}</TableCell>
                <TableCell className="text-right font-medium text-slate-600">€{item.price_pt}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                    onClick={() => deleteLabor(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {search ? 'No labor entries match your search.' : 'No labor entries yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
