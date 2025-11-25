import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, GraduationCap, Library } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TerminologyAgent } from './TerminologyAgent';
import { LearnMoreSection } from './LearnMoreSection';
import { StudyMode } from './StudyMode';
import type { Category } from '../types/medical-guide';
import type { MedicalTerm } from '../types/medical';

type ViewMode = 'learn' | 'study';

interface TerminologyViewProps {
  onTermSelect: (term: MedicalTerm) => void;
}

export function TerminologyView({ onTermSelect }: TerminologyViewProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('learn');

  useEffect(() => {
    loadTerminologyCategory();
  }, []);

  const loadTerminologyCategory = async () => {
    setIsLoading(true);
    try {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('name', 'Medical Terminology')
        .maybeSingle();

      if (categoryData) {
        const { data: subcategoriesData } = await supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', categoryData.id)
          .order('sort_order');

        const subcategoriesWithTerms = await Promise.all(
          (subcategoriesData || []).map(async (subcategory) => {
            const { data: termsData } = await supabase
              .from('medical_terms')
              .select('*')
              .eq('subcategory_id', subcategory.id)
              .order('term');

            return {
              ...subcategory,
              terms: termsData || [],
            };
          })
        );

        setCategory({
          ...categoryData,
          subcategories: subcategoriesWithTerms,
        });
      }
    } catch (error) {
      console.error('Error loading terminology category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading terminology...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-500">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>No terminology data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Learning Hub</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-teal-600 font-medium">Medical Terminology</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Medical Terminology Learning Hub
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  Master the language of healthcare by understanding how medical terms are constructed.
                  Learn to break down complex medical words into their component parts: prefixes, root words,
                  and suffixes. This foundational knowledge will help you decipher unfamiliar terms and
                  communicate more effectively in healthcare settings.
                </p>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm">
                  <p className="text-teal-900 font-medium mb-2">
                    <strong>Learn word-building components:</strong>
                  </p>
                  <p className="text-teal-800 mb-3">
                    Prefixes (hyper-, hypo-, pre-, post-), suffixes (-ectomy, -itis, -algia, -ology), root words (cardi-, gastro-, pneumo-, nephr-), and directional terms (anterior, posterior, proximal, distal)
                  </p>
                  <p className="text-teal-700 text-xs border-t border-teal-200 pt-2">
                    <strong>Looking for complete medical terms or workflows?</strong> Visit the <strong>Search Everything</strong> tab to find acronyms (HIPAA, CT, MRI), clinic procedures, imaging studies, and step-by-step workflows
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('learn')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                viewMode === 'learn'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Library className="w-5 h-5" />
              <span>Learn Mode</span>
            </button>
            <button
              onClick={() => setViewMode('study')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                viewMode === 'study'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Study Mode</span>
            </button>
          </div>
        </div>

        {viewMode === 'learn' ? (
          <>
            <TerminologyAgent />
            <LearnMoreSection />
          </>
        ) : (
          <StudyMode />
        )}
      </div>
    </div>
  );
}
