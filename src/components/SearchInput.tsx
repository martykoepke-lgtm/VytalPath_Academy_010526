import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSearching?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search medical terms or abbreviations...",
  isSearching = false
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
          isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'
        }`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100
                     transition-all duration-200 shadow-sm hover:border-gray-300"
        />
      </div>
    </div>
  );
}
