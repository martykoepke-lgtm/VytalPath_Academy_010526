import { useState } from 'react';
import { MessageSquare, Send, Loader2, BookOpen, Lightbulb, X } from 'lucide-react';

interface TermComponent {
  part: string;
  type: 'prefix' | 'root' | 'suffix';
  meaning: string;
}

interface AnalysisResult {
  term: string;
  components: TermComponent[];
  fullDefinition: string;
  example?: string;
}

export function TerminologyAgent() {
  const [inputTerm, setInputTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeTerm = async () => {
    if (!inputTerm.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-medical-term`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ term: inputTerm.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze term');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError('Unable to analyze the term. Please try again or try a different term.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzeTerm();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prefix':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'root':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'suffix':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const exampleTerms = ['Cardiomegaly', 'Gastroenteritis', 'Neuropathy', 'Dermatology', 'Hepatitis'];

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 p-6 shadow-lg">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-3 bg-teal-600 rounded-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Medical Term Analyzer
          </h2>
          <p className="text-gray-700">
            Enter any medical term to see it broken down into its component parts with meanings and definitions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputTerm}
            onChange={(e) => setInputTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a medical term (e.g., Cardiomegaly)..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            disabled={isAnalyzing}
          />
          <button
            onClick={analyzeTerm}
            disabled={isAnalyzing || !inputTerm.trim()}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Try examples:</span>
          {exampleTerms.map((term) => (
            <button
              key={term}
              onClick={() => setInputTerm(term)}
              className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              disabled={isAnalyzing}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-gray-900">Term Breakdown</h3>
              </div>
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setInputTerm('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Clear results and start fresh"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-2xl font-bold text-teal-700 mb-4">{analysisResult.term}</h4>
              <div className="flex flex-wrap gap-3">
                {analysisResult.components.map((component, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 rounded-lg border-2 ${getTypeColor(component.type)} transition-all hover:scale-105`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase mb-1 opacity-75">
                        {component.type}
                      </span>
                      <span className="text-lg font-bold mb-1">{component.part}</span>
                      <span className="text-sm font-medium">{component.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Complete Definition</h4>
                  <p className="text-gray-700 leading-relaxed">{analysisResult.fullDefinition}</p>
                  {analysisResult.example && (
                    <p className="text-sm text-gray-600 italic mt-3">
                      <strong>Example:</strong> {analysisResult.example}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="font-semibold text-teal-900 mb-2 text-sm">Understanding the Components</h4>
            <div className="space-y-2 text-sm text-teal-800">
              <p className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>
                <span><strong>Prefix:</strong> Appears at the beginning and modifies the root meaning</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-teal-500 mt-1 flex-shrink-0"></span>
                <span><strong>Root:</strong> The core meaning of the word, often referring to a body part or system</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></span>
                <span><strong>Suffix:</strong> Appears at the end and indicates a procedure, condition, or disease</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
