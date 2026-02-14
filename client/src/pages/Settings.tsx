import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { t } = useLanguage();
  const { settings, updateSettings } = useApp();
  const { toast } = useToast();
  const [form, setForm] = useState(settings);

  const handleSave = () => {
    if (!form.company_name.trim()) {
      toast({ title: "Error", description: "Company name is required.", variant: "destructive" });
      return;
    }
    updateSettings(form);
    toast({ title: t('save'), description: "Settings saved successfully." });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('settings')}</h1>
        <p className="text-slate-500">Configure your company details and defaults.</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>This information will appear on your quotes and PDF exports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name *</label>
                <Input
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">NIF / Tax ID</label>
                <Input
                  value={form.company_nif}
                  onChange={(e) => setForm({ ...form, company_nif: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={form.company_address}
                onChange={(e) => setForm({ ...form, company_address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.company_email}
                  onChange={(e) => setForm({ ...form, company_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={form.company_phone}
                  onChange={(e) => setForm({ ...form, company_phone: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Defaults</CardTitle>
            <CardDescription>Default settings for new quotes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default VAT (%)</label>
                <Input
                  type="number"
                  value={form.default_iva}
                  onChange={(e) => setForm({ ...form, default_iva: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Validity (days)</label>
                <Input
                  type="number"
                  value={form.default_validity_days}
                  onChange={(e) => setForm({ ...form, default_validity_days: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input defaultValue="EUR" disabled />
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Default Payment Conditions</label>
               <Input
                 value={form.default_payment_conditions}
                 onChange={(e) => setForm({ ...form, default_payment_conditions: e.target.value })}
               />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
}
