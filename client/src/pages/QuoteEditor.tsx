import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Quote, QuoteSection, QuoteItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save, FileDown, Copy, Sparkles, Plus, Trash2, GripVertical,
  Send, CheckCircle2, XCircle, BookmarkPlus, ArrowLeft, Clock,
  User, MapPin, Mail, Phone, FileText, Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";

const generateId = () => Math.random().toString(36).substr(2, 9);

// European currency format: €1.234,56
const fmt = (n: number) =>
  new Intl.NumberFormat('fr-LU', { style: 'currency', currency: 'EUR' }).format(n);

// Clean number display for PDF (no currency symbol)
const fmtNum = (n: number) =>
  new Intl.NumberFormat('fr-LU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// Sanitize text for safe PDF output
function sanitizeText(text: string | undefined | null): string {
  if (!text) return '';
  return String(text).replace(/[^\x20-\x7E\u00C0-\u024F\u1E00-\u1EFF ]/g, '');
}

// Section border colors (rotating)
const SECTION_COLORS = [
  { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', rgb: [37, 99, 235] },
  { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', rgb: [16, 185, 129] },
  { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', rgb: [249, 115, 22] },
  { border: 'border-l-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', rgb: [139, 92, 246] },
  { border: 'border-l-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', rgb: [244, 63, 94] },
  { border: 'border-l-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-700', rgb: [6, 182, 212] },
];

export default function QuoteEditor() {
  const { t, language } = useLanguage();
  const { quotes, addQuote, updateQuote, deleteQuote, materials, labor, templates, addTemplate, settings } = useApp();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/app/quotes/:id");
  const { toast } = useToast();

  const isNew = params?.id === "new" || !params?.id;
  const existingQuote = !isNew ? quotes.find(q => q.id === params?.id) : null;

  const [quote, setQuote] = useState<Quote>(existingQuote || {
    id: generateId(),
    quote_number: `${settings.company_name ? 'Q' : 'Q'}-${new Date().getFullYear()}-${String((quotes?.length || 0) + 1).padStart(3, '0')}`,
    client_name: '',
    client_address: '',
    client_email: '',
    client_phone: '',
    status: 'draft',
    validity_days: settings.default_validity_days || 30,
    discount_percentage: 0,
    iva_rate: settings.default_iva || 17,
    created_at: new Date().toISOString(),
    notes: '',
    payment_conditions: settings.default_payment_conditions || '',
    execution_timeframe: '',
    sections: [],
    total_materials: 0,
    total_labor: 0,
    subtotal: 0,
    discount_amount: 0,
    iva_amount: 0,
    total: 0
  });

  const [catalogSearch, setCatalogSearch] = useState('');
  const [laborSearch, setLaborSearch] = useState('');
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges = useRef(false);

  // Load existing quote if accessed via URL
  useEffect(() => {
    if (!isNew && existingQuote) {
      setQuote(existingQuote);
    }
  }, [existingQuote, isNew]);

  // Stable calculation using useMemo
  const calculatedTotals = useMemo(() => {
    let matTotal = 0;
    let labTotal = 0;

    const updatedSections = (quote.sections || []).map(section => {
      let secTotal = 0;
      const updatedItems = (section.items || []).map(item => {
        const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
        secTotal += itemTotal;
        if (item.item_type === 'material') matTotal += itemTotal;
        else labTotal += itemTotal;
        return { ...item, total: itemTotal };
      });
      return { ...section, items: updatedItems, subtotal: secTotal };
    });

    const subTotal = matTotal + labTotal;
    const discountAmt = subTotal * ((quote.discount_percentage || 0) / 100);
    const afterDiscount = subTotal - discountAmt;
    const ivaAmt = afterDiscount * ((quote.iva_rate || 0) / 100);

    return {
      sections: updatedSections,
      total_materials: matTotal,
      total_labor: labTotal,
      subtotal: subTotal,
      discount_amount: discountAmt,
      iva_amount: ivaAmt,
      total: afterDiscount + ivaAmt,
    };
  }, [quote.sections, quote.discount_percentage, quote.iva_rate]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isNew && hasChanges.current) {
      const timer = setTimeout(() => {
        performSave(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [quote]);

  // Track changes
  useEffect(() => {
    if (!isNew) hasChanges.current = true;
  }, [quote.client_name, quote.client_address, quote.client_email, quote.client_phone,
      quote.sections, quote.notes, quote.discount_percentage, quote.iva_rate,
      quote.validity_days, quote.payment_conditions, quote.execution_timeframe]);

  const performSave = useCallback((isAutoSave = false) => {
    if (!quote.client_name.trim() && !isAutoSave) {
      toast({ title: t('error'), description: t('required') + ": " + t('clientName'), variant: "destructive" });
      return false;
    }

    const quoteToSave = { ...quote, ...calculatedTotals };
    if (isNew) {
      addQuote(quoteToSave);
      if (!isAutoSave) {
        toast({ title: t('success'), description: t('quoteCreated') });
        setLocation('/app/quotes');
      }
    } else {
      updateQuote(quote.id, quoteToSave);
      if (!isAutoSave) {
        toast({ title: t('success'), description: t('quoteUpdated') });
      }
    }
    hasChanges.current = false;
    setLastSaved(new Date());
    return true;
  }, [quote, calculatedTotals, isNew, addQuote, updateQuote, toast, t, setLocation]);

  const handleSave = () => performSave(false);

  // Status flow
  const handleMarkSent = () => {
    if (!quote.client_name.trim()) {
      toast({ title: t('error'), description: t('required') + ": " + t('clientName'), variant: "destructive" });
      return;
    }
    const updated = { ...quote, ...calculatedTotals, status: 'sent' as const };
    setQuote(updated);
    if (isNew) addQuote(updated);
    else updateQuote(quote.id, updated);
    toast({ title: t('success'), description: t('markAsSent') });
  };

  const handleAccept = () => {
    const updated = { ...quote, ...calculatedTotals, status: 'accepted' as const };
    setQuote(updated);
    updateQuote(quote.id, updated);
    toast({ title: t('success'), description: t('accepted') });
  };

  const handleReject = () => {
    const updated = { ...quote, ...calculatedTotals, status: 'rejected' as const };
    setQuote(updated);
    updateQuote(quote.id, updated);
    toast({ title: t('success'), description: t('rejected') });
  };

  const handleDuplicate = () => {
    const newQuote: Quote = {
      ...quote,
      ...calculatedTotals,
      id: generateId(),
      quote_number: `Q-${new Date().getFullYear()}-${String((quotes?.length || 0) + 1).padStart(3, '0')}`,
      status: 'draft',
      created_at: new Date().toISOString(),
      sections: (quote.sections || []).map(s => ({
        ...s, id: generateId(),
        items: (s.items || []).map(i => ({ ...i, id: generateId() }))
      }))
    };
    addQuote(newQuote);
    toast({ title: t('success'), description: t('duplicate') });
    setLocation(`/app/quotes/${newQuote.id}`);
  };

  const handleDelete = () => {
    if (!isNew) {
      deleteQuote(quote.id);
      toast({ title: t('success'), description: t('quoteDeleted') });
    }
    setLocation('/app/quotes');
  };

  const handleSaveAsTemplate = () => {
    const templateName = quote.client_name
      ? `${quote.client_name} - ${quote.quote_number}`
      : quote.quote_number;

    addTemplate({
      id: generateId(),
      name: templateName,
      is_system_template: false,
      sections: (quote.sections || []).map(s => ({
        ...s, id: generateId(),
        items: (s.items || []).map(i => ({ ...i, id: generateId() }))
      }))
    });
    toast({ title: t('success'), description: t('saveAsTemplate') });
  };

  // Section operations
  const addSection = () => {
    setQuote(prev => ({
      ...prev,
      sections: [...(prev.sections || []), {
        id: generateId(),
        name: language === 'pt' ? 'Nova Secção' : 'Nouvelle Section',
        items: [],
        subtotal: 0
      }]
    }));
  };

  const addItem = (sectionId: string, item: QuoteItem) => {
    setQuote(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s =>
        s.id === sectionId ? { ...s, items: [...(s.items || []), item] } : s
      )
    }));
  };

  const updateSectionName = (sectionId: string, name: string) => {
    setQuote(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => s.id === sectionId ? { ...s, name } : s)
    }));
  };

  const deleteSection = (sectionId: string) => {
    setQuote(prev => ({
      ...prev,
      sections: (prev.sections || []).filter(s => s.id !== sectionId)
    }));
  };

  const updateItem = (sectionId: string, itemId: string, field: keyof QuoteItem, value: string | number) => {
    setQuote(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s =>
        s.id === sectionId ? {
          ...s,
          items: (s.items || []).map(i => i.id === itemId ? { ...i, [field]: value } : i)
        } : s
      )
    }));
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    setQuote(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s =>
        s.id === sectionId ? { ...s, items: (s.items || []).filter(i => i.id !== itemId) } : s
      )
    }));
  };

  const applyTemplate = (template: any) => {
    const newSections = (template.sections || []).map((s: any) => ({
      ...s,
      id: generateId(),
      items: (s.items || []).map((i: any) => ({ ...i, id: generateId() }))
    }));
    setQuote(prev => ({
      ...prev,
      sections: [...(prev.sections || []), ...newSections]
    }));
    toast({ title: t('success'), description: t('templateApplied') });
  };

  // Filtered catalogs for search
  const filteredMaterials = materials.filter(m =>
    !catalogSearch || m.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const filteredLabor = labor.filter(l =>
    !laborSearch || l.name.toLowerCase().includes(laborSearch.toLowerCase()) ||
    l.trade.toLowerCase().includes(laborSearch.toLowerCase())
  );

  // ─── PDF Export ──────────────────────────────────────────────────
  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 0;

    // ── Header Bar ──
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 38, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(settings.company_name) || "OrçaPro", margin, 16);

    // Tagline
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Construction & Rénovation", margin, 23);

    // Company details (right side)
    doc.setFontSize(8);
    const companyRight = pageWidth - margin;
    doc.text(sanitizeText(settings.company_address), companyRight, 12, { align: 'right' });
    doc.text(sanitizeText(settings.company_email), companyRight, 17, { align: 'right' });
    doc.text(sanitizeText(settings.company_phone), companyRight, 22, { align: 'right' });
    if (settings.company_nif) {
      doc.text(`NIF: ${sanitizeText(settings.company_nif)}`, companyRight, 27, { align: 'right' });
    }

    y = 48;

    // ── Quote title ──
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${t('quoteDocument')} ${sanitizeText(quote.quote_number)}`, margin, y);
    y += 10;

    // ── Client & Quote Info side by side ──
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(t('client').toUpperCase(), margin, y);
    doc.text(t('date').toUpperCase(), 120, y);

    y += 5;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(quote.client_name), margin, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(quote.created_at).toLocaleDateString('fr-LU'), 120, y);

    y += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(quote.client_address), margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(t('validity').toUpperCase(), 120, y);
    y += 4;
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    const validDate = new Date(quote.created_at);
    validDate.setDate(validDate.getDate() + (quote.validity_days || 30));
    doc.text(validDate.toLocaleDateString('fr-LU'), 120, y);

    if (quote.client_email) {
      doc.text(sanitizeText(quote.client_email), margin, y);
      y += 4;
    }
    if (quote.client_phone) {
      doc.text(sanitizeText(quote.client_phone), margin, y);
      y += 4;
    }

    y += 6;

    // Thin separator line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // ── Sections ──
    (calculatedTotals.sections || []).forEach((section, index) => {
      const color = SECTION_COLORS[index % SECTION_COLORS.length];

      // Check page break
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Section header with colored left bar
      doc.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
      doc.rect(margin, y - 1, 2, 7, 'F');
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(`${index + 1}. ${sanitizeText(section.name)}`, margin + 5, y + 4);

      // Section subtotal on right
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(fmt(section.subtotal || 0), pageWidth - margin, y + 4, { align: 'right' });
      y += 10;

      // Items table
      autoTable(doc, {
        startY: y,
        head: [[
          '#',
          t('description'),
          t('unit'),
          t('quantity'),
          t('unitPrice'),
          t('total')
        ]],
        body: (section.items || []).map((item, idx) => [
          String(idx + 1),
          sanitizeText(item.description),
          sanitizeText(item.unit),
          String(item.quantity || 0),
          fmtNum(item.unit_price || 0) + ' \u20AC',
          fmtNum(item.total || 0) + ' \u20AC'
        ]),
        theme: 'plain',
        headStyles: {
          fillColor: [248, 250, 252],
          textColor: [100, 116, 139],
          fontStyle: 'bold',
          fontSize: 8,
          cellPadding: 3,
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [30, 41, 59],
          cellPadding: 2.5,
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 18, halign: 'right' },
          4: { cellWidth: 28, halign: 'right' },
          5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
        },
        margin: { left: margin, right: margin },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      // @ts-ignore
      y = doc.lastAutoTable.finalY + 8;
    });

    // ── Financial Summary Box ──
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    const boxX = 110;
    const boxW = pageWidth - margin - boxX;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Subtotal materials
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(t('subtotalMaterials'), boxX, y);
    doc.setTextColor(30, 41, 59);
    doc.text(fmt(calculatedTotals.total_materials || 0), pageWidth - margin, y, { align: 'right' });
    y += 5;

    // Subtotal labor
    doc.setTextColor(100, 116, 139);
    doc.text(t('subtotalLabor'), boxX, y);
    doc.setTextColor(30, 41, 59);
    doc.text(fmt(calculatedTotals.total_labor || 0), pageWidth - margin, y, { align: 'right' });
    y += 5;

    // Subtotal
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(t('subtotal'), boxX, y);
    doc.setTextColor(30, 41, 59);
    doc.text(fmt(calculatedTotals.subtotal || 0), pageWidth - margin, y, { align: 'right' });
    y += 5;

    // Discount
    if ((calculatedTotals.discount_amount || 0) > 0) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(220, 38, 38);
      doc.text(`${t('discount')} (${quote.discount_percentage}%)`, boxX, y);
      doc.text(`-${fmt(calculatedTotals.discount_amount || 0)}`, pageWidth - margin, y, { align: 'right' });
      y += 5;
    }

    // IVA
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`${t('iva')} (${quote.iva_rate}%)`, boxX, y);
    doc.setTextColor(30, 41, 59);
    doc.text(fmt(calculatedTotals.iva_amount || 0), pageWidth - margin, y, { align: 'right' });
    y += 7;

    // Total box
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(boxX - 2, y - 4, boxW + 2 + margin - boxX, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(t('total').toUpperCase(), boxX + 2, y + 4);
    doc.text(fmt(calculatedTotals.total || 0), pageWidth - margin - 2, y + 4, { align: 'right' });
    y += 18;

    // ── Notes & Conditions ──
    if (quote.payment_conditions || quote.execution_timeframe || quote.notes) {
      if (y > 250) { doc.addPage(); y = 20; }

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");

      if (quote.payment_conditions) {
        doc.text(t('paymentConditions').toUpperCase(), margin, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        const lines = doc.splitTextToSize(sanitizeText(quote.payment_conditions), contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 4 + 4;
      }

      if (quote.execution_timeframe) {
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "bold");
        doc.text(t('executionTimeframe').toUpperCase(), margin, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(sanitizeText(quote.execution_timeframe), margin, y);
        y += 8;
      }

      if (quote.notes) {
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "bold");
        doc.text(t('notes').toUpperCase(), margin, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        const noteLines = doc.splitTextToSize(sanitizeText(quote.notes), contentWidth);
        doc.text(noteLines, margin, y);
        y += noteLines.length * 4 + 4;
      }
    }

    // ── Footer on every page ──
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, 280, pageWidth - margin, 280);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(t('documentGeneratedBy'), margin, 285);
      doc.text(`${p}/${pageCount}`, pageWidth - margin, 285, { align: 'right' });
    }

    doc.save(`${quote.quote_number}.pdf`);
    toast({ title: t('success'), description: t('pdfGenerated') });
  };

  // ─── Status badge styling ──
  const statusConfig: Record<string, { color: string; icon: any }> = {
    draft: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    sent: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Send },
    accepted: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  };

  const StatusIcon = statusConfig[quote.status]?.icon || Clock;

  return (
    <Layout>
      {/* ─── Top Bar ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/app/quotes')}
            className="h-9 w-9 text-slate-400 hover:text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isNew ? t('newQuote') : quote.quote_number}
              </h1>
              <Badge variant="outline" className={cn(
                "gap-1 font-medium",
                statusConfig[quote.status]?.color
              )}>
                <StatusIcon className="w-3 h-3" />
                {t(quote.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-sm mt-1">
              <span>{t('createdAt')} {new Date(quote.created_at).toLocaleDateString('fr-LU')}</span>
              {lastSaved && (
                <span className="text-emerald-600 text-xs">
                  Auto-saved {lastSaved.toLocaleTimeString('fr-LU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Template dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                <Copy className="w-4 h-4" /> {t('applyTemplate')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('applyTemplate')}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2 py-4 max-h-[400px] overflow-y-auto">
                {(templates || []).map(tpl => (
                  <DialogClose key={tpl.id} asChild>
                    <Button
                      variant="ghost"
                      className="justify-start h-auto py-3 px-4 border border-slate-100 hover:border-blue-200 hover:bg-blue-50"
                      onClick={() => applyTemplate(tpl)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{tpl.name}</div>
                        <div className="text-xs text-slate-500">
                          {(tpl.sections || []).length} {t('sections')} &middot; {(tpl.sections || []).reduce((acc, s) => acc + (s.items?.length || 0), 0)} {t('items')}
                        </div>
                      </div>
                    </Button>
                  </DialogClose>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* AI button (disabled) */}
          <Button
            variant="outline"
            size="sm"
            disabled
            className="gap-1.5 text-purple-400 border-purple-100 cursor-not-allowed opacity-60"
          >
            <Sparkles className="w-4 h-4" /> {t('generateAI')}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1 border-purple-200 text-purple-400">{t('aiComingSoon')}</Badge>
          </Button>

          <Button variant="outline" size="sm" onClick={exportPDF} className="gap-1.5 text-slate-600">
            <FileDown className="w-4 h-4" /> {t('exportPDF')}
          </Button>

          <Button size="sm" onClick={handleSave} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4" /> {t('saveDraft')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Main Content ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Client Info Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> {t('client')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600">{t('clientName')} <span className="text-red-500">*</span></label>
                <Input
                  value={quote.client_name}
                  onChange={(e) => setQuote({...quote, client_name: e.target.value})}
                  placeholder="Jean Dupont"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    value={quote.client_email || ''}
                    onChange={(e) => setQuote({...quote, client_email: e.target.value})}
                    placeholder="jean@example.com"
                    className="pl-9 border-slate-300"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600">{t('address')} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    value={quote.client_address}
                    onChange={(e) => setQuote({...quote, client_address: e.target.value})}
                    placeholder="123 Rue de Luxembourg"
                    className="pl-9 border-slate-300"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600">{t('phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    type="tel"
                    value={quote.client_phone || ''}
                    onChange={(e) => setQuote({...quote, client_phone: e.target.value})}
                    placeholder="+352 691 123 456"
                    className="pl-9 border-slate-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── Sections ─── */}
          <div className="space-y-5">
            {(calculatedTotals.sections || []).map((section, sectionIndex) => {
              const color = SECTION_COLORS[sectionIndex % SECTION_COLORS.length];
              return (
                <Card key={section.id} className={cn(
                  "shadow-sm border-slate-200 overflow-hidden border-l-4",
                  color.border
                )}>
                  {/* Section Header */}
                  <div className={cn("border-b p-3 flex items-center gap-2 group", color.bg)}>
                    <GripVertical className="w-4 h-4 text-slate-400 cursor-move flex-shrink-0" />
                    <Input
                      value={section.name}
                      onChange={(e) => updateSectionName(section.id, e.target.value)}
                      className={cn(
                        "h-8 border-transparent bg-transparent hover:bg-white focus:bg-white font-semibold text-base w-full max-w-md",
                        color.text
                      )}
                    />
                    <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                      <span className={cn("text-sm font-bold tabular-nums", color.text)}>
                        {fmt(section.subtotal || 0)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto table-scroll">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                          <th className="px-3 py-2 text-left w-8"></th>
                          <th className="px-3 py-2 text-left">{t('description')}</th>
                          <th className="px-3 py-2 text-center w-16">{t('unit')}</th>
                          <th className="px-3 py-2 text-right w-20">{t('quantity')}</th>
                          <th className="px-3 py-2 text-right w-28">{t('unitPrice')}</th>
                          <th className="px-3 py-2 text-right w-28">{t('total')}</th>
                          <th className="px-3 py-2 w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(section.items || []).map((item) => (
                          <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                            <td className="px-3 py-1.5 text-center text-slate-300">
                              <GripVertical className="w-3 h-3 inline" />
                            </td>
                            <td className="px-3 py-1.5">
                              <Input
                                value={item.description}
                                onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                                className="h-7 border-0 bg-transparent p-0 focus-visible:ring-0 w-full text-sm"
                              />
                            </td>
                            <td className="px-3 py-1.5">
                              <Input
                                value={item.unit}
                                onChange={(e) => updateItem(section.id, item.id, 'unit', e.target.value)}
                                className="h-7 border-0 bg-transparent p-0 focus-visible:ring-0 text-center w-full text-sm"
                              />
                            </td>
                            <td className="px-3 py-1.5">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(section.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="h-7 border-0 bg-transparent p-0 focus-visible:ring-0 text-right w-full text-sm tabular-nums"
                              />
                            </td>
                            <td className="px-3 py-1.5">
                              <Input
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => updateItem(section.id, item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                className="h-7 border-0 bg-transparent p-0 focus-visible:ring-0 text-right w-full text-sm tabular-nums"
                              />
                            </td>
                            <td className="px-3 py-1.5 text-right font-medium tabular-nums text-slate-800">
                              {fmt(item.total || 0)}
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteItem(section.id, item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Item Button */}
                  <div className="p-3 border-t border-dashed border-slate-200 flex justify-center">
                    <AddItemDialog
                      sectionId={section.id}
                      onAddItem={addItem}
                      materials={filteredMaterials}
                      labor={filteredLabor}
                      catalogSearch={catalogSearch}
                      setCatalogSearch={setCatalogSearch}
                      laborSearch={laborSearch}
                      setLaborSearch={setLaborSearch}
                      t={t}
                      settings={settings}
                    />
                  </div>
                </Card>
              );
            })}

            {/* Add Section Button */}
            <button
              onClick={addSection}
              className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="w-5 h-5" /> {t('addSection')}
            </button>
          </div>

          {/* ─── Notes & Conditions Card ─── */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> {t('notes')} & {t('paymentConditions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1.5 block">{t('notes')}</label>
                <Textarea
                  placeholder={language === 'pt' ? 'Notas visíveis no orçamento...' : 'Notes visibles sur le devis...'}
                  value={quote.notes || ''}
                  onChange={(e) => setQuote({...quote, notes: e.target.value})}
                  className="border-slate-300 min-h-[80px]"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">{t('paymentConditions')}</label>
                  <Textarea
                    value={quote.payment_conditions || ''}
                    onChange={(e) => setQuote({...quote, payment_conditions: e.target.value})}
                    placeholder="30% acompte, 30% démarrage..."
                    className="border-slate-300 min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">{t('executionTimeframe')}</label>
                  <Input
                    value={quote.execution_timeframe || ''}
                    onChange={(e) => setQuote({...quote, execution_timeframe: e.target.value})}
                    placeholder="3-4 semaines"
                    className="border-slate-300"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">{t('validity')}</label>
                  <Select value={String(quote.validity_days)} onValueChange={(v) => setQuote({...quote, validity_days: parseInt(v)})}>
                    <SelectTrigger className="border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 {t('days')}</SelectItem>
                      <SelectItem value="30">30 {t('days')}</SelectItem>
                      <SelectItem value="60">60 {t('days')}</SelectItem>
                      <SelectItem value="90">90 {t('days')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Sidebar Summary ─── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Financial Summary */}
            <Card className="shadow-md border-t-4 border-t-blue-600">
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-base font-semibold">{t('total')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('materials')}</span>
                    <span className="tabular-nums">{fmt(calculatedTotals.total_materials || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('labor')}</span>
                    <span className="tabular-nums">{fmt(calculatedTotals.total_labor || 0)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>{t('subtotal')}</span>
                    <span className="tabular-nums">{fmt(calculatedTotals.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{t('discount')} %</span>
                    <Input
                      type="number"
                      className="w-16 h-7 text-right text-sm tabular-nums border-slate-300"
                      value={quote.discount_percentage}
                      onChange={(e) => setQuote({...quote, discount_percentage: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  {(calculatedTotals.discount_amount || 0) > 0 && (
                    <div className="flex justify-between text-red-500 text-xs">
                      <span></span>
                      <span className="tabular-nums">-{fmt(calculatedTotals.discount_amount || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{t('iva')} %</span>
                    <Input
                      type="number"
                      className="w-16 h-7 text-right text-sm tabular-nums border-slate-300"
                      value={quote.iva_rate}
                      onChange={(e) => setQuote({...quote, iva_rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="flex justify-between text-slate-500 text-xs">
                    <span></span>
                    <span className="tabular-nums">{fmt(calculatedTotals.iva_amount || 0)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-end pt-1">
                  <span className="font-bold text-lg text-slate-900">{t('total')}</span>
                  <span className="font-bold text-2xl text-blue-600 tabular-nums">{fmt(calculatedTotals.total || 0)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSave}>
                  <Save className="w-4 h-4" /> {t('saveDraft')}
                </Button>

                <Button variant="outline" className="w-full gap-2" onClick={exportPDF}>
                  <FileDown className="w-4 h-4" /> {t('exportPDF')}
                </Button>

                {quote.status === 'draft' && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={handleMarkSent}
                  >
                    <Send className="w-4 h-4" /> {t('markAsSent')}
                  </Button>
                )}

                {quote.status === 'sent' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs"
                      onClick={handleAccept}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('accepted')}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-1 text-red-600 border-red-200 hover:bg-red-50 text-xs"
                      onClick={handleReject}
                    >
                      <XCircle className="w-3.5 h-3.5" /> {t('rejected')}
                    </Button>
                  </div>
                )}

                <Separator className="my-2" />

                <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600 text-sm h-9" onClick={handleSaveAsTemplate}>
                  <BookmarkPlus className="w-4 h-4" /> {t('saveAsTemplate')}
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600 text-sm h-9" onClick={handleDuplicate}>
                  <Copy className="w-4 h-4" /> {t('duplicate')}
                </Button>
                {!isNew && (
                  <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 text-sm h-9" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4" /> {t('delete')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Add Item Dialog Component ────────────────────────────────────
function AddItemDialog({
  sectionId,
  onAddItem,
  materials,
  labor,
  catalogSearch,
  setCatalogSearch,
  laborSearch,
  setLaborSearch,
  t,
  settings,
}: {
  sectionId: string;
  onAddItem: (sectionId: string, item: QuoteItem) => void;
  materials: any[];
  labor: any[];
  catalogSearch: string;
  setCatalogSearch: (v: string) => void;
  laborSearch: string;
  setLaborSearch: (v: string) => void;
  t: (key: string) => string;
  settings: any;
}) {
  const [manualDesc, setManualDesc] = useState('');
  const [manualUnit, setManualUnit] = useState('un');
  const [manualQty, setManualQty] = useState('1');
  const [manualPrice, setManualPrice] = useState('0');
  const [manualType, setManualType] = useState<'material' | 'labor' | 'manual'>('manual');

  const resetManual = () => {
    setManualDesc('');
    setManualUnit('un');
    setManualQty('1');
    setManualPrice('0');
    setManualType('manual');
  };

  const handleAddManual = () => {
    const qty = parseFloat(manualQty) || 1;
    const price = parseFloat(manualPrice) || 0;
    onAddItem(sectionId, {
      id: generateId(),
      description: manualDesc || 'New Item',
      unit: manualUnit,
      quantity: qty,
      unit_price: price,
      total: qty * price,
      item_type: manualType,
    });
    resetManual();
  };

  const handleAddFromCatalog = (m: any) => {
    onAddItem(sectionId, {
      id: generateId(),
      description: m.name,
      unit: m.unit,
      quantity: 1,
      unit_price: m.sell_price,
      total: m.sell_price,
      item_type: 'material',
    });
  };

  const handleAddFromLabor = (l: any) => {
    const price = settings.primaryMarket === 'PT' ? l.price_pt : l.price_lux;
    onAddItem(sectionId, {
      id: generateId(),
      description: `${l.name}`,
      unit: l.unit,
      quantity: 1,
      unit_price: price,
      total: price,
      item_type: 'labor',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5 text-sm"
        >
          <Plus className="w-4 h-4" /> {t('addItem')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('addItem')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">{t('manualItem')}</TabsTrigger>
            <TabsTrigger value="catalog">{t('fromCatalog')}</TabsTrigger>
            <TabsTrigger value="labor">{t('labor')}</TabsTrigger>
          </TabsList>

          {/* Manual Tab */}
          <TabsContent value="manual" className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('description')}</label>
              <Input
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                placeholder={t('description')}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t('unit')}</label>
                <Select value={manualUnit} onValueChange={setManualUnit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">un</SelectItem>
                    <SelectItem value="m²">m²</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="vg">vg</SelectItem>
                    <SelectItem value="h">h</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t('quantity')}</label>
                <Input
                  type="number"
                  value={manualQty}
                  onChange={(e) => setManualQty(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t('price')} (€)</label>
                <Input
                  type="number"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('type')}</label>
              <Select value={manualType} onValueChange={(v) => setManualType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">{t('manualItem')}</SelectItem>
                  <SelectItem value="material">{t('materials')}</SelectItem>
                  <SelectItem value="labor">{t('labor')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogClose asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAddManual}>
                <Plus className="w-4 h-4 mr-1" /> {t('addItem')}
              </Button>
            </DialogClose>
          </TabsContent>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="py-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder={t('search')}
                className="pl-9"
              />
            </div>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {materials.map(m => (
                <DialogClose key={m.id} asChild>
                  <div
                    className="flex items-center justify-between p-2.5 hover:bg-blue-50 border border-slate-100 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleAddFromCatalog(m)}
                  >
                    <div>
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.category} &middot; {m.unit}</div>
                    </div>
                    <div className="font-bold text-blue-600 text-sm tabular-nums">{fmt(m.sell_price)}</div>
                  </div>
                </DialogClose>
              ))}
              {materials.length === 0 && (
                <div className="text-center text-sm text-slate-400 py-8">{t('noResults')}</div>
              )}
            </div>
          </TabsContent>

          {/* Labor Tab */}
          <TabsContent value="labor" className="py-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                value={laborSearch}
                onChange={(e) => setLaborSearch(e.target.value)}
                placeholder={t('search')}
                className="pl-9"
              />
            </div>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {labor.map(l => (
                <DialogClose key={l.id} asChild>
                  <div
                    className="flex items-center justify-between p-2.5 hover:bg-blue-50 border border-slate-100 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleAddFromLabor(l)}
                  >
                    <div>
                      <div className="font-medium text-sm">{l.name}</div>
                      <div className="text-xs text-slate-500">{l.trade} &middot; {l.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 text-sm tabular-nums">{fmt(l.price_lux)}/{l.unit}</div>
                      <div className="text-xs text-slate-400 tabular-nums">PT: {fmt(l.price_pt)}</div>
                    </div>
                  </div>
                </DialogClose>
              ))}
              {labor.length === 0 && (
                <div className="text-center text-sm text-slate-400 py-8">{t('noResults')}</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
