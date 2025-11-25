import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { SearchResult } from '../services/termSearchService';
import type { MedicalTerm } from '../types/medical';

interface TermsSearchResultsProps {
  results: SearchResult[];
  query: string;
  onSelectTerm: (term: MedicalTerm) => void;
}

export function TermsSearchResults({ results, query, onSelectTerm }: TermsSearchResultsProps) {
  const [showPartialMatches, setShowPartialMatches] = useState(false);

  // Use score-based grouping to respect modality-first prioritization
  // High scores (900+) are primary results, lower scores are secondary
  const primaryResults = results.filter((r) => r.matchScore >= 900);
  const secondaryResults = results.filter((r) => r.matchScore < 900);

  const getMatchTypeLabel = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact':
        return 'Exact Match';
      case 'starts-with':
        return 'Starts With';
      case 'contains':
        return 'Contains';
      case 'partial':
        return 'Found in Definition';
    }
  };

  const getMatchTypeBadgeColor = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'starts-with':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'contains':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'partial':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const highlightMatch = (text: string, query: string): JSX.Element => {
    if (!query.trim()) return <>{text}</>;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 font-semibold">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No terms found matching "{query}"</p>
        <p className="text-sm text-gray-400">Try different keywords or browse by category below</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-teal-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {results.length} {results.length === 1 ? 'result' : 'results'} found for "{query}"
            </h3>
            <p className="text-sm text-gray-600">
              {primaryResults.length} top {primaryResults.length === 1 ? 'match' : 'matches'}
              {secondaryResults.length > 0 && ` • ${secondaryResults.length} additional ${secondaryResults.length === 1 ? 'match' : 'matches'}`}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Results (High Scores) */}
      {primaryResults.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Top Results ({primaryResults.length})
            </h2>
          </div>
          <div className="space-y-3">
            {primaryResults.map((result) => (
              <button
                key={result.id}
                onClick={() => onSelectTerm(result)}
                className="w-full bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-teal-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg text-gray-900">
                        {highlightMatch(result.term, query)}
                      </h3>
                      {result.is_abbreviation && result.full_form && (
                        <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">
                          {highlightMatch(result.full_form, query)}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded border ${getMatchTypeBadgeColor(result.matchType)}`}
                      >
                        {getMatchTypeLabel(result.matchType)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {highlightMatch(result.definition, query)}
                    </p>
                    {result.example_usage && (
                      <div className="bg-blue-50 border-l-2 border-blue-300 p-2 text-xs text-blue-900 italic">
                        <strong>Example:</strong> {result.example_usage}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      {result.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {result.category}
                        </span>
                      )}
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {result.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Results (Lower Scores) */}
      {secondaryResults.length > 0 && (
        <div>
          <button
            onClick={() => setShowPartialMatches(!showPartialMatches)}
            className="flex items-center gap-2 mb-4 text-gray-700 hover:text-teal-600 transition-colors"
          >
            {showPartialMatches ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
            <h2 className="text-lg font-semibold">
              More Results ({secondaryResults.length})
            </h2>
            <span className="text-sm text-gray-500">
              Additional terms related to "{query}"
            </span>
          </button>

          {showPartialMatches && (
            <div className="space-y-2">
              {secondaryResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => onSelectTerm(result)}
                  className="w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all text-left border border-gray-200 hover:border-teal-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {highlightMatch(result.term, query)}
                        </h3>
                        {result.is_abbreviation && result.full_form && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {highlightMatch(result.full_form, query)}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded border ${getMatchTypeBadgeColor(result.matchType)}`}
                        >
                          {getMatchTypeLabel(result.matchType)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {highlightMatch(result.definition, query)}
                      </p>
                      {result.category && (
                        <span className="text-xs text-gray-500 mt-2 inline-block">
                          {result.category}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
