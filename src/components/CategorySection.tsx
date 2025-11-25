import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, type LucideIcon } from 'lucide-react';

interface Term {
  id: string;
  term: string;
  definition: string;
  full_form?: string;
  is_abbreviation: boolean;
  example_usage?: string;
}

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  terms: Term[];
}

interface CategorySectionProps {
  name: string;
  description: string;
  icon: LucideIcon;
  subcategories: Subcategory[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function CategorySection({
  name,
  description,
  icon,
  subcategories,
  isExpanded,
  onToggle
}: CategorySectionProps) {
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(new Set());
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const toggleSubcat = (subcatId: string) => {
    setExpandedSubcats(prev => {
      const next = new Set(prev);
      if (next.has(subcatId)) {
        next.delete(subcatId);
      } else {
        next.add(subcatId);
      }
      return next;
    });
  };

  const toggleTerm = (termId: string) => {
    setExpandedTerms(prev => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  const totalTerms = subcategories.reduce((sum, sub) => sum + sub.terms.length, 0);
  const IconComponent = icon;

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">{totalTerms} terms</span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          {subcategories.map((subcat) => (
            <div key={subcat.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSubcat(subcat.id)}
                className="w-full px-8 py-3 flex items-center justify-between hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expandedSubcats.has(subcat.id) ? (
                    <ChevronDown className="w-4 h-4 text-teal-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-teal-600" />
                  )}
                  <div className="text-left">
                    <h3 className="text-base font-medium text-gray-800">{subcat.name}</h3>
                    {subcat.description && (
                      <p className="text-sm text-gray-500">{subcat.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{subcat.terms.length}</span>
              </button>

              {expandedSubcats.has(subcat.id) && (
                <div className="px-12 py-4 bg-white space-y-3">
                  {subcat.terms.map((term) => {
                    const isLongDefinition = term.definition.length > 150;
                    const isTermExpanded = expandedTerms.has(term.id);
                    const displayDefinition = isLongDefinition && !isTermExpanded
                      ? term.definition.substring(0, 150) + '...'
                      : term.definition;

                    return (
                      <div
                        key={term.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all group"
                      >
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
                            <p className="text-sm text-gray-700 mb-2">{displayDefinition}</p>
                            {isLongDefinition && (
                              <button
                                onClick={() => toggleTerm(term.id)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                              >
                                {isTermExpanded ? (
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
                            {term.example_usage && isTermExpanded && (
                              <p className="text-xs text-gray-500 italic mt-2">
                                Example: {term.example_usage}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
