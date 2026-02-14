import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { AppProvider } from "@/lib/store";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import QuotesList from "@/pages/QuotesList";
import QuoteEditor from "@/pages/QuoteEditor";
import MaterialsList from "@/pages/MaterialsList";
import LaborList from "@/pages/LaborList";
import TemplatesList from "@/pages/TemplatesList";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/app" component={Dashboard} />
      <Route path="/app/quotes" component={QuotesList} />
      <Route path="/app/quotes/new" component={QuoteEditor} />
      <Route path="/app/quotes/:id" component={QuoteEditor} />
      <Route path="/app/materials" component={MaterialsList} />
      <Route path="/app/labor" component={LaborList} />
      <Route path="/app/templates" component={TemplatesList} />
      <Route path="/app/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AppProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </AppProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
