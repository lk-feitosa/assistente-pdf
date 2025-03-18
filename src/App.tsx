
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Comparison from "./pages/Comparison";
import NotFound from "./pages/NotFound";
import { Scale } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-center" />
      <BrowserRouter>
        <header className="w-full max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center bg-primary/5 rounded-full px-4 py-2 mb-4 hover:bg-primary/10 transition-colors">
            <Scale className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Assistente Inteligente PDF</span>
          </Link>
        </header>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/comparison" element={<Comparison />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
