import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import FileUpload from "@/components/FileUpload";
import ResultCard from "@/components/ResultCard";
import Pagination from "@/components/Pagination";
import LoadingState from "@/components/LoadingState";
import ErrorAlert from "@/components/ErrorAlert";
import CategoryFilter from "@/components/CategoryFilter";
import SearchHistory from "@/components/SearchHistory";
import DocumentComparison from "@/components/DocumentComparison";
import { searchLegalText, analyzePDF, SearchResponse, SearchResult } from "@/lib/api";
import { Scale, FileText, ChevronLeft, AlertCircle, Home } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'pdf' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [comparisonDocs, setComparisonDocs] = useState<{
    documentA: SearchResult | null;
    documentB: SearchResult | null;
  }>({ documentA: null, documentB: null });
  const [error, setError] = useState<{title: string, description: string} | null>(null);
  
  const clearError = () => setError(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchMode('text');
    setCurrentQuery(query);
    setCurrentPage(1);
    setSelectedCategory("Todos");
    clearError();
    
    try {
      const results = await searchLegalText(query, 1);
      setSearchResults(results);
      
      if (results.totalResults === 0) {
        setError({
          title: "Nenhum resultado encontrado",
          description: `Não encontramos resultados para "${query}". Tente termos mais amplos ou uma consulta diferente.`
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setError({
        title: "Erro ao buscar informações legais",
        description: "Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileAnalysis = async (file: File) => {
    setIsLoading(true);
    setSearchMode('pdf');
    setCurrentFile(file);
    setCurrentPage(1);
    setSelectedCategory("Todos");
    clearError();
    
    try {
      const results = await analyzePDF(file, 1);
      setSearchResults(results);
      
      if (results.totalResults === 0) {
        setError({
          title: "Nenhuma correspondência encontrada",
          description: "Não encontramos leis relacionadas ao conteúdo do seu PDF. Tente um documento diferente."
        });
      }
    } catch (error) {
      console.error("PDF analysis error:", error);
      setError({
        title: "Erro ao analisar o PDF",
        description: "Ocorreu um problema ao processar seu arquivo. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    clearError();
    
    try {
      let results;
      if (searchMode === 'text' && currentQuery) {
        results = await searchLegalText(currentQuery, page, selectedCategory !== "Todos" ? selectedCategory : undefined);
      } else if (searchMode === 'pdf' && currentFile) {
        results = await analyzePDF(currentFile, page);
      }
      
      if (results) {
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Pagination error:", error);
      setError({
        title: "Erro ao carregar a página",
        description: "Não foi possível carregar mais resultados. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setCurrentPage(1);
    clearError();
    
    try {
      if (searchMode === 'text' && currentQuery) {
        const results = await searchLegalText(
          currentQuery, 
          1, 
          category !== "Todos" ? category : undefined
        );
        setSearchResults(results);
        
        if (results.totalResults === 0) {
          setError({
            title: "Nenhum resultado encontrado nesta categoria",
            description: `Não encontramos resultados para "${currentQuery}" na categoria "${category}".`
          });
        }
      }
    } catch (error) {
      console.error("Category filter error:", error);
      setError({
        title: "Erro ao filtrar por categoria",
        description: "Não foi possível aplicar o filtro. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareDocument = (result: SearchResult) => {
    if (comparisonDocs.documentA?.id === result.id) {
      setComparisonDocs({ ...comparisonDocs, documentA: null });
      toast.info("Documento removido da comparação");
      return;
    }
    
    if (comparisonDocs.documentB?.id === result.id) {
      setComparisonDocs({ ...comparisonDocs, documentB: null });
      toast.info("Documento removido da comparação");
      return;
    }
    
    if (searchMode === 'pdf') {
      setComparisonDocs({ ...comparisonDocs, documentA: result });
      toast.info("Documento selecionado para comparação", {
        description: "Clique no botão de comparação para ver os resultados.",
      });
      return;
    }
    
    if (!comparisonDocs.documentA) {
      setComparisonDocs({ ...comparisonDocs, documentA: result });
      toast.info("Primeiro documento selecionado", {
        description: "Selecione mais um documento para comparação completa.",
      });
      return;
    }
    
    if (!comparisonDocs.documentB) {
      setComparisonDocs({ ...comparisonDocs, documentB: result });
      toast.success("Documentos prontos para comparação", {
        description: "Clique no botão de comparação para ver os resultados.",
      });
      return;
    }
    
    setComparisonDocs({ documentA: result, documentB: comparisonDocs.documentB });
    toast.info("Primeiro documento substituído");
  };

  const handleSelectComparisonDocument = (position: 'A' | 'B', document: SearchResult | null) => {
    if (position === 'A') {
      setComparisonDocs({ ...comparisonDocs, documentA: document });
      if (document === null) toast.info("Documento removido da comparação");
    } else {
      setComparisonDocs({ ...comparisonDocs, documentB: document });
      if (document === null) toast.info("Documento removido da comparação");
    }
  };

  const isSelectedForComparison = (result: SearchResult) => {
    return (comparisonDocs.documentA?.id === result.id || 
            comparisonDocs.documentB?.id === result.id);
  };

  const handleReset = () => {
    setSearchResults(null);
    setSearchMode(null);
    setCurrentQuery("");
    setCurrentFile(null);
    setCurrentPage(1);
    setSelectedCategory("Todos");
    clearError();
  };

  const handleRetry = () => {
    if (searchMode === 'text' && currentQuery) {
      handleSearch(currentQuery);
    } else if (searchMode === 'pdf' && currentFile) {
      handleFileAnalysis(currentFile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pb-24">
      <Toaster position="bottom-center" />
      
      <header className="w-full max-w-7xl mx-auto pt-3 pb-8 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground mt-4">
          Pesquisa Jurídica Inteligente
        </h1>
        
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre leis e regulamentos com facilidade. Pesquise por texto ou envie um documento para análise.
        </p>
      </header>
      
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl w-full relative overflow-hidden">
          {searchResults && (
            <button
              onClick={handleReset}
              className="absolute top-4 left-4 p-2 rounded-full bg-background/70 hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {error && searchResults && (
            <ErrorAlert 
              title={error.title} 
              description={error.description} 
              onRetry={handleRetry}
            />
          )}
          
          {!searchResults ? (
            <div className="space-y-8">
              <div className="flex items-center justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              {error && (
                <ErrorAlert 
                  title={error.title} 
                  description={error.description} 
                  onRetry={handleRetry}
                />
              )}
              
              <div className="flex items-center justify-end gap-2 mb-2">
                <SearchHistory onSelectQuery={handleSearch} />
              </div>
              
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              <FileUpload onFileSelect={handleFileAnalysis} isLoading={isLoading} />
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-medium">
                  {searchMode === 'text' ? (
                    <>Resultados para: <span className="text-primary">"{currentQuery}"</span></>
                  ) : (
                    <>Análise do documento: <span className="text-primary">{currentFile?.name}</span></>
                  )}
                </h2>
                
                <div className="flex items-center gap-2">
                  <CategoryFilter 
                    selectedCategory={selectedCategory} 
                    onChange={handleCategoryChange} 
                  />
                  <SearchHistory onSelectQuery={handleSearch} />
                  <DocumentComparison 
                    documentA={comparisonDocs.documentA} 
                    documentB={comparisonDocs.documentB}
                    onSelectDocument={handleSelectComparisonDocument}
                  />
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {searchResults.totalResults} resultados encontrados
                {selectedCategory !== "Todos" && ` na categoria "${selectedCategory}"`}
              </p>
              
              {isLoading ? (
                <LoadingState isPdfMode={searchMode === 'pdf'} />
              ) : (
                <div className="space-y-4">
                  {searchResults.results.length > 0 ? (
                    searchResults.results.map((result, index) => (
                      <ResultCard 
                        key={result.id} 
                        result={result} 
                        index={index}
                        onCompare={handleCompareDocument}
                        isSelectedForComparison={isSelectedForComparison(result)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="mt-4 text-lg font-medium">Nenhum resultado encontrado</p>
                      <p className="mt-2 text-muted-foreground">
                        Tente outros termos de pesquisa ou um documento diferente.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {searchResults.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={searchResults.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Assistente Inteligente PDF. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
