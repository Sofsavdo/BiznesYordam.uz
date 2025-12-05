import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/context/LanguageContext";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import PartnerDashboard from "@/pages/PartnerDashboard";
import PartnerAIDashboard from "@/pages/PartnerAIDashboard";
import AdminPanel from "@/pages/AdminPanel";
import PartnerRegistration from "@/pages/PartnerRegistration";
import InvestorPitch from "@/pages/InvestorPitch";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/partner-registration" component={PartnerRegistration} />
      <Route path="/partner-dashboard" component={PartnerDashboard} />
      <Route path="/ai-dashboard" component={PartnerAIDashboard} />
      <Route path="/admin-panel" component={AdminPanel} />
      <Route path="/investor-pitch" component={InvestorPitch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
