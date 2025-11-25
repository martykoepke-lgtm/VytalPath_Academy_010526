import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Term {
  id: string;
  term: string;
  definition: string;
  full_form?: string;
  is_abbreviation: boolean;
  example_usage?: string;
}

interface ProcedureCardProps {
  term: Term;
}

export function ProcedureCard({ term }: ProcedureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortDefinition = term.definition.length > 150
    ? term.definition.substring(0, 150) + '...'
    : term.definition;

  const showExpandButton = term.definition.length > 150;

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
              {term.term}
            </h4>
            {term.is_abbreviation && term.full_form && (
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                {term.full_form}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-2">
            {isExpanded ? term.definition : shortDefinition}
          </p>
          {showExpandButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
          {term.example_usage && isExpanded && (
            <p className="text-xs text-gray-500 italic mt-2">
              Example: {term.example_usage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
