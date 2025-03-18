
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
  isPdfMode?: boolean;
  selectedDocuments?: SearchResult[];
}

const DocumentComparison = ({ 
  documentA, 
  documentB, 
  onSelectDocument, 
  isPdfMode = false,
  selectedDocuments = []
}: DocumentComparisonProps) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Count of selected documents
  const selectedCount = selectedDocuments.length || ((documentA ? 1 : 0) + (documentB ? 1 : 0));

  // Determine if button should be active based on mode
  const isButtonActive = isPdfMode 
    ? selectedCount >= 1 && selectedCount <= 3  // PDF mode: 1-3 documents
    : selectedCount === 2;                      // Text mode: exactly 2 documents

  // Navigate to comparison page
  const handleNavigateToComparison = () => {
    // Different requirements based on mode
    if (isPdfMode) {
      // For PDF analysis, we need at least 1 document selected and at most 3
      if (selectedCount < 1) {
        toast.error("Selecione pelo menos um documento para comparação", {
          description: "Você precisa selecionar pelo menos um documento clicando em 'Comparar'"
        });
        return;
      }
      
      if (selectedCount > 3) {
        toast.error("Máximo de 3 documentos atingido", {
          description: "Você pode selecionar no máximo 3 documentos para comparação"
        });
        return;
      }
    } else {
      // For text search, we need exactly 2 documents
      if (selectedCount !== 2) {
        toast.error("Selecione exatamente dois documentos para comparação", {
          description: "Você precisa selecionar exatamente dois documentos clicando em 'Comparar'"
        });
        return;
      }
    }
    
    navigate("/comparison", { 
      state: { 
        documentA, 
        documentB,
        isPdfMode,
        selectedDocuments
      } 
    });
  };

  // Button icon with comparison state
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

  // If we have selected documents, show button to navigate to comparison page
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
          {isPdfMode ? "Selecione de 1 a 3 documentos" : "Selecione 2 documentos"}
        </div>
      )}
    </div>
  );
};

export default DocumentComparison;
