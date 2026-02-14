import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function QuotesList() {
  const { t } = useLanguage();
  const { quotes } = useApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('quotes')}</h1>
          <p className="text-slate-500">Manage and generate quotes for your clients.</p>
        </div>
        <Link href="/app/quotes/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {t('newQuote')}
          </Button>
        </Link>
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
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>{t('client')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('address')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('total')}</TableHead>
              <TableHead className="text-right hidden sm:table-cell">{t('date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id} className="cursor-pointer hover:bg-slate-50">
                <TableCell className="font-medium text-blue-600">
                  <Link href={`/app/quotes/${quote.id}`}>{quote.quote_number}</Link>
                </TableCell>
                <TableCell className="font-medium">{quote.client_name}</TableCell>
                <TableCell className="hidden md:table-cell text-slate-500 truncate max-w-[200px]">
                  {quote.client_address}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn("capitalize border-0", getStatusColor(quote.status))}>
                    {t(quote.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold">
                  €{quote.total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell text-slate-500">
                  {new Date(quote.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {quotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No quotes found. Create your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
