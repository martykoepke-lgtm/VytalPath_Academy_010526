import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getSOPBySlug } from '../../services/sopService';
import { SOPDetail } from '../SOPDetail';
import { useAgentOrchestrator } from '../../contexts/AgentOrchestratorContext';
import type { SOP } from '../../types/sop';

export function SOPDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sop, setSOP] = useState<SOP | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orchestrator = useAgentOrchestrator();

  useEffect(() => {
    if (slug) {
      loadSOP(slug);
    }
  }, [slug]);

  const loadSOP = async (sopSlug: string) => {
    try {
      const data = await getSOPBySlug(sopSlug);
      setSOP(data);
    } catch (error) {
      console.error('Failed to load SOP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePracticeSOP = () => {
    if (!sop) return;
    // Set up SOP scenario agent with this SOP's context
    orchestrator.setActiveAgent('sop-scenario');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (!sop) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Workflow Not Found</h2>
        <p className="text-gray-600 mb-6">This workflow doesn't exist or has been removed.</p>
        <Link
          to="/workflows"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workflows
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Practice This SOP button */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={handlePracticeSOP}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Practice This SOP with AI Scenarios
        </button>
      </div>
      <SOPDetail
        sop={sop}
        onBack={() => window.history.back()}
      />
    </div>
  );
}
