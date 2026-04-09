import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { RideProvider } from "@/context/RideContext";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import Shuttle from "./pages/Shuttle";
import Activity from "./pages/Activity";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import RideBooking from "./pages/RideBooking";
import RideTracking from "./pages/RideTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <RideProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Index />} />
              <Route path="/shuttle" element={<Shuttle />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ride/book" element={<RideBooking />} />
              <Route path="/ride/tracking" element={<RideTracking />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RideProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
