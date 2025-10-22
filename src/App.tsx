import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/**
 * App
 *
 * Root application component that sets up all global providers and routing.
 *
 * Features:
 * - QueryClientProvider: React Query for server state management (can be used for data fetching)
 * - TooltipProvider: Context provider for UI tooltips
 * - Toaster components: Toast notifications (two variants - default and Sonner)
 * - BrowserRouter: Client-side routing with React Router v6
 * - Routes: "/" → Index page, "*" → NotFound page (404)
 *
 * Note: Add custom routes ABOVE the catch-all "*" route to ensure proper matching order.
 */
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
