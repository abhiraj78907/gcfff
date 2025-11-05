import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PatientSearchBarProps {
  onSearch: (query: string) => void;
}

export const PatientSearchBar = ({ onSearch }: PatientSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search returning patient by name, mobile, or UHID..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9 h-12 text-base"
      />
    </div>
  );
};
