
import { toast } from "sonner";

// Define types for our API responses
export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  link: string;
  similarity?: number; // Only present for PDF analysis results
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  page: number;
  totalPages: number;
  message?: string;
}

// Constantes para a API Google Custom Search
const GOOGLE_API_KEY = "AIzaSyAJ1nzSI9m5GirYOZTnlBXil_a0jpRv3uQ";
const GOOGLE_CX = "507a85d94e90d4cef";
const RESULTS_PER_PAGE = 5;

// Função auxiliar para garantir que a consulta comece com "Lei"
function ensureLawPrefix(query: string):  string {
  const legalKeywords = [
    "lei", "código", "regulamento", "norma", "direito", "portaria",
    "decreto", "constituição", "jurídico", "justiça", "processo", "legislação",
    "estatuto", "resolução", "tribunal", "decisão", "juiz", "promulgação", "sancionada"
  ];
  
  const words = query.toLowerCase().trim().split(" ");
  if (!legalKeywords.includes(words[0])) {
    return `Lei ${query}`;
  }
  return query;
}

// Text search function
export async function searchLegalText(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    console.log(`Pesquisando: "${query}" (Página ${page})`);
    
    // Garantindo que a consulta comece com "Lei"
    const formattedQuery = ensureLawPrefix(query);
    
    // Calcular índice inicial baseado na página
    const startIndex = (page - 1) * RESULTS_PER_PAGE + 1;
    
    // URL da API Google Custom Search
    const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(formattedQuery)}&num=${RESULTS_PER_PAGE}&gl=br&start=${startIndex}`;
    
    console.log("Buscando na Google API...");
    const response = await fetch(googleApiUrl, {
      signal: AbortSignal.timeout(15000) // 15 segundos de timeout
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API Google: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar se há resultados
    if (!data.items || data.items.length === 0) {
      console.log("Nenhum resultado encontrado na API do Google");
      toast.info("Não foram encontrados resultados para esta pesquisa", {
        description: "Tente reformular sua busca começando com a palavra 'Lei'"
      });
      
      return {
        results: [],
        totalResults: 0,
        page: page,
        totalPages: 0,
        message: "Nenhuma lei encontrada"
      };
    }
    
    // Converter resultados do Google para o formato da nossa aplicação
    const results: SearchResult[] = data.items.map((item: any, index: number) => ({
      id: `google_${Date.now()}_${index}`,
      title: item.title,
      summary: item.snippet || "Sem resumo disponível",
      link: item.link
    }));
    
    // Calcular o número total de páginas a partir do resultado
    const totalResults = data.searchInformation?.totalResults ? parseInt(data.searchInformation.totalResults) : results.length;
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
    
    console.log(`Encontrados ${results.length} resultados (página ${page} de ${totalPages})`);
    
    return {
      results,
      totalResults,
      page,
      totalPages
    };
  } catch (error) {
    console.error("Error searching legal text:", error);
    
    // Em caso de erro, mostrar toast e devolver um resultado vazio
    toast.error("Erro ao realizar a busca", {
      description: "Estamos com problemas para acessar o serviço de busca. Tente novamente."
    });
    
    return {
      results: [],
      totalResults: 0,
      page: page,
      totalPages: 0,
      message: "Erro ao buscar informações legais"
    };
  }
}

// PDF analysis function - Ainda usando dados mock, já que precisaríamos de um backend real para processar os PDFs
export async function analyzePDF(file: File, page: number = 1): Promise<SearchResponse> {
  try {
    toast.info("Analisando arquivo...", {
      description: "Comparando o conteúdo com leis disponíveis."
    });
    
    // Verificar tamanho do arquivo (até 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: "O tamanho máximo permitido é de 10MB."
      });
      throw new Error("Arquivo muito grande");
    }
    
    // Em uma implementação real, enviaríamos o arquivo para um backend
    // Como estamos simulando, vamos usar o nome do arquivo para criar uma consulta
    const filename = file.name.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9À-ÿ\s]/g, " ");
    
    // Simulando uma consulta baseada no nome do arquivo
    const simulatedQuery = `Lei ${filename}`;
    
    // Aguardar um tempo para simular o processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Usar a mesma função de busca de texto, mas adicionando similaridade
    const textResults = await searchLegalText(simulatedQuery, page);
    
    // Adicionar pontuações de similaridade simuladas aos resultados
    const results = textResults.results.map(result => ({
      ...result,
      similarity: Math.floor(Math.random() * 25) + 75 // Valor aleatório entre 75 e 99
    }));
    
    // Ordenar por similaridade
    results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
    
    return {
      results,
      totalResults: textResults.totalResults,
      page,
      totalPages: textResults.totalPages
    };
    
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    
    if (error instanceof Error && error.message === "Arquivo muito grande") {
      // Mensagem de erro já foi exibida
      return {
        results: [],
        totalResults: 0,
        page,
        totalPages: 0,
        message: "Arquivo muito grande"
      };
    }
    
    toast.error("Erro ao analisar o PDF", {
      description: "Não foi possível processar o arquivo. Tente novamente."
    });
    
    return {
      results: [],
      totalResults: 0,
      page,
      totalPages: 0,
      message: "Erro ao analisar PDF"
    };
  }
}
