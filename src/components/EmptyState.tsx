import { Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  query: string;
  hasSearched: boolean;
}

export function EmptyState({ query, hasSearched }: EmptyStateProps) {
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-blue-50 rounded-full p-6 mb-4">
          <Search className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Search Medical Terms
        </h3>
        <p className="text-gray-600 max-w-md">
          Enter a medical term, abbreviation, or condition to get plain-language definitions
          from our curated database.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="font-medium text-gray-700 mb-1">Try searching:</p>
            <p className="text-gray-600">HTN, TSH, MRI</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="font-medium text-gray-700 mb-1">Or ask:</p>
            <p className="text-gray-600">What is spirometry?</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-amber-50 rounded-full p-6 mb-4">
        <AlertCircle className="h-12 w-12 text-amber-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Not in Dataset
      </h3>
      <p className="text-gray-600 max-w-md mb-4">
        No results found for <span className="font-semibold">"{query}"</span>
      </p>
      <p className="text-sm text-gray-500">
        This term may not be in our database yet. Try searching for related terms or
        abbreviations.
      </p>
    </div>
  );
}
