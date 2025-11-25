import { BookOpen, ChevronRight } from 'lucide-react';
import type { MedicalTerm } from '../types/medical';

interface ResultsListProps {
  results: MedicalTerm[];
  onSelectTerm: (term: MedicalTerm) => void;
  isLoading?: boolean;
}

export function ResultsList({ results, onSelectTerm, isLoading = false }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl space-y-2">
      <p className="text-sm text-gray-600 px-1 mb-3">
        Found {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>
      {results.map((term) => (
        <button
          key={term.id}
          onClick={() => onSelectTerm(term)}
          className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200
                     hover:border-blue-300 hover:shadow-md transition-all duration-200
                     text-left group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">
                  {term.term}
                </h3>
                {term.is_abbreviation && term.full_form && (
                  <span className="text-sm text-gray-500 truncate">
                    ({term.full_form})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {term.category && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50
                                 text-blue-700 rounded">
                    {term.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {term.definition}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600
                                   flex-shrink-0 transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
}
