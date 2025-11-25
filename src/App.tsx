import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, FileText, Settings, Users, CreditCard, Activity, Stethoscope, BookOpen, Pill, Scale, ScanLine, Syringe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import { Navigation, type NavigationView } from './components/Navigation';
import { StickyBanner } from './components/StickyBanner';
import { HomeView } from './components/HomeView';
import { CategorySection } from './components/CategorySection';
import { ProceduresCategorySection } from './components/ProceduresCategorySection';
import { SearchBar } from './components/SearchBar';
import { SOPList } from './components/SOPList';
import { SOPDetail } from './components/SOPDetail';
import { UnifiedSearch } from './components/UnifiedSearch';
import { TermDetail } from './components/TermDetail';
import Academy from './components/Academy';
import { TerminologyView } from './components/TerminologyView';
import { LandingPage } from './components/LandingPage';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { ForgotPassword } from './components/ForgotPassword';
import { TermsSearchResults } from './components/TermsSearchResults';
import { getAllSOPs, getSOPBySlug } from './services/sopService';
import { TermSearchService } from './services/termSearchService';
import type { SearchResult } from './services/termSearchService';
import type { Category } from './types/medical-guide';
import type { MedicalTerm } from './types/medical';
import type { SOP } from './types/sop';

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

type AuthModal = 'signIn' | 'signUp' | 'forgotPassword' | null;

function App() {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTerms, setAllTerms] = useState<MedicalTerm[]>([]);
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, subcategoriesData, termsData, sopsData] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('subcategories').select('*').order('sort_order'),
        supabase.from('medical_terms').select('*'),
        getAllSOPs(),
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

      setSOPs(sopsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (view: NavigationView) => {
    setCurrentView(view);
    setSelectedSOP(null);
    setSelectedTerm(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleTermsSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = TermSearchService.search(allTerms, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSOP = async (slug: string) => {
    const sop = await getSOPBySlug(slug);
    if (sop) {
      setSelectedSOP(sop);
      setCurrentView('sops');
    }
  };

  const handleSelectTerm = (term: MedicalTerm) => {
    setSelectedTerm(term);
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
                  (term.full_form &&
                    term.full_form.toLowerCase().includes(searchQuery.toLowerCase()))
              ),
            }))
            .filter((sub) => sub.terms.length > 0),
        }))
        .filter((cat) => cat.subcategories.length > 0)
    : categories.filter((cat) => cat.name !== 'Medical Conditions' && cat.name !== 'Medical Terminology');

  const totalTerms = categories.reduce(
    (sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.terms.length, 0),
    0
  );

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medical reference hub...</p>
        </div>
      </div>
    );
  }

  // Show landing page as home
  if (currentView === 'home') {
    return (
      <LandingPage onEnter={() => setCurrentView('search')} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <Navigation currentView={currentView} onNavigate={handleNavigate} onAuthClick={() => setAuthModal('signIn')} onGoHome={() => setCurrentView('home')} />

      <div className="md:ml-64">
        <StickyBanner />
      </div>

      {/* Main Content Area */}
      <div className="md:ml-64 pb-20 md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'search' && (
            <UnifiedSearch
              allTerms={allTerms}
              allSOPs={sops}
              onSelectTerm={handleSelectTerm}
              onSelectSOP={handleSelectSOP}
            />
          )}

          {currentView === 'terms' && (
            <>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Terms in Healthcare
                  </h1>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
                    Clinic-specific terminology, abbreviations, and operational definitions you'll encounter daily
                  </p>
                  <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm mb-2">
                    <p className="text-blue-800">
                      <strong>What you'll find:</strong> Front office operations, common abbreviations (QD, BID), billing terms (Eligibility, Co-pay), and workflow concepts
                    </p>
                    <p className="text-blue-700 mt-1 text-xs">
                      <strong>Not included:</strong> General medical conditions or comprehensive clinical terminology (e.g., Cardiomyopathy, Pneumonia)
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'Showing comprehensive search results with definitions' : 'Search terms or browse by category below'}
                  </p>
                </div>

                <div className="mb-6">
                  <SearchBar
                    value={searchQuery}
                    onChange={handleTermsSearch}
                    placeholder="Search clinic terms, abbreviations, or definitions..."
                  />
                </div>

                {searchQuery.trim() ? (
                  <TermsSearchResults
                    results={searchResults}
                    query={searchQuery}
                    onSelectTerm={handleSelectTerm}
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
                      <div className="space-y-8">
                    <div>
                      <div className="mb-4 pb-2 border-b-2 border-teal-600">
                        <h2 className="text-2xl font-bold text-gray-900">Healthcare Operations</h2>
                        <p className="text-sm text-gray-600 mt-1">Front office, documentation, billing, and clinical specialties</p>
                      </div>
                      <div className="space-y-4">
                        {filteredCategories
                          .filter(cat => ['Healthcare Operations', 'Clinical Documentation', 'Insurance & Billing', 'Medical Specialties'].includes(cat.name))
                          .map((category) => (
                            <CategorySection
                              key={category.id}
                              name={category.name}
                              description={category.description || ''}
                              icon={getCategoryIcon(category.name)}
                              subcategories={category.subcategories}
                              isExpanded={expandedCategories.has(category.id) || searchQuery.length > 0}
                              onToggle={() => toggleCategory(category.id)}
                            />
                          ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 pb-2 border-b-2 border-teal-600">
                        <h2 className="text-2xl font-bold text-gray-900">Clinical Care</h2>
                        <p className="text-sm text-gray-600 mt-1">Medications, imaging, and clinical procedures</p>
                      </div>
                      <div className="space-y-4">
                        {filteredCategories
                          .filter(cat => ['Medications', 'Diagnostic Imaging', 'Procedures & Diagnostics'].includes(cat.name))
                          .map((category) => {
                            const isProcedures = category.name === 'Procedures & Diagnostics';
                            const Component = isProcedures ? ProceduresCategorySection : CategorySection;
                            return (
                              <Component
                                key={category.id}
                                name={category.name}
                                description={category.description || ''}
                                icon={getCategoryIcon(category.name)}
                                subcategories={category.subcategories}
                                isExpanded={expandedCategories.has(category.id) || searchQuery.length > 0}
                                onToggle={() => toggleCategory(category.id)}
                              />
                            );
                          })}
                      </div>
                    </div>

                    {filteredCategories.filter(cat => !['Healthcare Operations', 'Clinical Documentation', 'Insurance & Billing', 'Medical Specialties', 'Medications', 'Diagnostic Imaging', 'Procedures & Diagnostics'].includes(cat.name)).length > 0 && (
                      <div className="space-y-4">
                        {filteredCategories
                          .filter(cat => !['Healthcare Operations', 'Clinical Documentation', 'Insurance & Billing', 'Medical Specialties', 'Medications', 'Diagnostic Imaging', 'Procedures & Diagnostics'].includes(cat.name))
                          .map((category) => (
                            <CategorySection
                              key={category.id}
                              name={category.name}
                              description={category.description || ''}
                              icon={getCategoryIcon(category.name)}
                              subcategories={category.subcategories}
                              isExpanded={expandedCategories.has(category.id) || searchQuery.length > 0}
                              onToggle={() => toggleCategory(category.id)}
                            />
                          ))}
                      </div>
                    )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {currentView === 'sops' && (
            <>
              {selectedSOP ? (
                <SOPDetail sop={selectedSOP} onBack={() => setSelectedSOP(null)} />
              ) : (
                <SOPList sops={sops} onSelectSOP={handleSelectSOP} />
              )}
            </>
          )}

          {currentView === 'academy' && <Academy />}

          {currentView === 'terminology' && (
            <TerminologyView onTermSelect={handleSelectTerm} />
          )}
        </div>
      </div>

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

      {authModal === 'signIn' && (
        <SignIn
          onClose={() => setAuthModal(null)}
          onSwitchToSignUp={() => setAuthModal('signUp')}
          onSwitchToForgotPassword={() => setAuthModal('forgotPassword')}
        />
      )}

      {authModal === 'signUp' && (
        <SignUp
          onClose={() => setAuthModal(null)}
          onSwitchToSignIn={() => setAuthModal('signIn')}
        />
      )}

      {authModal === 'forgotPassword' && (
        <ForgotPassword
          onClose={() => setAuthModal(null)}
          onSwitchToSignIn={() => setAuthModal('signIn')}
        />
      )}
    </div>
  );
}

export default App;
