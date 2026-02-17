import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Users, Eye, Gauge, Trophy,
  CheckCircle2, ChevronRight, Sparkles,
  Phone, Clock, HeadphonesIcon, ClipboardCheck
} from 'lucide-react';
import { SimulationExperience } from './SimulationExperience';
import { SpotTheViolation } from './SpotTheViolation';
import { RiskMeter } from './RiskMeter';
import { ExperienceProgress } from '../../types/interactive';

type ActiveExperience = 'hub' | 'simulation' | 'spot-violation' | 'risk-meter';

const STORAGE_KEY = 'vytalpath_interactive_progress';

const defaultProgress: ExperienceProgress = {
  simulationScore: 0,
  simulationTotal: 0,
  simulationCompleted: false,
  spotViolationScore: 0,
  spotViolationTotal: 0,
  spotViolationCompleted: false,
  riskMeterScore: 0,
  riskMeterTotal: 0,
  riskMeterCompleted: false,
  allCompleted: false,
};

interface ReadinessData {
  buildSkills: number; // 0-3 completed
  practiceScenarios: number; // 0-3 completed
  proveReady: boolean;
  overall: number; // 0-100
}

function computeReadiness(): ReadinessData {
  let buildSkills = 0;
  let practiceScenarios = 0;
  let proveReady = false;

  // Stage 1: Build Skills (existing 3 experiences)
  try {
    const interactive = localStorage.getItem(STORAGE_KEY);
    if (interactive) {
      const data = JSON.parse(interactive);
      if (data.simulationCompleted) buildSkills++;
      if (data.spotViolationCompleted) buildSkills++;
      if (data.riskMeterCompleted) buildSkills++;
    }
  } catch { /* ignore */ }

  // Stage 2: Practice Scenarios
  try {
    const phone = localStorage.getItem('vytalpath_phone_sim');
    if (phone) {
      const data = JSON.parse(phone);
      if (data.completedCalls?.length > 0) practiceScenarios++;
    }
  } catch { /* ignore */ }

  try {
    const day = localStorage.getItem('vytalpath_day_sim');
    if (day) {
      const data = JSON.parse(day);
      if (data.completedShifts?.length > 0) practiceScenarios++;
    }
  } catch { /* ignore */ }

  try {
    const hotline = localStorage.getItem('vytalpath_ins_hotline');
    if (hotline) {
      const data = JSON.parse(hotline);
      if (data.completedCalls?.length > 0) practiceScenarios++;
    }
  } catch { /* ignore */ }

  // Stage 3: Knowledge Check
  try {
    const readiness = localStorage.getItem('vytalpath_readiness');
    if (readiness) {
      const data = JSON.parse(readiness);
      if (data.passed) proveReady = true;
    }
  } catch { /* ignore */ }

  // Overall: weighted score
  const totalPossible = 3 + 3 + 1; // 7 total
  const totalCompleted = buildSkills + practiceScenarios + (proveReady ? 1 : 0);
  const overall = Math.round((totalCompleted / totalPossible) * 100);

  return { buildSkills, practiceScenarios, proveReady, overall };
}

export function InteractiveHub() {
  const navigate = useNavigate();
  const [activeExperience, setActiveExperience] = useState<ActiveExperience>('hub');
  const [progress, setProgress] = useState<ExperienceProgress>(defaultProgress);
  const [readiness, setReadiness] = useState<ReadinessData>(computeReadiness);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    setReadiness(computeReadiness());
  }, []);

  const saveProgress = (newProgress: ExperienceProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    setReadiness(computeReadiness());
  };

  const handleSimulationComplete = (score: number, total: number) => {
    const passed = (score / total) >= 0.7;
    const newProgress = { ...progress, simulationScore: score, simulationTotal: total, simulationCompleted: passed };
    newProgress.allCompleted = newProgress.simulationCompleted && newProgress.spotViolationCompleted && newProgress.riskMeterCompleted;
    if (newProgress.allCompleted && !progress.allCompleted) newProgress.completedAt = new Date().toISOString();
    saveProgress(newProgress);
    setActiveExperience('hub');
  };

  const handleSpotViolationComplete = (score: number, total: number) => {
    const newProgress = { ...progress, spotViolationScore: score, spotViolationTotal: total, spotViolationCompleted: true };
    newProgress.allCompleted = newProgress.simulationCompleted && newProgress.spotViolationCompleted && newProgress.riskMeterCompleted;
    if (newProgress.allCompleted && !progress.allCompleted) newProgress.completedAt = new Date().toISOString();
    saveProgress(newProgress);
    setActiveExperience('hub');
  };

  const handleRiskMeterComplete = (score: number, total: number) => {
    const newProgress = { ...progress, riskMeterScore: score, riskMeterTotal: total, riskMeterCompleted: true };
    newProgress.allCompleted = newProgress.simulationCompleted && newProgress.spotViolationCompleted && newProgress.riskMeterCompleted;
    if (newProgress.allCompleted && !progress.allCompleted) newProgress.completedAt = new Date().toISOString();
    saveProgress(newProgress);
    setActiveExperience('hub');
  };

  // Render active experience
  if (activeExperience === 'simulation') {
    return <SimulationExperience onComplete={handleSimulationComplete} onBack={() => setActiveExperience('hub')} />;
  }
  if (activeExperience === 'spot-violation') {
    return <SpotTheViolation onComplete={handleSpotViolationComplete} onBack={() => setActiveExperience('hub')} />;
  }
  if (activeExperience === 'risk-meter') {
    return <RiskMeter onComplete={handleRiskMeterComplete} onBack={() => setActiveExperience('hub')} />;
  }

  // Stages
  const stages = [
    {
      number: 1,
      title: 'Build Your Skills',
      subtitle: 'Practice compliance and decision-making fundamentals',
      color: 'blue',
      progress: `${readiness.buildSkills}/3`,
      items: [
        {
          id: 'simulation',
          title: 'Your First Day',
          description: 'Navigate real workplace scenarios through choose-your-path decision making.',
          icon: Users,
          completed: progress.simulationCompleted,
          score: progress.simulationTotal > 0 ? `${progress.simulationScore}/${progress.simulationTotal}` : null,
          action: () => setActiveExperience('simulation'),
        },
        {
          id: 'spot-violation',
          title: 'Spot the Violation',
          description: 'Find privacy and compliance issues hiding in everyday workplace scenes.',
          icon: Eye,
          completed: progress.spotViolationCompleted,
          score: progress.spotViolationTotal > 0 ? `${progress.spotViolationScore}/${progress.spotViolationTotal}` : null,
          action: () => setActiveExperience('spot-violation'),
        },
        {
          id: 'risk-meter',
          title: 'Risk Meter',
          description: 'Categorize scenarios by risk level — from safe practices to clear violations.',
          icon: Gauge,
          completed: progress.riskMeterCompleted,
          score: progress.riskMeterTotal > 0 ? `${progress.riskMeterScore}/${progress.riskMeterTotal}` : null,
          action: () => setActiveExperience('risk-meter'),
        },
      ],
    },
    {
      number: 2,
      title: 'Practice Real Scenarios',
      subtitle: 'AI-powered simulations of real front office situations',
      color: 'purple',
      progress: `${readiness.practiceScenarios}/3`,
      aiPowered: true,
      items: [
        {
          id: 'phone-simulator',
          title: 'Phone Call Simulator',
          description: 'Handle incoming calls from patients, insurance reps, and pharmacies.',
          icon: Phone,
          completed: readiness.practiceScenarios > 0,
          action: () => navigate('/practice/phone-simulator'),
        },
        {
          id: 'day-in-the-life',
          title: 'Day in the Life',
          description: 'Experience a full shift at different practice settings with dynamic scenarios.',
          icon: Clock,
          completed: readiness.practiceScenarios > 1,
          action: () => navigate('/practice/day-in-the-life'),
        },
        {
          id: 'insurance-hotline',
          title: 'Insurance Verification Hotline',
          description: 'Call insurance companies, ask the right questions, and fill out verification forms.',
          icon: HeadphonesIcon,
          completed: readiness.practiceScenarios > 2,
          action: () => navigate('/practice/insurance-hotline'),
        },
      ],
    },
    {
      number: 3,
      title: 'Check Your Knowledge',
      subtitle: 'Test your understanding across all topics',
      color: 'emerald',
      progress: readiness.proveReady ? '1/1' : '0/1',
      aiPowered: true,
      items: [
        {
          id: 'readiness-assessment',
          title: 'Skills Review',
          description: 'Review what you\'ve learned across every topic area.',
          icon: ClipboardCheck,
          completed: readiness.proveReady,
          action: () => navigate('/practice/readiness'),
        },
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; lightBg: string; border: string; fill: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200', fill: 'bg-blue-500' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-200', fill: 'bg-purple-500' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50', border: 'border-emerald-200', fill: 'bg-emerald-500' },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl shadow-apple-sm mb-6">
          <Briefcase className="w-9 h-9 text-blue-600" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Practice & Skills</h1>
        <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Build skills, practice real scenarios, and check your understanding.
        </p>
      </div>

      {/* Overall Readiness */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Overall Progress</h3>
              <p className="text-sm text-gray-500">Complete activities across all stages to reach 100%</p>
            </div>
          </div>
          <span className="text-2xl font-semibold text-gray-900">{readiness.overall}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${readiness.overall}%` }}
          />
        </div>
        {/* Stage progress dots */}
        <div className="flex items-center justify-between mt-4">
          {stages.map((stage) => {
            const colors = colorMap[stage.color];
            return (
              <div key={stage.number} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${colors.bg} text-white text-xs font-bold flex items-center justify-center`}>
                  {stage.number}
                </div>
                <span className="text-xs text-gray-500 hidden sm:inline">{stage.title}</span>
                <span className={`text-xs font-medium ${colors.text}`}>{stage.progress}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-8">
        {stages.map((stage) => {
          const colors = colorMap[stage.color];
          return (
            <div key={stage.number}>
              {/* Stage Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-xl ${colors.bg} text-white text-sm font-bold flex items-center justify-center`}>
                  {stage.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium text-gray-900">{stage.title}</h2>
                    {stage.aiPowered && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                        <Sparkles className="w-3 h-3" />
                        AI-Powered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{stage.subtitle}</p>
                </div>
                <span className={`text-sm font-medium ${colors.text}`}>{stage.progress}</span>
              </div>

              {/* Stage Items */}
              <div className="grid gap-3">
                {stage.items.map((item) => {
                  const Icon = item.icon;
                  const isComing = 'coming' in item && item.coming;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl shadow-apple-sm border border-gray-200/50 p-5 transition-all duration-300 ${
                        isComing ? 'opacity-70' : 'hover-lift'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-11 h-11 ${colors.lightBg} rounded-xl flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            {'completed' in item && item.completed && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                          {'score' in item && item.score && (
                            <p className="text-xs text-gray-400 mt-1">Last score: {item.score}</p>
                          )}
                        </div>
                        {'action' in item && item.action ? (
                          <button
                            onClick={item.action}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                              'completed' in item && item.completed
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : `${colors.bg} text-white hover:opacity-90 shadow-apple-sm`
                            }`}
                          >
                            {'completed' in item && item.completed ? 'Replay' : 'Start'}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-gray-400 rounded-xl text-xs font-medium">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>
          Complete activities across all stages to build your progress score.
          <br />
          AI-powered experiences use Claude to simulate real workplace interactions.
        </p>
      </div>
    </div>
  );
}
