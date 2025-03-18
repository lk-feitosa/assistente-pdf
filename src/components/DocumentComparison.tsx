
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitCompare, ArrowRightLeft } from "lucide-react";
import { SearchResult } from "@/lib/api";
import { toast } from "sonner";

interface DocumentComparisonProps {
  documentA: SearchResult | null;
  documentB: SearchResult | null;
  onSelectDocument: (position: 'A' | 'B', document: SearchResult | null) => void;
}

const DocumentComparison = ({ documentA, documentB, onSelectDocument }: DocumentComparisonProps) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Contagem de documentos selecionados
  const selectedCount = (documentA ? 1 : 0) + (documentB ? 1 : 0);

  // Navegar para a página de comparação
  const handleNavigateToComparison = () => {
    if (selectedCount === 0) {
      toast.error("Selecione pelo menos um documento para comparação", {
        description: "Você precisa selecionar documentos clicando em 'Comparar'"
      });
      return;
    }
    
    navigate("/comparison", { 
      state: { 
        documentA, 
        documentB 
      } 
    });
  };

  // Ícone do botão com estado de comparação
  const CompareButtonIcon = () => {
    if (selectedCount === 0) {
      return <GitCompare className="h-5 w-5" />;
    } else {
      return (
        <div className="relative">
          <GitCompare className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground h-4 w-4 rounded-full flex items-center justify-center">
            {selectedCount}
          </div>
        </div>
      );
    }
  };

  // Se tivermos documentos selecionados, mostrar o botão para navegar à página de comparação
  return (
    <div className="relative">
      <Button 
        variant={selectedCount > 0 ? "default" : "outline"}
        size={selectedCount > 0 ? "sm" : "icon"}
        className={`${selectedCount > 0 
          ? "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors" 
          : "h-10 w-10 rounded-full bg-background/80 hover:bg-background"}`}
        onClick={handleNavigateToComparison}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {selectedCount > 0 ? (
          <>
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            <span>
              {selectedCount === 1 
                ? "Comparar Selecionado" 
                : "Comparar Selecionados"}
            </span>
          </>
        ) : (
          <CompareButtonIcon />
        )}
      </Button>
    </div>
  );
};

export default DocumentComparison;
