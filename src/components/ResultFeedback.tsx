
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { saveResultFeedback } from "@/lib/api";

interface ResultFeedbackProps {
  resultId: string;
}

const ResultFeedback = ({ resultId }: ResultFeedbackProps) => {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<boolean | null>(null);

  const handleFeedback = (helpful: boolean) => {
    setFeedbackType(helpful);
    if (!helpful) {
      setShowComment(true);
    } else {
      // Se for positivo, salva imediatamente
      saveFeedback(helpful, "");
    }
  };

  const saveFeedback = (helpful: boolean, comment: string) => {
    saveResultFeedback({
      resultId,
      helpful,
      comment: comment.trim() || undefined
    });
    setSubmitted(true);
  };

  const handleSubmitComment = () => {
    saveFeedback(false, comment);
  };

  if (submitted) {
    return (
      <div className="text-xs text-muted-foreground text-center py-1">
        Obrigado pelo seu feedback!
      </div>
    );
  }

  return (
    <div className="mt-2">
      {!showComment ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Este resultado foi útil?</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => handleFeedback(true)}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleFeedback(false)}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2 px-2">
          <p className="text-xs text-muted-foreground">Como podemos melhorar este resultado?</p>
          <Textarea
            placeholder="Digite seu comentário (opcional)"
            className="text-xs min-h-[60px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setShowComment(false)}
            >
              Cancelar
            </Button>
            <Button 
              size="sm" 
              className="h-7 text-xs"
              onClick={handleSubmitComment}
            >
              Enviar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultFeedback;
