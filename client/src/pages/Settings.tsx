import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { t } = useLanguage();
  const { toast } = useToast();

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
            <CardDescription>This information will appear on your quotes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input defaultValue="LuxBuild Construction Sàrl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">NIF / Tax ID</label>
                <Input defaultValue="LU12345678" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input defaultValue="123 Route d'Arlon, L-8008 Strassen" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="contact@luxbuild.lu" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input defaultValue="+352 691 123 456" />
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
                <Input type="number" defaultValue="17" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Validity (days)</label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input defaultValue="EUR (€)" disabled />
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Default Payment Conditions</label>
               <Input defaultValue="30% acompte, 30% démarrage, 30% avancement, 10% réception" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast({ title: "Settings saved" })}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
}
