
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { History, X, Clock, Search } from "lucide-react";
import { SearchHistoryItem, getSearchHistory, clearSearchHistory } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SearchHistoryProps {
  onSelectQuery: (query: string) => void;
}

const SearchHistory = ({ onSelectQuery }: SearchHistoryProps) => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Carregar histórico ao abrir o diálogo
  const loadHistory = () => {
    setHistory(getSearchHistory());
  };

  // Limpar histórico
  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };

  // Selecionar uma consulta do histórico
  const handleSelectQuery = (query: string) => {
    onSelectQuery(query);
    setOpen(false);
  };

  // Formatar data para exibição
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { 
      setOpen(isOpen); 
      if (isOpen) loadHistory();
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
        >
          <History className="h-5 w-5" />
          <span className="sr-only">Histórico de pesquisas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Pesquisas
          </DialogTitle>
        </DialogHeader>
        
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <History className="h-12 w-12 opacity-30 mb-2" />
            <p>Você ainda não realizou pesquisas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {history.map((item, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg border border-border bg-background/50 hover:bg-background cursor-pointer transition-colors"
                onClick={() => handleSelectQuery(item.query)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium flex items-center">
                      <Search className="h-3 w-3 mr-1 inline" />
                      {item.query}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar histórico
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchHistory;
