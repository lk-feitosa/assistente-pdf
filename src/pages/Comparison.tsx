
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { compareDocuments, SearchResult } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, FileText, CheckCircle2, XCircle, 
  AlertTriangle, Scale, Home, File
} from "lucide-react";

const Comparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Obter documentos do estado de navegação
  const documentA = location.state?.documentA as SearchResult | null;
  const documentB = location.state?.documentB as SearchResult | null;
  const isPdfMode = location.state?.isPdfMode as boolean;

  useEffect(() => {
    // Verificar se temos documentos adequados para comparação
    if (!documentA) {
      setError("Nenhum documento selecionado para comparação");
      return;
    }

    if (!isPdfMode && !documentB) {
      setError("É necessário selecionar dois documentos para comparação no modo pesquisa");
      return;
    }

    // Realizar a comparação automaticamente quando a página carrega
    const performComparison = async () => {
      setComparing(true);
      try {
        // Se temos dois documentos, comparamos eles entre si
        // Se temos apenas um (modo PDF), simulamos a comparação com um documento de referência
        if (documentA && documentB) {
          const result = await compareDocuments(documentA.id, documentB.id);
          setComparisonResult(result);
        } else if (documentA && isPdfMode) {
          // Simulação de comparação com documento único (análise)
          // Na implementação real, isso seria feito contra uma base de documentos padrão
          const result = await compareDocuments(documentA.id, "referenceDoc");
          setComparisonResult(result);
        }
      } catch (error) {
        console.error("Erro ao comparar documentos:", error);
        setError("Ocorreu um erro ao comparar os documentos");
      } finally {
        setComparing(false);
      }
    };

    performComparison();
  }, [documentA, documentB, isPdfMode]);

  // Renderizar documento na página de comparação
  const renderDocument = (doc: SearchResult | null, position: string) => {
    if (!doc) {
      // Se estamos no modo PDF e não temos documentoB, mostramos o bloco de referência
      if (position === "B" && isPdfMode) {
        return (
          <div className="border border-border rounded-lg p-4 bg-background/80 h-full">
            <h3 className="font-medium text-lg mb-2">Documento de referência para análise jurídica</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Este documento contém os padrões e referências jurídicas utilizados para a análise comparativa.
            </p>
            <div className="flex items-center justify-center p-6">
              <File className="h-16 w-16 text-muted-foreground/30" />
            </div>
          </div>
        );
      }
      return null;
    }

    return (
      <div className="border border-border rounded-lg p-4 bg-background/80 h-full">
        <h3 className="font-medium text-lg mb-2">{doc.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{doc.summary}</p>
        
        {doc.category && (
          <div className="mb-2">
            <span className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded">
              {doc.category}
            </span>
          </div>
        )}
        
        {position === "A" && isPdfMode && (
          <div className="mt-3 mb-4">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Comparando com seu documento PDF
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-muted-foreground truncate flex-1">
            {doc.link}
          </span>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white hover:bg-secondary transition-colors"
            asChild
          >
            <a href={doc.link} target="_blank" rel="noopener noreferrer">
              <span className="whitespace-nowrap">Visualizar</span>
            </a>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pb-24">
      <header className="w-full max-w-7xl mx-auto pt-6 pb-6 px-4 sm:px-6 flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        
        <Link to="/" className="inline-flex items-center justify-center bg-primary/5 rounded-full px-4 py-2 hover:bg-primary/10 transition-colors">
          <Scale className="h-5 w-5 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">Assistente Inteligente PDF</span>
        </Link>
      </header>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-2">
          Análise Comparativa de Documentos Legais
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Detalhamento das similaridades e diferenças entre documentos jurídicos
        </p>
      </div>
      
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {error ? (
          <Alert variant="destructive" className="my-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro na comparação</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button onClick={() => navigate(-1)} size="sm" variant="outline">
                  Voltar e selecionar documentos
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-3">
                  {isPdfMode ? "Documento Selecionado" : "Documento A"}
                </h2>
                {renderDocument(documentA, "A")}
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-3">
                  {isPdfMode ? "Referência" : "Documento B"}
                </h2>
                {renderDocument(documentB, "B")}
              </div>
            </div>
            
            {comparing ? (
              <div className="glass-card rounded-xl p-6 text-center my-8">
                <FileText className="mx-auto h-12 w-12 text-primary/40 mb-4" />
                <h3 className="text-lg font-medium mb-3">Analisando documentos</h3>
                <p className="text-muted-foreground mb-4">
                  Estamos comparando os documentos para identificar similaridades e diferenças.
                </p>
                <Progress value={45} className="h-2 w-full max-w-lg mx-auto" />
              </div>
            ) : comparisonResult ? (
              <div className="glass-card rounded-xl p-6 my-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center bg-primary/10 rounded-full px-6 py-3 mb-4">
                    <span className="text-xl font-semibold text-primary">
                      {comparisonResult.similarity}% de similaridade
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {isPdfMode ? 
                      "Esta análise compara seu documento com as referências jurídicas mais relevantes." :
                      "Esta análise compara o conteúdo, estrutura e contexto jurídico dos documentos selecionados."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Tópicos em comum
                    </h3>
                    
                    <div className="bg-green-50/50 border border-green-100 rounded-lg p-4">
                      <ul className="space-y-2">
                        {comparisonResult.commonTopics.map((topic: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-green-800">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-amber-500" />
                      Diferenças significativas
                    </h3>
                    
                    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
                      <ul className="space-y-2">
                        {comparisonResult.differences.map((diff: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <XCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-amber-800">{diff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-medium mb-3">Análise Jurídica</h3>
                  <p className="text-muted-foreground mb-4">
                    Os documentos apresentam {comparisonResult.similarity}% de similaridade em seu conteúdo e estrutura. 
                    As principais concordâncias estão relacionadas aos princípios fundamentais e aplicabilidade, 
                    enquanto as diferenças mais significativas encontram-se na abrangência jurisdicional e sanções previstas.
                  </p>
                  
                  <h4 className="font-medium mt-4 mb-2">Sugestões</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0">•</span>
                      <span>Recomenda-se atenção especial às diferenças de abrangência jurisdicional entre os documentos.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0">•</span>
                      <span>As sanções previstas em cada documento possuem naturezas distintas que podem impactar diferentemente os casos analisados.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0">•</span>
                      <span>Os prazos estipulados diferem significativamente, o que pode afetar o planejamento de ações jurídicas.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar aos resultados
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
};

export default Comparison;
