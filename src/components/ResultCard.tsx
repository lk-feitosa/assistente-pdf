
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/lib/api";
import { ExternalLink } from "lucide-react";

interface ResultCardProps {
  result: SearchResult;
  index: number;
}

const ResultCard = ({ result, index }: ResultCardProps) => {
  return (
    <Card 
      className="glass-card overflow-hidden animate-slide-up transition-all duration-300 hover:shadow-lg"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-medium text-lg">{result.title}</h3>
          
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
        
        <p className="mt-2 text-muted-foreground text-sm line-clamp-3">
          {result.summary}
        </p>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-secondary/50 flex justify-between items-center">
        <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground truncate flex-1">
          {result.link}
        </a>
        
        <Button
          variant="outline"
          size="sm"
          className="ml-2 bg-white hover:bg-secondary transition-colors"
          asChild
        >
          <a href={result.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>Abrir</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
