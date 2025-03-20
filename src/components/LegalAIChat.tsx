
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchResult } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface LegalAIChatProps {
  documentA: SearchResult | null;
  documentB: SearchResult | null;
  isPdfMode?: boolean;
  similarityScore?: number;
}

export const LegalAIChat = ({ 
  documentA, 
  documentB, 
  isPdfMode = false,
  similarityScore
}: LegalAIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = `Olá! Sou seu assistente jurídico. Posso tirar dúvidas sobre a comparação entre ${isPdfMode ? 'seu documento PDF e as referências jurídicas' : 'os documentos selecionados'}. Como posso ajudar?`;
      
      setMessages([
        {
          id: Date.now().toString(),
          content: welcomeMessage,
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [isPdfMode]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = '';
      
      // Generate a contextual response based on the documents
      if (inputValue.toLowerCase().includes('similaridade')) {
        responseContent = `A análise identificou uma similaridade de ${similarityScore || '86'}% entre os documentos. Isso significa que compartilham a maioria dos princípios fundamentais, mas possuem diferenças em detalhes importantes como abrangência jurisdicional e sanções.`;
      } else if (inputValue.toLowerCase().includes('diferença') || inputValue.toLowerCase().includes('distinção')) {
        responseContent = 'As principais diferenças estão na abrangência jurisdicional, nas sanções previstas e nos prazos estipulados. Essas distinções podem impactar significativamente os casos analisados.';
      } else if (inputValue.toLowerCase().includes('prazo')) {
        responseContent = 'Os prazos previstos nos documentos diferem significativamente, o que pode afetar o planejamento de ações jurídicas. Recomenda-se verificar os prazos específicos em cada documento para evitar perda de direitos.';
      } else if (inputValue.toLowerCase().includes('sanção') || inputValue.toLowerCase().includes('penalidade')) {
        responseContent = 'As sanções previstas em cada documento possuem naturezas distintas. Enquanto um enfatiza multas administrativas, o outro pode focar em suspensão de direitos ou outras penalidades específicas.';
      } else {
        responseContent = `Sua consulta sobre "${inputValue.substring(0, 30)}${inputValue.length > 30 ? '...' : ''}" envolve aspectos jurídicos específicos. Com base na comparação dos documentos, posso indicar que ambos abordam princípios fundamentais similares, mas diferem em sua aplicação prática. Posso detalhar algum aspecto específico?`;
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-40 flex flex-col transition-all duration-300 ease-in-out",
      isOpen ? "h-[450px] w-[350px]" : "h-auto w-auto"
    )}>
      {/* Chat button */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full p-4 h-14 w-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <div className="flex flex-col h-full overflow-hidden rounded-lg border bg-card shadow-xl">
          {/* Chat header */}
          <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Assistente Jurídico</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex w-full mb-3",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted text-foreground">
                  <div className="flex items-center gap-1">
                    <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                    <div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-200"></div>
                    <div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua dúvida jurídica..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                disabled={isLoading || inputValue.trim() === ''}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
