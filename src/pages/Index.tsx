
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import SearchBar from "@/components/SearchBar";
import FileUpload from "@/components/FileUpload";
import ResultCard from "@/components/ResultCard";
import Pagination from "@/components/Pagination";
import LoadingState from "@/components/LoadingState";
import { searchLegalText, analyzePDF, SearchResponse, SearchResult } from "@/lib/api";
import { Scale, FileText, ChevronLeft } from "lucide-react";

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'pdf' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Handle text search
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchMode('text');
    setCurrentQuery(query);
    setCurrentPage(1);
    
    try {
      const results = await searchLegalText(query, 1);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PDF analysis
  const handleFileAnalysis = async (file: File) => {
    setIsLoading(true);
    setSearchMode('pdf');
    setCurrentFile(file);
    setCurrentPage(1);
    
    try {
      const results = await analyzePDF(file, 1);
      setSearchResults(results);
    } catch (error) {
      console.error("PDF analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    try {
      let results;
      if (searchMode === 'text' && currentQuery) {
        results = await searchLegalText(currentQuery, page);
      } else if (searchMode === 'pdf' && currentFile) {
        results = await analyzePDF(currentFile, page);
      }
      
      if (results) {
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to search form
  const handleReset = () => {
    setSearchResults(null);
    setSearchMode(null);
    setCurrentQuery("");
    setCurrentFile(null);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pb-24">
      <Toaster position="top-center" />
      
      <header className="w-full max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center bg-primary/5 rounded-full px-4 py-2 mb-4">
          <Scale className="h-5 w-5 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">Assistente Inteligente PDF</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground">
          Pesquisa Jurídica Inteligente
        </h1>
        
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre leis e regulamentos com facilidade. Pesquise por texto ou envie um documento para análise.
        </p>
      </header>
      
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search/Results container with glass effect */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl w-full relative overflow-hidden">
          {/* Back button when showing results */}
          {searchResults && (
            <button
              onClick={handleReset}
              className="absolute top-4 left-4 p-2 rounded-full bg-background/70 hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {/* Search form when no results or loading */}
          {!searchResults ? (
            <div className="space-y-8">
              <div className="flex items-center justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              <FileUpload onFileSelect={handleFileAnalysis} isLoading={isLoading} />
            </div>
          ) : (
            <div className="mt-6">
              {/* Results header with search info */}
              <div className="mb-6 text-center">
                <h2 className="text-lg font-medium">
                  {searchMode === 'text' ? (
                    <>Resultados para: <span className="text-primary">"{currentQuery}"</span></>
                  ) : (
                    <>Análise do documento: <span className="text-primary">{currentFile?.name}</span></>
                  )}
                </h2>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {searchResults.totalResults} resultados encontrados
                </p>
              </div>
              
              {/* Loading state or results */}
              {isLoading ? (
                <LoadingState isPdfMode={searchMode === 'pdf'} />
              ) : (
                <div className="space-y-4">
                  {searchResults.results.map((result, index) => (
                    <ResultCard key={result.id} result={result} index={index} />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={searchResults.totalPages}
                onPageChange={handlePageChange}
              />
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
