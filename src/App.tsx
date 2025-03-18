
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Comparison from "./pages/Comparison";
import NotFound from "./pages/NotFound";
import { Home } from "lucide-react"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-center" />
      <BrowserRouter>
        <div className="fixed top-4 right-4 z-50">
          <Link 
            to="/" 
            className="flex items-center justify-center bg-primary/10 rounded-full p-2 hover:bg-primary/20 transition-colors"
            title="Voltar para a página inicial"
          >
            <Home className="h-5 w-5 text-primary" />
          </Link>
        </div>
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
