import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Building2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { t } = useLanguage();
  const { settings, updateSettings } = useApp();
  const { toast } = useToast();
  const [form, setForm] = useState({ ...settings, default_margin: 30, quote_prefix: 'Q', default_execution: '3-4 semaines', footer_note: '', primary_market: 'luxembourg' as string });

  const handleSave = () => {
    if (!form.company_name.trim()) { toast({ title: t('error'), description: t('required'), variant: "destructive" }); return; }
    updateSettings(form);
    toast({ title: t('success'), description: t('settingsSaved') });
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">{t('settings')}</h1>
        <p className="text-sm text-[#475569] mt-1">{t('companyInfoDesc')}</p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Company Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-[#0f172a]">{t('companyInfo')}</h2>
          </div>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('companyName')} <span className="text-red-500">*</span></label>
                <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('taxId')}</label>
                <Input value={form.company_nif} onChange={(e) => setForm({ ...form, company_nif: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-[#475569]">{t('address')}</label>
              <Input value={form.company_address} onChange={(e) => setForm({ ...form, company_address: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('email')}</label>
                <Input type="email" value={form.company_email} onChange={(e) => setForm({ ...form, company_email: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('phone')}</label>
                <Input value={form.company_phone} onChange={(e) => setForm({ ...form, company_phone: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Quote Defaults */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-[#0f172a]">{t('quoteDefaults')}</h2>
          </div>
          <p className="text-sm text-[#475569] mb-4">{t('quoteDefaultsDesc')}</p>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('defaultVat')}</label>
                <Input type="number" value={form.default_iva} onChange={(e) => setForm({ ...form, default_iva: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('defaultValidity')}</label>
                <Select value={String(form.default_validity_days)} onValueChange={(v) => setForm({ ...form, default_validity_days: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 {t('days')}</SelectItem>
                    <SelectItem value="30">30 {t('days')}</SelectItem>
                    <SelectItem value="60">60 {t('days')}</SelectItem>
                    <SelectItem value="90">90 {t('days')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('defaultMargin')}</label>
                <Input type="number" value={form.default_margin} onChange={(e) => setForm({ ...form, default_margin: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('quotePrefix')}</label>
                <Input value={form.quote_prefix} onChange={(e) => setForm({ ...form, quote_prefix: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-[#475569]">{t('primaryMarket')}</label>
                <Select value={form.primary_market} onValueChange={(v) => setForm({ ...form, primary_market: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxembourg">{t('luxembourg')} (17% TVA)</SelectItem>
                    <SelectItem value="portugal">{t('portugal')} (23% IVA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-[#475569]">{t('defaultPayment')}</label>
              <Textarea
                value={form.default_payment_conditions}
                onChange={(e) => setForm({ ...form, default_payment_conditions: e.target.value })}
                className="min-h-[60px] resize-y"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-[#475569]">{t('defaultExecution')}</label>
              <Input value={form.default_execution} onChange={(e) => setForm({ ...form, default_execution: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-[#475569]">{t('footerNote')}</label>
              <Textarea
                value={form.footer_note}
                onChange={(e) => setForm({ ...form, footer_note: e.target.value })}
                placeholder="Ex: Merci pour votre confiance / Obrigado pela confiança"
                className="min-h-[60px] resize-y"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-[#2563eb] hover:bg-[#1d4ed8] px-6">
            <Save className="w-4 h-4 mr-2" /> {t('saveChanges')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
