
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/lib/api";
import { ExternalLink, GitCompare, Check } from "lucide-react";
import ResultFeedback from "./ResultFeedback";

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onCompare?: (result: SearchResult) => void;
  isSelectedForComparison?: boolean;
}

const ResultCard = ({ 
  result, 
  index, 
  onCompare, 
  isSelectedForComparison = false 
}: ResultCardProps) => {
  return (
    <Card 
      className="glass-card overflow-hidden animate-slide-up transition-all duration-300 hover:shadow-lg"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-medium text-lg">{result.title}</h3>
          
          <div className="flex gap-2">
            {result.category && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-1 bg-secondary/30 text-secondary-foreground border-secondary/20"
              >
                {result.category}
              </Badge>
            )}
            
            {result.similarity !== undefined && (
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-1 ${
                  result.similarity > 90 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : result.similarity > 75 
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}
              >
                {result.similarity}% similar
              </Badge>
            )}
          </div>
        </div>
        
        <p className="mt-2 text-muted-foreground text-sm line-clamp-3">
          {result.summary}
        </p>
        
        <ResultFeedback resultId={result.id} />
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-secondary/50 flex justify-between items-center">
        <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground truncate flex-1">
          {result.link}
        </a>
        
        <div className="flex gap-2">
          {onCompare && (
            <Button
              variant={isSelectedForComparison ? "default" : "outline"}
              size="sm"
              className={isSelectedForComparison 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors" 
                : "bg-white hover:bg-secondary transition-colors"}
              onClick={() => onCompare(result)}
            >
              {isSelectedForComparison ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  <span>Selecionado</span>
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4 mr-1" />
                  <span>Comparar</span>
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-secondary transition-colors"
            asChild
          >
            <a href={result.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Abrir</span>
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
