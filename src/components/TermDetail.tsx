import { X, ArrowLeft, BookOpen, Tag } from 'lucide-react';
import type { MedicalTerm } from '../types/medical';

interface TermDetailProps {
  term: MedicalTerm;
  onClose: () => void;
}

export function TermDetail({ term, onClose }: TermDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center
                    z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl px-6 py-4
                        flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900
                     transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to results</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">{term.term}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {term.category && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-50
                               text-blue-700 rounded-full">
                  {term.category}
                </span>
              )}
              {term.is_abbreviation && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100
                               text-gray-700 rounded-full">
                  Abbreviation
                </span>
              )}
            </div>

            {term.is_abbreviation && term.full_form && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-blue-900 mb-1">Full Form</p>
                <p className="text-lg text-blue-800">{term.full_form}</p>
              </div>
            )}

            {term.breakdown && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Etymology</p>
                <p className="text-gray-800">{term.breakdown}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Definition</h3>
            <p className="text-gray-700 leading-relaxed">{term.definition}</p>
          </div>

          {term.example_usage && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Example Usage</h3>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <p className="text-gray-700 italic">{term.example_usage}</p>
              </div>
            </div>
          )}

          {term.synonyms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {term.synonyms.map((synonym, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700
                             rounded-full"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}

          {term.aliases.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Also Known As</h3>
              <div className="flex flex-wrap gap-2">
                {term.aliases.map((alias, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700
                             rounded-full"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          )}

          {term.tags.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {term.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600
                             rounded border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
