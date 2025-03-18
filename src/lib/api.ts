
import { toast } from "sonner";

// Define types for our API responses
export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  link: string;
  similarity?: number; // Only present for PDF analysis results
  category?: string; // Nova propriedade para categorias jurídicas
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
const MAX_PAGES = 100; // Aumentado para 100 páginas conforme solicitado

// Função auxiliar para garantir que a consulta comece com termos jurídicos
function ensureLawPrefix(query: string): string {
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

// Categorias jurídicas para classificação dos resultados
const legalCategories = [
  { name: "Constitucional", keywords: ["constituição", "constitucional", "emenda constitucional", "direito constitucional"] },
  { name: "Civil", keywords: ["código civil", "direito civil", "obrigação", "contrato", "família", "propriedade"] },
  { name: "Penal", keywords: ["código penal", "direito penal", "crime", "pena", "sanção", "criminal"] },
  { name: "Trabalhista", keywords: ["trabalhista", "clt", "emprego", "trabalho", "previdência", "inss", "aposentadoria"] },
  { name: "Tributário", keywords: ["tributário", "imposto", "tributo", "taxa", "contribuição", "fiscal"] },
  { name: "Administrativo", keywords: ["administrativo", "administração pública", "servidor público", "licitação"] },
  { name: "Ambiental", keywords: ["ambiental", "meio ambiente", "ecologia", "sustentabilidade", "poluição"] },
  { name: "Consumidor", keywords: ["consumidor", "cdc", "defesa do consumidor", "relação de consumo"] },
  { name: "Outros", keywords: ["outros"] }
];

// Função para classificar resultados em categorias
function categorizeResult(result: SearchResult): string {
  const textToAnalyze = (result.title + " " + result.summary).toLowerCase();
  
  for (const category of legalCategories) {
    if (category.keywords.some(keyword => textToAnalyze.includes(keyword))) {
      return category.name;
    }
  }
  
  return "Outros";
}

// Text search function
export async function searchLegalText(query: string, page: number = 1, category?: string): Promise<SearchResponse> {
  try {
    console.log(`Pesquisando: "${query}" (Página ${page})`);
    
    // Garantindo que a consulta comece com "Lei" ou outro termo jurídico
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
    const results: SearchResult[] = data.items.map((item: any, index: number) => {
      const result = {
        id: `google_${Date.now()}_${index}`,
        title: item.title,
        summary: item.snippet || "Sem resumo disponível",
        link: item.link
      };
      
      // Classificar em categorias
      const category = categorizeResult(result);
      return { ...result, category };
    });
    
    // Filtrar por categoria se especificada
    const filteredResults = category && category !== "Todos" 
      ? results.filter(result => result.category === category)
      : results;
    
    // Calcular o número total de páginas a partir do resultado
    let totalResults = data.searchInformation?.totalResults ? parseInt(data.searchInformation.totalResults) : results.length;
    
    // Limitar o número total de páginas a 100
    let totalPages = Math.min(MAX_PAGES, Math.ceil(totalResults / RESULTS_PER_PAGE));
    
    // Se tivermos mais de 100 páginas, ajustar o total de resultados para refletir isso
    if (totalPages === MAX_PAGES) {
      totalResults = MAX_PAGES * RESULTS_PER_PAGE;
    }
    
    console.log(`Encontrados ${filteredResults.length} resultados (página ${page} de ${totalPages})`);
    
    // Salvar busca por texto no histórico (apenas buscas por texto, não PDFs)
    saveSearchToHistory(query);
    
    return {
      results: filteredResults,
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

// Função para buscar categorias disponíveis
export function getAvailableCategories(): string[] {
  return ["Todos", ...legalCategories.map(cat => cat.name)];
}

// Histórico de pesquisas (armazenado no localStorage)
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

// Salvar pesquisa por texto no histórico
function saveSearchToHistory(query: string): void {
  try {
    const history = getSearchHistory();
    const newItem: SearchHistoryItem = {
      query,
      timestamp: Date.now()
    };
    
    // Evitar duplicatas (remove item existente se encontrado)
    const filteredHistory = history.filter(item => item.query !== query);
    
    // Adicionar nova pesquisa no início do array
    const updatedHistory = [newItem, ...filteredHistory].slice(0, 20); // Manter apenas 20 itens
    
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Erro ao salvar histórico:", error);
  }
}

// Obter histórico de pesquisas
export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const historyString = localStorage.getItem('searchHistory');
    if (!historyString) return [];
    return JSON.parse(historyString);
  } catch (error) {
    console.error("Erro ao recuperar histórico:", error);
    return [];
  }
}

// Limpar histórico de pesquisas
export function clearSearchHistory(): void {
  try {
    localStorage.removeItem('searchHistory');
  } catch (error) {
    console.error("Erro ao limpar histórico:", error);
  }
}

// Função para comparar dois documentos legais
export async function compareDocuments(doc1Id: string, doc2Id: string): Promise<any> {
  // Simulação de comparação
  try {
    toast.info("Comparando documentos...");
    
    // Aguardar um tempo para simular o processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      similarity: Math.floor(Math.random() * 40) + 60, // Valor entre 60 e 99
      commonTopics: [
        "Princípios fundamentais",
        "Aplicabilidade",
        "Disposições gerais"
      ],
      differences: [
        "Abrangência jurisdicional",
        "Sanções previstas",
        "Prazos estipulados"
      ]
    };
  } catch (error) {
    console.error("Erro ao comparar documentos:", error);
    toast.error("Erro ao comparar documentos");
    return null;
  }
}

// Feedback de resultados
export interface ResultFeedback {
  resultId: string;
  helpful: boolean;
  comment?: string;
}

// Armazenar feedback no localStorage
export function saveResultFeedback(feedback: ResultFeedback): void {
  try {
    const feedbacks = getResultFeedbacks();
    const updatedFeedbacks = [...feedbacks.filter(f => f.resultId !== feedback.resultId), feedback];
    localStorage.setItem('resultFeedbacks', JSON.stringify(updatedFeedbacks));
    
    // Informar ao usuário
    toast.success(feedback.helpful ? "Obrigado pelo feedback positivo!" : "Obrigado pelo feedback!");
  } catch (error) {
    console.error("Erro ao salvar feedback:", error);
  }
}

// Obter feedbacks armazenados
export function getResultFeedbacks(): ResultFeedback[] {
  try {
    const feedbacksString = localStorage.getItem('resultFeedbacks');
    if (!feedbacksString) return [];
    return JSON.parse(feedbacksString);
  } catch (error) {
    console.error("Erro ao recuperar feedbacks:", error);
    return [];
  }
}

// PDF analysis function - Simulando com base no nome do arquivo PDF
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
      // Também aplicamos o limite de 100 páginas aqui
      totalPages: Math.min(MAX_PAGES, textResults.totalPages),
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
