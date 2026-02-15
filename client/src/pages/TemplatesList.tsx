import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Copy, Files, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TemplatesList() {
  const { t } = useLanguage();
  const { templates, addTemplate, deleteTemplate } = useApp();
  const { toast } = useToast();

  const duplicateTemplate = (tpl: any) => {
    const newTpl = {
      ...tpl,
      id: Math.random().toString(36).substr(2, 9),
      name: `${tpl.name} (copy)`,
      is_system_template: false,
      sections: tpl.sections.map((s: any) => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9),
        items: s.items.map((i: any) => ({ ...i, id: Math.random().toString(36).substr(2, 9) })),
      })),
    };
    addTemplate(newTpl);
    toast({ title: t('success'), description: t('duplicate') });
  };

  const totalItems = (tpl: any) => tpl.sections.reduce((s: number, sec: any) => s + (sec.items?.length || 0), 0);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">{t('templates')}</h1>
        <p className="text-sm text-[#475569] mt-1">{t('manageTemplates')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[#0f172a] truncate">{tpl.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                    tpl.is_system_template ? "bg-slate-100 text-[#475569]" : "bg-blue-100 text-blue-700"
                  )}>
                    {tpl.is_system_template ? t('systemTemplate') : t('customTemplate')}
                  </span>
                </div>
              </div>
              <Files className="w-5 h-5 text-slate-400 shrink-0" />
            </div>

            <div className="text-xs text-[#475569] space-y-1 mb-4">
              <p>{tpl.sections.length} {t('sections')} · {totalItems(tpl)} {t('items')}</p>
              {tpl.sections.slice(0, 3).map((s: any) => (
                <p key={s.id} className="text-[#94a3b8] truncate">· {s.name}</p>
              ))}
              {tpl.sections.length > 3 && (
                <p className="text-[#94a3b8]">+ {tpl.sections.length - 3} ...</p>
              )}
            </div>

            <div className="flex gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => duplicateTemplate(tpl)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Copy className="w-3 h-3" /> {t('duplicate')}
              </button>
              {!tpl.is_system_template && (
                <button
                  onClick={() => { if (confirm(t('deleteConfirm'))) deleteTemplate(tpl.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors ml-auto"
                >
                  <Trash2 className="w-3 h-3" /> {t('delete')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
