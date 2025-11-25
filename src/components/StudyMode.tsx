import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FlashCard } from './FlashCard';
import type { MedicalTerm } from '../types/medical';

type SortOption = 'alphabetical' | 'category' | 'random';

interface StudyModeProps {
  onTermSelect?: (term: MedicalTerm) => void;
}

export function StudyMode(): JSX.Element {
  const [terms, setTerms] = useState<MedicalTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<MedicalTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  const categories = [
    { value: 'all', label: 'All Types', count: 0 },
    { value: 'Root', label: 'Roots', count: 0 },
    { value: 'Prefix', label: 'Prefixes', count: 0 },
    { value: 'Suffix', label: 'Suffixes', count: 0 },
    { value: 'Direction', label: 'Directions', count: 0 },
    { value: 'Position', label: 'Positions', count: 0 },
  ];

  useEffect(() => {
    loadTerms();
  }, []);

  useEffect(() => {
    filterAndSortTerms();
  }, [terms, searchQuery, selectedCategory, sortBy]);

  const loadTerms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_terms')
        .select('*')
        .in('category', ['Root', 'Prefix', 'Suffix', 'Direction', 'Position'])
        .order('term');

      if (error) throw error;
      setTerms(data || []);
    } catch (error) {
      console.error('Error loading terms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortTerms = () => {
    let filtered = [...terms];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(query) ||
        term.definition?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.term.localeCompare(b.term));
        break;
      case 'category':
        filtered.sort((a, b) => {
          const catCompare = (a.category || '').localeCompare(b.category || '');
          return catCompare !== 0 ? catCompare : a.term.localeCompare(b.term);
        });
        break;
      case 'random':
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    setFilteredTerms(filtered);
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {
      all: terms.length,
    };

    terms.forEach(term => {
      if (term.category) {
        counts[term.category] = (counts[term.category] || 0) + 1;
      }
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const getExamples = (term: MedicalTerm): string[] => {
    const examples: string[] = [];

    if (term.category === 'Root') {
      const base = term.term.toLowerCase().replace(/\/o$/, '');
      if (base === 'cardi') {
        examples.push('cardiology (study of the heart)', 'cardiac (relating to the heart)');
      } else if (base === 'derm') {
        examples.push('dermatology (study of skin)', 'dermatitis (skin inflammation)');
      } else if (base === 'gastr') {
        examples.push('gastritis (stomach inflammation)', 'gastroenterology (study of digestive system)');
      }
    } else if (term.category === 'Prefix') {
      const prefix = term.term.toLowerCase().replace(/-$/, '');
      if (prefix === 'hyper') {
        examples.push('hypertension (high blood pressure)', 'hyperactive (overly active)');
      } else if (prefix === 'hypo') {
        examples.push('hypotension (low blood pressure)', 'hypothermia (low body temperature)');
      }
    } else if (term.category === 'Suffix') {
      const suffix = term.term.toLowerCase().replace(/^-/, '');
      if (suffix === 'itis') {
        examples.push('appendicitis (appendix inflammation)', 'arthritis (joint inflammation)');
      } else if (suffix === 'ectomy') {
        examples.push('appendectomy (appendix removal)', 'tonsillectomy (tonsil removal)');
      }
    } else if (term.category === 'Direction') {
      if (term.term.toLowerCase() === 'anterior') {
        examples.push('anterior chest wall', 'anterior fontanel');
      } else if (term.term.toLowerCase() === 'posterior') {
        examples.push('posterior aspect', 'posterior cruciate ligament');
      }
    } else if (term.category === 'Position') {
      if (term.term.toLowerCase() === 'supine') {
        examples.push('Used for abdominal exams', 'Used for CPR');
      } else if (term.term.toLowerCase() === 'prone') {
        examples.push('Used for back exams', 'Used for certain spine surgeries');
      }
    }

    return examples;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search within results..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Category</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({categoryCounts[cat.value] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <ArrowUpDown className="w-4 h-4" />
                <span className="font-medium">Sort By</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="alphabetical">A-Z (Alphabetical)</option>
                <option value="category">By Category</option>
                <option value="random">Random (Quiz Mode)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-teal-600">{filteredTerms.length}</span> of{' '}
            <span className="font-semibold">{terms.length}</span> terms
          </p>
        </div>
      </div>

      {filteredTerms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No terms found matching your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <FlashCard
              key={term.id}
              term={term.term}
              definition={term.definition || 'No definition available'}
              category={term.category || 'Unknown'}
              examples={getExamples(term)}
            />
          ))}
        </div>
      )}

      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <p className="text-sm text-teal-900">
          <strong>Study Tip:</strong> Click any card to flip it and reveal the definition. Try the Random sort to quiz yourself!
        </p>
      </div>
    </div>
  );
}
