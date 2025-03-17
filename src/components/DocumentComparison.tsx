
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { GitCompare, ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react";
import { compareDocuments, SearchResult } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface DocumentComparisonProps {
  documentA: SearchResult | null;
  documentB: SearchResult | null;
  onSelectDocument: (position: 'A' | 'B', document: SearchResult) => void;
}

const DocumentComparison = ({ documentA, documentB, onSelectDocument }: DocumentComparisonProps) => {
  const [open, setOpen] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  // Realizar a comparação
  const handleCompare = async () => {
    if (!documentA || !documentB) return;
    
    setComparing(true);
    try {
      const result = await compareDocuments(documentA.id, documentB.id);
      setComparisonResult(result);
    } catch (error) {
      console.error("Erro ao comparar documentos:", error);
    } finally {
      setComparing(false);
    }
  };

  // Formatar documento para exibição
  const renderDocumentCard = (doc: SearchResult | null, position: 'A' | 'B') => {
    if (!doc) {
      return (
        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4 text-center bg-background/50 h-[120px] flex flex-col items-center justify-center">
          <p className="text-muted-foreground">Selecione um documento para comparação</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Selecione um resultado da busca para adicionar aqui
          </p>
        </div>
      );
    }

    return (
      <div className="border border-border rounded-lg p-4 bg-background/80">
        <h4 className="font-medium line-clamp-2 text-sm">{doc.title}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.summary}</p>
        <div className="flex justify-between items-center mt-2">
          <a 
            href={doc.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Visualizar
          </a>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs text-destructive"
            onClick={() => onSelectDocument(position, null as any)}
          >
            Remover
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
        >
          <GitCompare className="h-5 w-5" />
          <span className="sr-only">Comparar documentos</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Comparação de Documentos Legais
          </DialogTitle>
          <DialogDescription>
            Selecione dois documentos nos resultados de busca para compará-los.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <p className="text-sm font-medium mb-2">Documento A</p>
            {renderDocumentCard(documentA, 'A')}
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Documento B</p>
            {renderDocumentCard(documentB, 'B')}
          </div>
        </div>
        
        {comparing ? (
          <div className="my-4 text-center">
            <p className="text-sm mb-2">Comparando documentos...</p>
            <Progress value={45} className="h-2 w-full" />
          </div>
        ) : comparisonResult ? (
          <div className="bg-muted/30 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 text-primary font-medium rounded-full px-4 py-2 text-sm">
                {comparisonResult.similarity}% de similaridade
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                  Tópicos em comum
                </h4>
                <ul className="text-xs space-y-1">
                  {comparisonResult.commonTopics.map((topic: string, i: number) => (
                    <li key={i} className="bg-green-50 text-green-700 rounded px-2 py-1">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <XCircle className="h-4 w-4 text-amber-500 mr-1" />
                  Diferenças
                </h4>
                <ul className="text-xs space-y-1">
                  {comparisonResult.differences.map((diff: string, i: number) => (
                    <li key={i} className="bg-amber-50 text-amber-700 rounded px-2 py-1">
                      {diff}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setComparisonResult(null);
              setOpen(false);
            }}
          >
            Fechar
          </Button>
          <Button 
            onClick={handleCompare}
            disabled={!documentA || !documentB || comparing}
          >
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Comparar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentComparison;
