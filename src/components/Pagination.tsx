
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Don't render if we only have one page
  if (totalPages <= 1) return null;

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate start and end of page range around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Add dots before start if there's a gap
    if (start > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages in range
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    
    // Add dots after end if there's a gap
    if (end < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 bg-background"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-sm text-muted-foreground">
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`w-9 h-9 text-sm ${
              currentPage === page 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background'
            }`}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 bg-background"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
