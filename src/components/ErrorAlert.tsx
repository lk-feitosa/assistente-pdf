
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

const ErrorAlert = ({ title, description, onRetry }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-6 animate-slide-up">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{description}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="mt-3 bg-background/80 hover:bg-background"
          >
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
