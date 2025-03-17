
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Por favor, digite um termo para pesquisar");
      return;
    }
    
    // Sugestão para iniciar com "Lei", similar ao bot do WhatsApp
    if (!query.toLowerCase().includes("lei") && 
        !query.toLowerCase().includes("código") && 
        !query.toLowerCase().includes("decreto")) {
      toast.info("Dica: Comece sua pesquisa com a palavra 'Lei'", {
        description: "Exemplo: Lei sobre meio ambiente"
      });
    }
    
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full flex flex-col sm:flex-row gap-3 items-stretch sm:items-center animate-fade-in"
    >
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Digite um termo legal para pesquisar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-6 text-base sm:text-lg rounded-xl border-2 border-input focus:border-primary/50 focus:ring-2 focus:ring-primary/25 transition-all duration-300"
          disabled={isLoading}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      </div>
      <Button 
        type="submit" 
        disabled={!query.trim() || isLoading}
        className="bg-primary hover:bg-primary/90 py-6 px-6 rounded-xl text-base sm:text-lg font-medium transition-all duration-300 min-w-[120px]"
      >
        {isLoading ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  );
};

export default SearchBar;
