
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitCompare, ArrowRightLeft, ScrollText } from "lucide-react";
import { SearchResult } from "@/lib/api";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      // Para modo PDF, precisa de 1-3 documentos
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
      // Para modo de texto, precisamos de exatamente 2 documentos
      if (selectedCount !== 2) {
        toast.error("Selecione exatamente dois documentos para comparação", {
          description: "Você precisa selecionar exatamente dois documentos clicando em 'Comparar'"
        });
        return;
      }
    }
    
    // Configurando os documentos para passar ao estado de navegação
    let navigationState;
    
    if (isPdfMode) {
      navigationState = { 
        isPdfMode: true,
        selectedDocuments,
        documentA: selectedDocuments.length > 0 ? selectedDocuments[0] : null,
        documentB: null
      };
    } else {
      navigationState = { 
        isPdfMode: false,
        documentA, 
        documentB,
        selectedDocuments: []
      };
    }
    
    // Adicionar logs para debug
    console.log("Navegando para comparação com estado:", navigationState);
    
    navigate("/comparison", { state: navigationState });
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

  // Render document summary popover
  const DocumentSummary = ({ document }: { document: SearchResult }) => {
    if (!document) return null;
    
    return (
      <div className="max-w-sm p-2">
        <h3 className="font-medium mb-1 text-sm">{document.title}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-3">{document.summary}</p>
        {document.category && (
          <div className="mb-1">
            <span className="text-xs bg-secondary/30 text-secondary-foreground px-1.5 py-0.5 rounded">
              {document.category}
            </span>
          </div>
        )}
        <div className="text-xs text-muted-foreground truncate">
          {document.link}
        </div>
      </div>
    );
  };

  // If we have selected documents, show button to navigate to comparison page
  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        {/* Document summaries */}
        {(documentA || documentB) && (
          <div className="flex items-center gap-1 mr-1">
            {documentA && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 bg-background/80 hover:bg-background"
                  >
                    <ScrollText className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Doc A</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DocumentSummary document={documentA} />
                </PopoverContent>
              </Popover>
            )}
            
            {documentB && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 bg-background/80 hover:bg-background"
                  >
                    <ScrollText className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Doc B</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DocumentSummary document={documentB} />
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
        
        {/* Compare button */}
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
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap z-50">
          {isPdfMode ? "Selecione de 1 a 3 documentos" : "Selecione 2 documentos"}
        </div>
      )}
    </div>
  );
};

export default DocumentComparison;
