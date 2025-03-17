
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableCategories } from "@/lib/api";
import { Filter } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onChange: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onChange }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(getAvailableCategories());
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedCategory} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-background/80">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
