import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getAllSOPs } from '../../services/sopService';
import { UnifiedSearch } from '../UnifiedSearch';
import type { MedicalTerm } from '../../types/medical';
import type { SOP } from '../../types/sop';

export function SearchPage() {
  const navigate = useNavigate();
  const [allTerms, setAllTerms] = useState<MedicalTerm[]>([]);
  const [allSOPs, setAllSOPs] = useState<SOP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [termsData, sopsData] = await Promise.all([
        supabase.from('medical_terms').select('*'),
        getAllSOPs(),
      ]);

      if (termsData.data) {
        setAllTerms(termsData.data);
      }
      setAllSOPs(sopsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSOP = (slug: string) => {
    navigate(`/workflows/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    );
  }

  return (
    <UnifiedSearch
      allTerms={allTerms}
      allSOPs={allSOPs}
      onSelectTerm={() => {}} // Term detail handled inside UnifiedSearch
      onSelectSOP={handleSelectSOP}
    />
  );
}
