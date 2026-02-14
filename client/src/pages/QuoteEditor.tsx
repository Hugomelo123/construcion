import { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, FileDown, Copy, Sparkles, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImg from "@/assets/logo.png"; // Import logo for PDF
import { cn } from "@/lib/utils";

// Utility to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function QuoteEditor() {
  const { t, language } = useLanguage();
  const { quotes, addQuote, updateQuote, materials, labor, templates } = useApp();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/app/quotes/:id");
  const { toast } = useToast();
  
  const isNew = params?.id === "new" || !params?.id;
  const existingQuote = !isNew ? quotes.find(q => q.id === params?.id) : null;

  const [quote, setQuote] = useState<Quote>(existingQuote || {
    id: generateId(),
    quote_number: `Q-${new Date().getFullYear()}-${String((quotes?.length || 0) + 1).padStart(3, '0')}`,
    client_name: '',
    client_address: '',
    client_email: '',
    client_phone: '',
    status: 'draft',
    validity_days: 30,
    discount_percentage: 0,
    iva_rate: 17,
    created_at: new Date().toISOString(),
    sections: [],
    total_materials: 0,
    total_labor: 0,
    subtotal: 0,
    discount_amount: 0,
    iva_amount: 0,
    total: 0
  });

  // Load existing quote if accessed via URL directly
  useEffect(() => {
    if (!isNew && existingQuote) {
      setQuote(existingQuote);
    }
  }, [existingQuote, isNew]);

  // Calculations
  useEffect(() => {
    const newQuote = { ...quote };
    let matTotal = 0;
    let labTotal = 0;
    let subTotal = 0;

    newQuote.sections = (newQuote.sections || []).map(section => {
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

    subTotal = matTotal + labTotal;
    const discountAmt = subTotal * (newQuote.discount_percentage / 100);
    const afterDiscount = subTotal - discountAmt;
    const ivaAmt = afterDiscount * (newQuote.iva_rate / 100);
    
    setQuote(prev => ({
      ...prev,
      sections: newQuote.sections,
      total_materials: matTotal,
      total_labor: labTotal,
      subtotal: subTotal,
      discount_amount: discountAmt,
      iva_amount: ivaAmt,
      total: afterDiscount + ivaAmt
    }));
  }, [
    // Deep dependency check simplified for prototype
    JSON.stringify(quote?.sections), 
    quote?.discount_percentage, 
    quote?.iva_rate
  ]);

  // Handlers
  const handleSave = () => {
    if (isNew) {
      addQuote(quote);
      toast({ title: t('save'), description: "Quote created successfully." });
      setLocation('/app/quotes');
    } else {
      updateQuote(quote.id, quote);
      toast({ title: t('save'), description: "Quote updated successfully." });
    }
  };

  const addSection = () => {
    setQuote(prev => ({
      ...prev,
      sections: [...(prev.sections || []), { id: generateId(), name: 'New Section', items: [], subtotal: 0 }]
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

  const updateItem = (sectionId: string, itemId: string, field: keyof QuoteItem, value: any) => {
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
    // Deep clone to generate new IDs
    const newSections = (template.sections || []).map((s: any) => ({
      ...s,
      id: generateId(),
      items: (s.items || []).map((i: any) => ({ ...i, id: generateId() }))
    }));
    
    setQuote(prev => ({
      ...prev,
      sections: [...(prev.sections || []), ...newSections]
    }));
    toast({ title: "Template Applied", description: `Added sections from ${template.name}` });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 41, 59); // Navy
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("ORÇAPRO", 20, 25);
    doc.setFontSize(10);
    doc.text("Construction & Rénovation", 20, 32);

    // Company Info (Right side)
    doc.setFontSize(10);
    doc.text("123 Rue du Construction", 190, 15, { align: 'right' });
    doc.text("L-1234 Luxembourg", 190, 20, { align: 'right' });
    doc.text("info@orcapro.lu", 190, 25, { align: 'right' });

    // Client Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(t('client') + ":", 20, 60);
    doc.setFont("helvetica", "bold");
    doc.text(quote.client_name, 20, 66);
    doc.setFont("helvetica", "normal");
    doc.text(quote.client_address, 20, 72);

    // Quote Info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${t('quotes').toUpperCase()} #${quote.quote_number}`, 140, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${t('date')}: ${new Date(quote.created_at).toLocaleDateString()}`, 140, 66);
    doc.text(`${t('validity')}: ${new Date(new Date().setDate(new Date().getDate() + quote.validity_days)).toLocaleDateString()}`, 140, 72);

    let yPos = 90;

    (quote.sections || []).forEach((section, index) => {
      // Section Header
      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.text(`${index + 1}. ${section.name}`, 22, yPos + 6);
      yPos += 15;

      // Table for section items
      autoTable(doc, {
        startY: yPos,
        head: [[t('description'), t('unit'), t('quantity'), t('unitPrice'), t('total')]],
        body: (section.items || []).map(item => [
          item.description,
          item.unit,
          item.quantity,
          `€${(item.unit_price || 0).toFixed(2)}`,
          `€${(item.total || 0).toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }, // Blue
        margin: { left: 20, right: 20 },
      });

      // @ts-ignore
      yPos = doc.lastAutoTable.finalY + 10;
    });

    // Totals
    const rightMargin = 150;
    doc.text(`${t('subtotal')}:`, rightMargin, yPos);
    doc.text(`€${(quote.subtotal || 0).toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 7;
    
    if (quote.discount_amount > 0) {
      doc.text(`${t('discount')} (${quote.discount_percentage}%):`, rightMargin, yPos);
      doc.text(`-€${(quote.discount_amount || 0).toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 7;
    }

    doc.text(`${t('iva')} (${quote.iva_rate}%):`, rightMargin, yPos);
    doc.text(`€${(quote.iva_amount || 0).toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${t('total')}:`, rightMargin, yPos);
    doc.text(`€${(quote.total || 0).toFixed(2)}`, 190, yPos, { align: 'right' });

    doc.save(`${quote.quote_number}.pdf`);
  };

  return (
    <Layout>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isNew ? t('newQuote') : quote.quote_number}
            </h1>
            <Badge variant="outline" className={cn(
               quote.status === 'sent' && "bg-blue-100 text-blue-800",
               quote.status === 'draft' && "bg-yellow-100 text-yellow-800",
            )}>
              {t(quote.status)}
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">Created on {new Date(quote.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Copy className="w-4 h-4" /> {t('applyTemplate')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('applyTemplate')}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                {(templates || []).map(t => (
                  <Button 
                    key={t.id} 
                    variant="ghost" 
                    className="justify-start h-auto py-3 px-4 border border-slate-100 hover:border-blue-200 hover:bg-blue-50"
                    onClick={() => applyTemplate(t)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-slate-500">{(t.sections || []).length} sections</div>
                    </div>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => {}} className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50">
            <Sparkles className="w-4 h-4" /> {t('generateAI')}
          </Button>

          <Button variant="outline" onClick={exportPDF} className="gap-2">
            <FileDown className="w-4 h-4" /> {t('exportPDF')}
          </Button>
          
          <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4" /> {t('save')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Client Info */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t('client')} *</label>
                <Input 
                  value={quote.client_name} 
                  onChange={(e) => setQuote({...quote, client_name: e.target.value})}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input 
                  value={quote.client_email} 
                  onChange={(e) => setQuote({...quote, client_email: e.target.value})}
                  placeholder="jean@example.com"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">{t('address')} *</label>
                <Input 
                  value={quote.client_address} 
                  onChange={(e) => setQuote({...quote, client_address: e.target.value})}
                  placeholder="123 Rue de Luxembourg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-6">
            {(quote.sections || []).map((section) => (
              <Card key={section.id} className="shadow-sm border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b p-3 flex items-center gap-2 group">
                  <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                  <Input 
                    value={section.name} 
                    onChange={(e) => updateSectionName(section.id, e.target.value)}
                    className="h-8 border-transparent bg-transparent hover:bg-white focus:bg-white font-semibold text-lg w-full max-w-md"
                  />
                  <div className="ml-auto flex items-center">
                    <div className="text-sm font-bold text-slate-600 mr-4">
                      €{(section.subtotal || 0).toFixed(2)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteSection(section.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-white text-slate-500 text-xs uppercase tracking-wider">
                        <th className="px-4 py-2 text-left w-10"></th>
                        <th className="px-4 py-2 text-left">{t('description')}</th>
                        <th className="px-4 py-2 text-left w-20">{t('unit')}</th>
                        <th className="px-4 py-2 text-right w-24">{t('quantity')}</th>
                        <th className="px-4 py-2 text-right w-32">{t('unitPrice')}</th>
                        <th className="px-4 py-2 text-right w-32">{t('total')}</th>
                        <th className="px-4 py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(section.items || []).map((item) => (
                        <tr key={item.id} className="group hover:bg-slate-50">
                           <td className="px-4 py-2 text-center text-slate-300">
                             <GripVertical className="w-3 h-3 inline" />
                           </td>
                           <td className="px-4 py-2">
                             <Input 
                               value={item.description} 
                               onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                               className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 w-full" 
                             />
                           </td>
                           <td className="px-4 py-2">
                             <Input 
                               value={item.unit} 
                               onChange={(e) => updateItem(section.id, item.id, 'unit', e.target.value)}
                               className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 text-center w-full" 
                             />
                           </td>
                           <td className="px-4 py-2">
                             <Input 
                               type="number"
                               value={item.quantity} 
                               onChange={(e) => updateItem(section.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                               className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 text-right w-full" 
                             />
                           </td>
                           <td className="px-4 py-2">
                             <Input 
                               type="number"
                               value={item.unit_price} 
                               onChange={(e) => updateItem(section.id, item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                               className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 text-right w-full" 
                             />
                           </td>
                           <td className="px-4 py-2 text-right font-medium">
                             €{(item.total || 0).toFixed(2)}
                           </td>
                           <td className="px-4 py-2 text-center">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                onClick={() => deleteItem(section.id, item.id)}
                              >
                               <Trash2 className="w-3 h-3" />
                             </Button>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="p-3 bg-white border-t flex justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Plus className="w-4 h-4 mr-1" /> {t('addItem')}
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
                          
                          <TabsContent value="manual" className="space-y-4 py-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">{t('description')}</label>
                              <Input id="desc" placeholder="Custom item description" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('unit')}</label>
                                <Select defaultValue="un">
                                  <SelectTrigger id="unit"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="un">un</SelectItem>
                                    <SelectItem value="m2">m²</SelectItem>
                                    <SelectItem value="ml">ml</SelectItem>
                                    <SelectItem value="kg">kg</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('quantity')}</label>
                                <Input type="number" id="qty" defaultValue="1" />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('price')}</label>
                                <Input type="number" id="price" defaultValue="0" />
                              </div>
                            </div>
                            <Button className="w-full mt-4" onClick={() => {
                                // Simplified adding logic for prototype manual entry
                                const desc = (document.getElementById('desc') as HTMLInputElement).value;
                                const qty = parseFloat((document.getElementById('qty') as HTMLInputElement).value);
                                const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
                                
                                addItem(section.id, {
                                  id: generateId(),
                                  description: desc || 'New Item',
                                  unit: 'un',
                                  quantity: qty || 1,
                                  unit_price: price || 0,
                                  total: (qty || 1) * (price || 0),
                                  item_type: 'manual'
                                });
                            }}>{t('addItem')}</Button>
                          </TabsContent>

                          <TabsContent value="catalog" className="py-4">
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {(materials || []).map(m => (
                                <div key={m.id} className="flex items-center justify-between p-2 hover:bg-slate-50 border rounded-md cursor-pointer"
                                  onClick={() => addItem(section.id, {
                                    id: generateId(),
                                    description: m.name,
                                    unit: m.unit,
                                    quantity: 1,
                                    unit_price: m.sell_price,
                                    total: m.sell_price,
                                    item_type: 'material'
                                  })}
                                >
                                  <div>
                                    <div className="font-medium">{m.name}</div>
                                    <div className="text-xs text-slate-500">{m.category}</div>
                                  </div>
                                  <div className="font-bold text-blue-600">€{m.sell_price}</div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="labor" className="py-4">
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {(labor || []).map(l => (
                                <div key={l.id} className="flex items-center justify-between p-2 hover:bg-slate-50 border rounded-md cursor-pointer"
                                  onClick={() => addItem(section.id, {
                                    id: generateId(),
                                    description: `${l.trade} - ${l.name}`,
                                    unit: l.unit,
                                    quantity: 1,
                                    unit_price: l.price_lux, // Default to LUX for now
                                    total: l.price_lux,
                                    item_type: 'labor'
                                  })}
                                >
                                  <div>
                                    <div className="font-medium">{l.name}</div>
                                    <div className="text-xs text-slate-500">{l.trade}</div>
                                  </div>
                                  <div className="font-bold text-slate-700">€{l.price_lux}/{l.unit}</div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}

            <Button 
              variant="outline" 
              className="w-full border-dashed py-8 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
              onClick={addSection}
            >
              <Plus className="w-5 h-5 mr-2" /> {t('addSection')}
            </Button>
          </div>

          <Card>
             <CardContent className="p-6 space-y-4">
               <div>
                 <label className="text-sm font-medium text-slate-700 mb-2 block">{t('notes')}</label>
                 <Textarea 
                    placeholder="Add notes visible to client..." 
                    value={quote.notes || ''}
                    onChange={(e) => setQuote({...quote, notes: e.target.value})}
                 />
               </div>
               <div className="grid sm:grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm font-medium text-slate-700 mb-2 block">{t('validity')}</label>
                   <Select value={String(quote.validity_days)} onValueChange={(v) => setQuote({...quote, validity_days: parseInt(v)})}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="15">15 {t('days')}</SelectItem>
                       <SelectItem value="30">30 {t('days')}</SelectItem>
                       <SelectItem value="60">60 {t('days')}</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <label className="text-sm font-medium text-slate-700 mb-2 block">{t('paymentConditions')}</label>
                   <Input 
                      defaultValue="30% upfront, 70% on completion" 
                      onChange={(e) => setQuote({...quote, payment_conditions: e.target.value})}
                   />
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-md border-t-4 border-t-blue-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t('total')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('materials')}</span>
                  <span>€{(quote.total_materials || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('labor')}</span>
                  <span>€{(quote.total_labor || 0).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>{t('subtotal')}</span>
                  <span>€{(quote.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>{t('discount')} %</span>
                  <Input 
                    type="number" 
                    className="w-16 h-7 text-right" 
                    value={quote.discount_percentage}
                    onChange={(e) => setQuote({...quote, discount_percentage: parseFloat(e.target.value) || 0})}
                  />
                </div>
                {(quote.discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-red-500 text-xs">
                     <span></span>
                     <span>-€{(quote.discount_amount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-500">
                  <span>{t('iva')} %</span>
                  <Input 
                    type="number" 
                    className="w-16 h-7 text-right" 
                    value={quote.iva_rate}
                    onChange={(e) => setQuote({...quote, iva_rate: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                     <span></span>
                     <span>€{(quote.iva_amount || 0).toFixed(2)}</span>
                  </div>
              </div>
              <Separator />
              <div className="flex justify-between items-end">
                <span className="font-bold text-xl text-slate-900">{t('total')}</span>
                <span className="font-bold text-2xl text-blue-600">€{(quote.total || 0).toFixed(2)}</span>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleSave}>
                {t('save')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
