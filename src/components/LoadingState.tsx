
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface LoadingStateProps {
  isPdfMode?: boolean;
}

const LoadingState = ({ isPdfMode = false }: LoadingStateProps) => {
  return (
    <div className="space-y-4 w-full animate-fade-in">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="w-3/4 h-6 bg-muted rounded animate-pulse-subtle"></div>
              {isPdfMode && (
                <div className="w-16 h-6 bg-muted rounded animate-pulse-subtle"></div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="w-full h-4 bg-muted rounded animate-pulse-subtle"></div>
              <div className="w-5/6 h-4 bg-muted rounded animate-pulse-subtle"></div>
              <div className="w-4/6 h-4 bg-muted rounded animate-pulse-subtle"></div>
            </div>
          </CardContent>
          
          <CardFooter className="px-6 py-4 bg-secondary/50 flex justify-between">
            <div className="w-3/5 h-4 bg-muted rounded animate-pulse-subtle"></div>
            <div className="w-16 h-8 bg-muted rounded animate-pulse-subtle"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LoadingState;
