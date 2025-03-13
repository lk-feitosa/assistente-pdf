
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

// API base URL - ajuste para o seu endpoint real
const API_BASE_URL = "https://api.assistenteinteligentepdf.com.br/api";

// Text search function
export async function searchLegalText(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    // Fazendo a chamada real para a API
    const response = await fetch(`${API_BASE_URL}/buscar?q=${encodeURIComponent(query)}&page=${page}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching legal text:", error);
    toast.error("Erro ao buscar informações legais. Por favor, tente novamente.");
    
    // Em caso de erro, retornamos uma resposta vazia para não quebrar a UI
    return {
      results: [],
      totalResults: 0,
      page: 1,
      totalPages: 0
    };
  }
}

// PDF analysis function
export async function analyzePDF(file: File, page: number = 1): Promise<SearchResponse> {
  try {
    // Criando FormData para envio do arquivo
    const formData = new FormData();
    formData.append('pdf', file);
    
    // Fazendo a chamada real para a API
    const response = await fetch(`${API_BASE_URL}/analisar-pdf?page=${page}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    toast.error("Erro ao analisar o PDF. Por favor, tente novamente.");
    
    // Em caso de erro, retornamos uma resposta vazia para não quebrar a UI
    return {
      results: [],
      totalResults: 0,
      page: 1,
      totalPages: 0
    };
  }
}
