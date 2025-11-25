import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface FlashCardProps {
  term: string;
  definition: string;
  category: string;
  examples?: string[];
}

export function FlashCard({ term, definition, category, examples }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Root': 'border-teal-300 bg-teal-50',
      'Prefix': 'border-blue-300 bg-blue-50',
      'Suffix': 'border-purple-300 bg-purple-50',
      'Direction': 'border-orange-300 bg-orange-50',
      'Position': 'border-green-300 bg-green-50',
    };
    return colors[cat] || 'border-gray-300 bg-gray-50';
  };

  const getCategoryBadgeColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Root': 'bg-teal-100 text-teal-800',
      'Prefix': 'bg-blue-100 text-blue-800',
      'Suffix': 'bg-purple-100 text-purple-800',
      'Direction': 'bg-orange-100 text-orange-800',
      'Position': 'bg-green-100 text-green-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      className="relative h-64 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl border-2 ${getCategoryColor(category)} p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-center items-center`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getCategoryBadgeColor(category)}`}>
            {category}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {term}
          </h3>
          <p className="text-sm text-gray-500 text-center">Click to reveal definition</p>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl border-2 ${getCategoryColor(category)} bg-white p-6 shadow-md hover:shadow-lg transition-shadow rotate-y-180`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className={`px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block ${getCategoryBadgeColor(category)}`}>
            {category}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {term}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {definition}
          </p>
          {examples && examples.length > 0 && (
            <div className="mt-auto pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">Examples:</p>
              <div className="space-y-1">
                {examples.slice(0, 2).map((example, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-teal-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 text-center mt-3">Click to flip back</p>
        </div>
      </div>
    </div>
  );
}
