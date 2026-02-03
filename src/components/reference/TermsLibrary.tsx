import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SearchBar } from '../SearchBar';
import { CategorySection } from '../CategorySection';
import { TermsSearchResults } from '../TermsSearchResults';
import { TermDetail } from '../TermDetail';
import { TermSearchService } from '../../services/termSearchService';
import type { SearchResult } from '../../services/termSearchService';
import type { Category } from '../../types/medical-guide';
import type { MedicalTerm } from '../../types/medical';
import type { LucideIcon } from 'lucide-react';
import { FileText, Settings, Users, CreditCard, Activity, Stethoscope, Pill, Scale, ScanLine, Syringe } from 'lucide-react';

const getCategoryIcon = (name: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    'Clinical Documentation': FileText,
    'Healthcare Operations': Settings,
    'Healthcare Roles': Users,
    'Insurance & Billing': CreditCard,
    'Medical Conditions': Activity,
    'Medical Specialties': Stethoscope,
    'Medical Terminology': BookOpen,
    'Medications': Pill,
    'Regulatory & Compliance': Scale,
    'Procedures & Diagnostics': Syringe,
    'Diagnostic Imaging': ScanLine,
  };
  return iconMap[name] || BookOpen;
};

export function TermsLibrary() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTerms, setAllTerms] = useState<MedicalTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, subcategoriesData, termsData] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('subcategories').select('*').order('sort_order'),
        supabase.from('medical_terms').select('*'),
      ]);

      if (categoriesData.data && subcategoriesData.data && termsData.data) {
        const categoryMatches = (termCategory: string, catName: string): boolean => {
          const term = termCategory?.toLowerCase() || '';
          const cat = catName.toLowerCase();
          if (term === cat) return true;
          if (cat.includes('insurance') && term.includes('insurance')) return true;
          if (cat.includes('documentation') && term.includes('documentation')) return true;
          if (cat.includes('clinical') && term.includes('documentation')) return true;
          if (cat.includes('laboratory') && term.includes('lab')) return true;
          if (cat.includes('diagnostic') && term.includes('diagnostic')) return true;
          return false;
        };

        const organized = categoriesData.data.map((cat) => {
          const catSubcategories = subcategoriesData.data
            .filter((sub) => sub.category_id === cat.id)
            .map((sub) => ({
              ...sub,
              terms: termsData.data.filter((term) => term.subcategory_id === sub.id),
            }));

          const orphanedTerms = termsData.data.filter(
            (term) => !term.subcategory_id && categoryMatches(term.category, cat.name)
          );

          if (orphanedTerms.length > 0) {
            catSubcategories.push({
              id: `${cat.id}-general`,
              name: 'General',
              description: `General ${cat.name} terms`,
              category_id: cat.id,
              sort_order: 999,
              created_at: new Date().toISOString(),
              terms: orphanedTerms,
            });
          }

          return {
            ...cat,
            subcategories: catSubcategories,
          };
        });

        setCategories(organized);
        setAllTerms(termsData.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = TermSearchService.search(allTerms, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(categories.map((c) => c.id)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const filteredCategories = searchQuery.trim()
    ? categories
        .filter((cat) => cat.name !== 'Medical Conditions' && cat.name !== 'Medical Terminology')
        .map((cat) => ({
          ...cat,
          subcategories: cat.subcategories
            .map((sub) => ({
              ...sub,
              terms: sub.terms.filter(
                (term) =>
                  term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (term.full_form && term.full_form.toLowerCase().includes(searchQuery.toLowerCase()))
              ),
            }))
            .filter((sub) => sub.terms.length > 0),
        }))
        .filter((cat) => cat.subcategories.length > 0)
    : categories.filter((cat) => cat.name !== 'Medical Conditions' && cat.name !== 'Medical Terminology');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading terms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <img src="/icons/terms-icon.png" alt="Terms" className="w-14 h-14" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms in Healthcare</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
          Clinic-specific terminology, abbreviations, and operational definitions you'll encounter daily
        </p>
        <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm mb-2">
          <p className="text-blue-800">
            <strong>What you'll find:</strong> Front office operations, common abbreviations (QD, BID), billing terms (Eligibility, Co-pay), and workflow concepts
          </p>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search clinic terms, abbreviations, or definitions..."
        />
      </div>

      {searchQuery.trim() ? (
        <TermsSearchResults
          results={searchResults}
          query={searchQuery}
          onSelectTerm={setSelectedTerm}
        />
      ) : (
        <>
          <div className="flex justify-end gap-3 mb-4">
            <button
              onClick={expandAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-white border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
              Collapse All
            </button>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No categories available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  name={category.name}
                  description={category.description || ''}
                  icon={getCategoryIcon(category.name)}
                  subcategories={category.subcategories}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTerm(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <TermDetail term={selectedTerm} onClose={() => setSelectedTerm(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
