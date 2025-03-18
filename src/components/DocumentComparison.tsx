
import { useState, useEffect } from "react";
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
  const [showHelperPopover, setShowHelperPopover] = useState(false);

  // Contagem de documentos selecionados
  const selectedCount = (documentA ? 1 : 0) + (documentB ? 1 : 0);

  // Mostrar o popover de ajuda quando iniciar a seleção
  useEffect(() => {
    if (documentA && !documentB && !showHelperPopover) {
      toast.info("Selecione mais um documento para comparar", {
        description: "Clique em 'Comparar' em outro resultado para completar a seleção."
      });
      setShowHelperPopover(true);
      
      // Fechar o toast após alguns segundos
      const timer = setTimeout(() => {
        setShowHelperPopover(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [documentA, documentB, showHelperPopover]);

  // Navegar para a página de comparação
  const handleNavigateToComparison = () => {
    if (!documentA || !documentB) {
      toast.error("Selecione dois documentos para comparação", {
        description: "Você precisa selecionar dois documentos nos resultados"
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
    } else if (selectedCount === 1) {
      return (
        <div className="relative">
          <GitCompare className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground h-4 w-4 rounded-full flex items-center justify-center">
            1
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <GitCompare className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground h-4 w-4 rounded-full flex items-center justify-center">
            2
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      {selectedCount === 2 ? (
        <Button 
          variant="default"
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          onClick={handleNavigateToComparison}
        >
          <ArrowRightLeft className="h-4 w-4 mr-1" />
          <span>Comparar Selecionados</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="icon" 
          className={`h-10 w-10 rounded-full ${selectedCount > 0 ? 'bg-primary/20 hover:bg-primary/30' : 'bg-background/80 hover:bg-background'}`}
          onClick={() => {
            if (selectedCount === 0) {
              toast.info("Selecione documentos para comparar", {
                description: "Você precisa selecionar documentos para fazer a comparação."
              });
            } else if (selectedCount === 1) {
              toast.info("Selecione mais um documento", {
                description: "Clique em 'Comparar' em outro resultado para completar a seleção."
              });
            }
          }}
        >
          <CompareButtonIcon />
          <span className="sr-only">Comparar documentos</span>
        </Button>
      )}
    </div>
  );
};

export default DocumentComparison;
