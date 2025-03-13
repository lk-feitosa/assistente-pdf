
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
}

// API base URL - para produção, usaríamos o endpoint real
const API_BASE_URL = "https://api.assistenteinteligentepdf.com.br/api";

// Função para gerar resultados de pesquisa mock baseados no exemplo do WhatsApp
function generateMockResults(query: string): SearchResult[] {
  if (query.toLowerCase().includes("meio ambiente")) {
    return [
      {
        id: "1_L6938",
        title: "Lei nº 6.938 - Política Nacional do Meio Ambiente",
        summary: "Art. 3º- Para os fins previstos nesta Lei, entende-se por: I - meio ambiente: o conjunto de condições, leis, influências e interações de ordem física, química e...",
        link: "https://www.planalto.gov.br/ccivil_03/leis/l6938.htm"
      },
      {
        id: "2_Lei_Fiscalizacao",
        title: "Lei que estabelece a Política de Fiscalização de Meio Ambiente",
        summary: "Jan 16, 2023 - Nós usamos cookies para melhorar sua experiência de navegação no portal. Ao utilizar você concorda com a política de...",
        link: "https://portal.al.go.leg.br/noticias/151163/lei-que-estabelece-a-politica-de-fiscalizacao-de-meio-ambiente-e-recursos-hidricos-e-sancionada"
      },
      {
        id: "3_L9605",
        title: "Lei nº 9.605 - Lei de Crimes Ambientais",
        summary: "...meio ambiente, e dá outras providências...",
        link: "https://www.planalto.gov.br/ccivil_03/leis/l9605.htm"
      },
      {
        id: "4_CONAMA",
        title: "Página inicial - CONAMA - Conselho Nacional do Meio Ambiente",
        summary: "O Conselho Nacional do Meio Ambiente, criado pela Lei Federal nº 6.938/81, é o órgão colegiado brasileiro responsável pelas adoção de medidas de natureza...",
        link: "https://conama.mma.gov.br/"
      }
    ];
  }
  
  // Para outros termos de pesquisa, retornamos resultados genéricos
  return [
    {
      id: `lei_${Date.now()}_1`,
      title: `Lei relacionada a "${query}"`,
      summary: `Resumo da legislação relacionada a ${query}...`,
      link: "https://www.planalto.gov.br/"
    },
    {
      id: `lei_${Date.now()}_2`,
      title: `Regulamento sobre ${query}`,
      summary: `Este regulamento estabelece diretrizes sobre ${query} no âmbito nacional...`,
      link: "https://www.gov.br/pt-br"
    }
  ];
}

// Text search function
export async function searchLegalText(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    // Primeiro, tentamos fazer a chamada real para a API
    const response = await fetch(`${API_BASE_URL}/buscar?q=${encodeURIComponent(query)}&page=${page}`, {
      // Adicionando timeout para evitar espera muito longa
      signal: AbortSignal.timeout(10000) // 10 segundos de timeout
    });
    
    if (!response.ok) {
      // Se o servidor responder com erro, usamos dados mock
      console.log(`API respondeu com status ${response.status}, usando dados mock`);
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching legal text:", error);
    
    // Em ambiente de desenvolvimento, usamos dados mock em vez de quebrar a UI
    console.log("Usando resultados mock para a pesquisa:", query);
    
    // Para mostrar a toast apenas uma vez
    if (!(error instanceof DOMException && error.name === "AbortError")) {
      toast.error("Usando dados de demonstração - API indisponível", {
        description: "Conecte a API real para resultados em tempo real."
      });
    }
    
    // Geramos resultados mock baseados na query
    const mockResults = generateMockResults(query);
    
    // Retornamos uma resposta simulada para não quebrar a UI
    return {
      results: mockResults,
      totalResults: mockResults.length,
      page: page,
      totalPages: 1
    };
  }
}

// PDF analysis function
export async function analyzePDF(file: File, page: number = 1): Promise<SearchResponse> {
  try {
    // Mostramos um toast informando que estamos usando dados mock
    toast.info("Analisando arquivo...", {
      description: "Os resultados são simulados para fins de demonstração."
    });
    
    // Criando FormData para envio do arquivo
    const formData = new FormData();
    formData.append('pdf', file);
    
    try {
      // Tentamos fazer a chamada real para a API com timeout
      const response = await fetch(`${API_BASE_URL}/analisar-pdf?page=${page}`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(15000) // 15 segundos de timeout
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error with real API, using mock data:", error);
      throw error; // Rethrow para o catch externo usar os dados mock
    }
  } catch (error) {
    console.error("Error analyzing PDF, using mock data:", error);
    
    // Simulamos um atraso para parecer mais realista
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Geramos resultados mock com pontuações de similaridade
    const mockResults: SearchResult[] = [
      {
        id: "sim_1",
        title: "Lei nº 6.938 - Política Nacional do Meio Ambiente",
        summary: "Art. 3º- Para os fins previstos nesta Lei, entende-se por: I - meio ambiente: o conjunto de condições, leis, influências e interações de ordem física, química e...",
        link: "https://www.planalto.gov.br/ccivil_03/leis/l6938.htm",
        similarity: 92
      },
      {
        id: "sim_2",
        title: "Lei que estabelece a Política de Fiscalização de Meio Ambiente",
        summary: "Estabelece a política de fiscalização de meio ambiente e recursos hídricos...",
        link: "https://portal.al.go.leg.br/noticias/151163/lei-que-estabelece-a-politica-de-fiscalizacao-de-meio-ambiente-e-recursos-hidricos-e-sancionada",
        similarity: 85
      },
      {
        id: "sim_3",
        title: "Lei nº 9.605 - Lei de Crimes Ambientais",
        summary: "Dispõe sobre as sanções penais e administrativas derivadas de condutas e atividades lesivas ao meio ambiente...",
        link: "https://www.planalto.gov.br/ccivil_03/leis/l9605.htm",
        similarity: 78
      }
    ];
    
    // Retornamos resultados simulados
    return {
      results: mockResults,
      totalResults: mockResults.length,
      page: page,
      totalPages: 1
    };
  }
}
