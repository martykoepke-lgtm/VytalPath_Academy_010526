import { useState } from 'react';
import { Search, BookOpen, FileText, TrendingUp, Sparkles } from 'lucide-react';
import { SearchInput } from './SearchInput';
import type { MedicalTerm } from '../types/medical';
import type { SOP } from '../types/sop';
import { UnifiedSearchService } from '../services/unifiedSearchService';

interface UnifiedSearchProps {
  allTerms: MedicalTerm[];
  allSOPs: SOP[];
  onSelectTerm: (term: MedicalTerm) => void;
  onSelectSOP: (slug: string) => void;
}

export function UnifiedSearch({ allTerms, allSOPs, onSelectTerm, onSelectSOP }: UnifiedSearchProps) {
  const [query, setQuery] = useState('');

  const { termResults, sopResults } = query.trim()
    ? UnifiedSearchService.search(allTerms, allSOPs, query)
    : { termResults: [], sopResults: [] };

  const groupedTerms = UnifiedSearchService.groupByRelevance(termResults);
  const groupedSOPs = UnifiedSearchService.groupByRelevance(sopResults);

  const hasResults = termResults.length > 0 || sopResults.length > 0;
  const hasHighlyRelevantResults =
    groupedTerms.highly_relevant.length > 0 || groupedSOPs.highly_relevant.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Search Everything</h1>
        <p className="text-gray-600 mb-3">Search across complete terms, acronyms, and workflows</p>
        <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-blue-900 font-medium mb-2">
            <strong>Find complete, ready-to-use terms:</strong>
          </p>
          <p className="text-blue-800 mb-3">
            Healthcare acronyms (HIPAA, PHI, CT, MRI), clinic operations (Eligibility, Co-pay, Prior Authorization), imaging procedures (CT Head, MRI Brain), and step-by-step workflows (Patient Check-In, Scheduling)
          </p>
          <p className="text-blue-700 text-xs border-t border-blue-200 pt-2">
            <strong>Need to break down medical word parts?</strong> Visit the <strong>Medical Terminology</strong> tab for prefixes (hyper-, pre-), suffixes (-ectomy, -itis), and root words (cardi-, gastro-)
          </p>
        </div>
      </div>

      <div className="mb-8">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search clinic terms, abbreviations, workflows, procedures..."
        />
      </div>

      {!query.trim() && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Start Typing to Search</h3>
          <p className="text-gray-600 mb-6">
            Search across {allTerms.length} clinic terms and {allSOPs.length} common workflows
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
              <h4 className="font-medium text-teal-900 mb-2">Terms in Healthcare</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Clinic-specific definitions</li>
                <li>• Common abbreviations</li>
                <li>• Operational terminology</li>
                <li>• Usage examples</li>
              </ul>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h4 className="font-medium text-indigo-900 mb-2">Common Workflows</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Procedure titles</li>
                <li>• Step descriptions</li>
                <li>• Workflow details</li>
                <li>• Best practices</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {query.trim() && !hasResults && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No results found for "{query}"</p>
          <p className="text-sm text-gray-400">Try different keywords or browse by category</p>
        </div>
      )}

      {query.trim() && hasResults && (
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {termResults.length + sopResults.length}{' '}
                  {termResults.length + sopResults.length === 1 ? 'result' : 'results'} found for "
                  {query}"
                </h3>
                <p className="text-sm text-gray-600">
                  {groupedTerms.highly_relevant.length + groupedSOPs.highly_relevant.length} best{' '}
                  {groupedTerms.highly_relevant.length + groupedSOPs.highly_relevant.length === 1
                    ? 'match'
                    : 'matches'}
                  {groupedTerms.relevant.length + groupedSOPs.relevant.length > 0 &&
                    ` • ${groupedTerms.relevant.length + groupedSOPs.relevant.length} related`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {groupedTerms.highly_relevant.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900">Best Matches</h2>
            <span className="text-sm text-gray-500">
              ({groupedTerms.highly_relevant.length} term
              {groupedTerms.highly_relevant.length !== 1 ? 's' : ''})
            </span>
          </div>
          <div className="space-y-3">
            {groupedTerms.highly_relevant.map((result) => {
              const term = result.item as MedicalTerm;
              return (
                <button
                  key={term.id}
                  onClick={() => onSelectTerm(term)}
                  className="w-full bg-gradient-to-r from-amber-50 to-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all text-left border-2 border-amber-200 hover:border-amber-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-lg text-gray-900">{term.term}</h3>
                        {term.is_abbreviation && term.full_form && (
                          <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">
                            {term.full_form}
                          </span>
                        )}
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-300">
                          {result.matchType === 'exact'
                            ? 'Exact Match'
                            : result.matchType === 'starts-with'
                            ? 'Starts With'
                            : 'Strong Match'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{term.definition}</p>
                      {term.category && (
                        <span className="text-xs text-gray-500 mt-2 inline-block bg-gray-100 px-2 py-1 rounded">
                          {term.category}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {groupedTerms.relevant.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Related Terms</h2>
            <span className="text-sm text-gray-500">({groupedTerms.relevant.length})</span>
          </div>
          <div className="space-y-3">
            {groupedTerms.relevant.map((result) => {
              const term = result.item as MedicalTerm;
              return (
                <button
                  key={term.id}
                  onClick={() => onSelectTerm(term)}
                  className="w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-left border border-gray-200 hover:border-teal-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{term.term}</h3>
                        {term.is_abbreviation && term.full_form && (
                          <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded">
                            {term.full_form}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{term.definition}</p>
                      {term.category && (
                        <span className="text-xs text-gray-500 mt-2 inline-block">
                          {term.category}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {groupedSOPs.highly_relevant.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Matching Workflows</h2>
            <span className="text-sm text-gray-500">
              ({groupedSOPs.highly_relevant.length})
            </span>
          </div>
          <div className="space-y-3">
            {groupedSOPs.highly_relevant.map((result) => {
              const sop = result.item as SOP;
              return (
                <button
                  key={sop.id}
                  onClick={() => onSelectSOP(sop.slug)}
                  className="w-full bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all text-left border-2 border-indigo-200 hover:border-indigo-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{sop.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{sop.title}</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-300">
                          {result.matchType === 'exact'
                            ? 'Exact Match'
                            : result.matchType === 'starts-with'
                            ? 'Starts With'
                            : 'Strong Match'}
                        </span>
                      </div>
                      {sop.description && (
                        <p className="text-sm text-gray-600 mb-2">{sop.description}</p>
                      )}
                      <span className="text-xs text-indigo-600 font-medium">
                        {sop.steps.length} steps
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {groupedSOPs.relevant.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Related Workflows</h2>
            <span className="text-sm text-gray-500">({groupedSOPs.relevant.length})</span>
          </div>
          <div className="space-y-3">
            {groupedSOPs.relevant.map((result) => {
              const sop = result.item as SOP;
              return (
                <button
                  key={sop.id}
                  onClick={() => onSelectSOP(sop.slug)}
                  className="w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-left border border-gray-200 hover:border-indigo-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{sop.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{sop.title}</h3>
                      {sop.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{sop.description}</p>
                      )}
                      <span className="text-xs text-gray-500">{sop.steps.length} steps</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
