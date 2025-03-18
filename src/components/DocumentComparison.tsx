
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
  isPdfMode?: boolean;
}

const DocumentComparison = ({ documentA, documentB, onSelectDocument, isPdfMode = false }: DocumentComparisonProps) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Contagem de documentos selecionados
  const selectedCount = (documentA ? 1 : 0) + (documentB ? 1 : 0);

  // Navegar para a página de comparação
  const handleNavigateToComparison = () => {
    // Diferentes requisitos baseados no modo
    if (isPdfMode) {
      // Para análise de PDF, precisamos de pelo menos 1 documento selecionado
      if (selectedCount === 0) {
        toast.error("Selecione pelo menos um documento para comparação", {
          description: "Você precisa selecionar pelo menos um documento clicando em 'Comparar'"
        });
        return;
      }
    } else {
      // Para busca de texto, precisamos de exatamente 2 documentos
      if (selectedCount < 2) {
        toast.error("Selecione dois documentos para comparação", {
          description: "Você precisa selecionar exatamente dois documentos clicando em 'Comparar'"
        });
        return;
      }
    }
    
    navigate("/comparison", { 
      state: { 
        documentA, 
        documentB,
        isPdfMode
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

  // Verificar se o botão deve estar ativo
  const isButtonActive = isPdfMode ? selectedCount > 0 : selectedCount === 2;

  // Se tivermos documentos selecionados, mostrar o botão para navegar à página de comparação
  return (
    <div className="relative">
      <Button 
        variant={isButtonActive ? "default" : "outline"}
        size={isButtonActive ? "sm" : "icon"}
        className={`${isButtonActive 
          ? "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors" 
          : "h-10 w-10 rounded-full bg-background/80 hover:bg-background"}`}
        onClick={handleNavigateToComparison}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={!isButtonActive}
      >
        {isButtonActive ? (
          <>
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            <span>
              Comparar {isPdfMode ? "Selecionado" : "Selecionados"}
            </span>
          </>
        ) : (
          <CompareButtonIcon />
        )}
      </Button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap z-50">
          {isPdfMode ? "Selecione pelo menos 1 documento" : "Selecione 2 documentos"}
        </div>
      )}
    </div>
  );
};

export default DocumentComparison;
