import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import DesignSystem from "./pages/DesignSystem.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Contacts from "./pages/Contacts.tsx";
import ContactProfile from "./pages/ContactProfile.tsx";
import DraftMessage from "./pages/DraftMessage.tsx";
import SentConfirmation from "./pages/SentConfirmation.tsx";
import Settings from "./pages/Settings.tsx";
import Permissions from "./pages/Permissions.tsx";
import Suppressed from "./pages/Suppressed.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Pricing from "./pages/Pricing.tsx";
import PrivacyPage from "./pages/Privacy.tsx";
import WhyPulse from "./pages/WhyPulse.tsx";
import Nudges from "./pages/Nudges.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import NetworkBackground from "./components/NetworkBackground.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Navbar } from "./components/landing/Navbar.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NetworkBackground />
        <ScrollToTop />
        <div style={{ position: "relative", zIndex: 2 }}>
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/why-pulse" element={<WhyPulse />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/contacts/:id" element={<ProtectedRoute><ContactProfile /></ProtectedRoute>} />
          <Route path="/draft/:contactId" element={<ProtectedRoute><DraftMessage /></ProtectedRoute>} />
          <Route path="/draft" element={<ProtectedRoute><DraftMessage /></ProtectedRoute>} />
          <Route path="/sent" element={<ProtectedRoute><SentConfirmation /></ProtectedRoute>} />
          <Route path="/nudges" element={<ProtectedRoute><Nudges /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/settings/privacy/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />
          <Route path="/settings/privacy/suppressed" element={<ProtectedRoute><Suppressed /></ProtectedRoute>} />
          <Route path="/design-system" element={<DesignSystem />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
