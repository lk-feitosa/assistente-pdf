
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { FileUp, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload = ({ onFileSelect, isLoading }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is a PDF
      if (file.type !== 'application/pdf') {
        toast.error("Por favor selecione apenas arquivos PDF");
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("O tamanho máximo do arquivo é 10MB");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">ou</div>
      </div>
      
      <div className="glass-card rounded-xl p-6 relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
          disabled={isLoading}
        />
        
        {!selectedFile ? (
          <div 
            className="border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm sm:text-base font-medium">
              Clique para selecionar um arquivo PDF
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              PDF até 10MB
            </p>
          </div>
        ) : (
          <div className="border-2 border-primary/30 bg-primary/5 rounded-lg p-6 relative">
            <button 
              onClick={handleClearFile}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
              disabled={isLoading}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-primary/10 rounded-md">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          className="w-full mt-4 py-5 rounded-lg bg-primary hover:bg-primary/90 transition-colors duration-300"
        >
          {isLoading ? "Analisando..." : "Analisar PDF"}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
