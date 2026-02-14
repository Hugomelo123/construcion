import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Hammer, Trash2, Edit } from "lucide-react";

export default function MaterialsList() {
  const { t } = useLanguage();
  const { materials, addMaterial, deleteMaterial } = useApp();

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('materials')}</h1>
          <p className="text-slate-500">Manage your material catalog and prices.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('addMaterial')}
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <Input 
          placeholder={t('search')} 
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
            {materials.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="hidden md:table-cell text-slate-500">
                  <Badge variant="outline" className="font-normal text-xs">{item.category.split('/')[0]}</Badge>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="text-right text-slate-500">€{item.cost_price}</TableCell>
                <TableCell className="text-right font-bold text-blue-600">€{item.sell_price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600"
                      onClick={() => deleteMaterial(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
