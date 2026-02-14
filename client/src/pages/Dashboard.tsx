import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Plus, FileText, Hammer, Package, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { t } = useLanguage();
  const { quotes } = useApp();

  // Mock data for the chart
  const data = [
    { name: "Set", total: 4000 },
    { name: "Out", total: 3000 },
    { name: "Nov", total: 2000 },
    { name: "Dez", total: 2780 },
    { name: "Jan", total: 1890 },
    { name: "Fev", total: 2390 },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('dashboard')}</h1>
        <p className="text-slate-500">{t('overview')}</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total {t('quotes')}
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              {t('activeValue')}
            </CardTitle>
            <div className="text-lg font-bold text-green-600">€</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              {t('conversionRate')}
            </CardTitle>
            <div className="text-lg font-bold text-blue-500">%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              {t('avgQuoteValue')}
            </CardTitle>
            <div className="text-lg font-bold text-orange-500">€</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€3,400</div>
            <p className="text-xs text-muted-foreground">Based on accepted quotes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('overview')}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-blue-600" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/app/quotes/new">
                <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t('generateAI')}
                </Button>
              </Link>
              <Link href="/app/quotes/new">
                <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50" size="lg">
                  <FileText className="mr-2 h-5 w-5" />
                  {t('newQuote')}
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/app/materials">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Package className="mr-2 h-4 w-4" />
                    {t('materials')}
                  </Button>
                </Link>
                <Link href="/app/labor">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Hammer className="mr-2 h-4 w-4" />
                    {t('labor')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('recentQuotes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotes.slice(0, 3).map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{quote.client_name}</p>
                      <p className="text-xs text-muted-foreground">{quote.quote_number}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-sm">€{quote.total.toFixed(2)}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold",
                        quote.status === 'sent' && "bg-blue-100 text-blue-700",
                        quote.status === 'accepted' && "bg-green-100 text-green-700",
                        quote.status === 'draft' && "bg-yellow-100 text-yellow-700",
                        quote.status === 'rejected' && "bg-red-100 text-red-700",
                      )}>
                        {t(quote.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
