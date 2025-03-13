
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

// Mock base URL - would be replaced with actual API endpoint
const API_BASE_URL = "/api";

// Text search function
export async function searchLegalText(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    // In a real implementation, this would call your actual API
    // const response = await fetch(`${API_BASE_URL}/buscar?q=${encodeURIComponent(query)}&page=${page}`);
    
    // For demo purposes, we'll simulate an API call with a timeout
    return await new Promise((resolve) => {
      setTimeout(() => {
        // Mock data response
        resolve({
          results: Array(5).fill(null).map((_, i) => ({
            id: `result-${i}-${Date.now()}`,
            title: `Lei ${10000 + i} - Resultados para "${query}"`,
            summary: `Este é um texto resumido da lei que contém o termo "${query}". O texto completo pode ser acessado através do link.`,
            link: `https://example.com/leis/${10000 + i}`
          })),
          totalResults: 25,
          page,
          totalPages: 5
        });
      }, 1500);
    });
  } catch (error) {
    console.error("Error searching legal text:", error);
    toast.error("Erro ao buscar informações legais");
    throw error;
  }
}

// PDF analysis function
export async function analyzePDF(file: File, page: number = 1): Promise<SearchResponse> {
  try {
    // In real implementation:
    // const formData = new FormData();
    // formData.append('pdf', file);
    // const response = await fetch(`${API_BASE_URL}/analisar-pdf?page=${page}`, {
    //   method: 'POST',
    //   body: formData
    // });
    
    // For demo, simulate API call with timeout
    return await new Promise((resolve) => {
      setTimeout(() => {
        // Mock data response with similarity scores
        resolve({
          results: Array(5).fill(null).map((_, i) => ({
            id: `pdf-result-${i}-${Date.now()}`,
            title: `Lei ${20000 + i} - Similar ao documento enviado`,
            summary: `Este documento tem conteúdo similar ao PDF enviado. Similaridade detectada em seções relacionadas a procedimentos legais.`,
            link: `https://example.com/leis/${20000 + i}`,
            similarity: 95 - (i * 5) // 95%, 90%, 85%, etc.
          })),
          totalResults: 15,
          page,
          totalPages: 3
        });
      }, 2500); // Slightly longer to simulate PDF processing
    });
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    toast.error("Erro ao analisar o PDF");
    throw error;
  }
}
