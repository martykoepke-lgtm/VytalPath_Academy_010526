import { useState, useEffect } from 'react';
import {
  Gamepad2,
  Users,
  Eye,
  Gauge,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Lock,
  Award
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

export function InteractiveHub() {
  const [activeExperience, setActiveExperience] = useState<ActiveExperience>('hub');
  const [progress, setProgress] = useState<ExperienceProgress>(defaultProgress);
  const [showCertificate, setShowCertificate] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {
        // Invalid data, use default
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress: ExperienceProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const handleSimulationComplete = (score: number, total: number) => {
    const passed = (score / total) >= 0.7;
    const newProgress = {
      ...progress,
      simulationScore: score,
      simulationTotal: total,
      simulationCompleted: passed,
    };
    newProgress.allCompleted = newProgress.simulationCompleted &&
                               newProgress.spotViolationCompleted &&
                               newProgress.riskMeterCompleted;
    if (newProgress.allCompleted && !progress.allCompleted) {
      newProgress.completedAt = new Date().toISOString();
    }
    saveProgress(newProgress);
    setActiveExperience('hub');
  };

  const handleSpotViolationComplete = (score: number, total: number) => {
    const newProgress = {
      ...progress,
      spotViolationScore: score,
      spotViolationTotal: total,
      spotViolationCompleted: true,
    };
    newProgress.allCompleted = newProgress.simulationCompleted &&
                               newProgress.spotViolationCompleted &&
                               newProgress.riskMeterCompleted;
    if (newProgress.allCompleted && !progress.allCompleted) {
      newProgress.completedAt = new Date().toISOString();
    }
    saveProgress(newProgress);
    setActiveExperience('hub');
  };

  const handleRiskMeterComplete = (score: number, total: number) => {
    const newProgress = {
      ...progress,
      riskMeterScore: score,
      riskMeterTotal: total,
      riskMeterCompleted: true,
    };
    newProgress.allCompleted = newProgress.simulationCompleted &&
                               newProgress.spotViolationCompleted &&
                               newProgress.riskMeterCompleted;
    if (newProgress.allCompleted && !progress.allCompleted) {
      newProgress.completedAt = new Date().toISOString();
    }
    saveProgress(newProgress);
    setActiveExperience('hub');
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      saveProgress(defaultProgress);
      setShowCertificate(false);
    }
  };

  // Render active experience
  if (activeExperience === 'simulation') {
    return (
      <SimulationExperience
        onComplete={handleSimulationComplete}
        onBack={() => setActiveExperience('hub')}
      />
    );
  }

  if (activeExperience === 'spot-violation') {
    return (
      <SpotTheViolation
        onComplete={handleSpotViolationComplete}
        onBack={() => setActiveExperience('hub')}
      />
    );
  }

  if (activeExperience === 'risk-meter') {
    return (
      <RiskMeter
        onComplete={handleRiskMeterComplete}
        onBack={() => setActiveExperience('hub')}
      />
    );
  }

  // Certificate Modal
  if (showCertificate && progress.allCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-8 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Certificate of Completion</h1>
          </div>

          <div className="p-8 text-center">
            <p className="text-gray-600 mb-2">This certifies that</p>
            <p className="text-2xl font-semibold text-gray-900 mb-2">Healthcare Professional</p>
            <p className="text-gray-600 mb-6">has successfully completed</p>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Medical Law & Ethics Foundations
              </h2>
              <p className="text-blue-700">Interactive Learning Experiences</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">Simulation</p>
                <p className="text-gray-600">{progress.simulationScore}/{progress.simulationTotal}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">Spot Violation</p>
                <p className="text-gray-600">{progress.spotViolationScore}/{progress.spotViolationTotal}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">Risk Meter</p>
                <p className="text-gray-600">{progress.riskMeterScore}/{progress.riskMeterTotal}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Completed on {new Date(progress.completedAt || '').toLocaleDateString()}
            </p>

            <button
              onClick={() => setShowCertificate(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hub View
  const experiences = [
    {
      id: 'simulation',
      title: 'Your First Day',
      description: 'Navigate real workplace scenarios through choose-your-path decision making.',
      icon: Users,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      completed: progress.simulationCompleted,
      score: progress.simulationTotal > 0 ? `${progress.simulationScore}/${progress.simulationTotal}` : null,
      required: true,
      locked: false,
    },
    {
      id: 'spot-violation',
      title: 'Spot the Violation',
      description: 'Find privacy and compliance issues hiding in everyday workplace scenes.',
      icon: Eye,
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      completed: progress.spotViolationCompleted,
      score: progress.spotViolationTotal > 0 ? `${progress.spotViolationScore}/${progress.spotViolationTotal}` : null,
      required: false,
      locked: false,
    },
    {
      id: 'risk-meter',
      title: 'Risk Meter',
      description: 'Categorize scenarios by risk level - from safe practices to clear violations.',
      icon: Gauge,
      color: 'amber',
      bgGradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      completed: progress.riskMeterCompleted,
      score: progress.riskMeterTotal > 0 ? `${progress.riskMeterScore}/${progress.riskMeterTotal}` : null,
      required: false,
      locked: false,
    },
  ];

  const completedCount = experiences.filter(e => e.completed).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
          <Gamepad2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Interactive Learning</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Put your knowledge to the test with hands-on experiences. Practice making decisions, spotting problems, and assessing risks.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Your Progress</h3>
              <p className="text-sm text-gray-600">
                {completedCount} of {experiences.length} experiences completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress circles */}
            <div className="flex gap-2">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className={`w-3 h-3 rounded-full ${
                    exp.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  title={exp.title}
                />
              ))}
            </div>

            {progress.allCompleted && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
              >
                <Award className="w-4 h-4" />
                View Certificate
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
            style={{ width: `${(completedCount / experiences.length) * 100}%` }}
          />
        </div>
      </div>

      {/* All Complete Banner */}
      {progress.allCompleted && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Congratulations!</h3>
              <p className="text-green-700">
                You've completed all interactive experiences. You've built a strong foundation in healthcare compliance!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Experience Cards */}
      <div className="grid gap-6">
        {experiences.map((experience) => {
          const Icon = experience.icon;

          return (
            <div
              key={experience.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md ${
                experience.locked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-stretch">
                {/* Color bar */}
                <div className={`w-2 bg-gradient-to-b ${experience.bgGradient}`} />

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${experience.lightBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${experience.color}-600`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">{experience.title}</h3>
                          {experience.required && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                              Required
                            </span>
                          )}
                          {experience.completed && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{experience.description}</p>
                        {experience.score && (
                          <p className="text-sm text-gray-500 mt-2">
                            Last score: {experience.score}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveExperience(experience.id as ActiveExperience)}
                      disabled={experience.locked}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        experience.locked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : experience.completed
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : `bg-${experience.color}-600 text-white hover:bg-${experience.color}-700`
                      }`}
                    >
                      {experience.locked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Locked
                        </>
                      ) : experience.completed ? (
                        <>
                          Replay
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Start
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Complete "Your First Day" with 70% or higher to pass the Foundations module.
          <br />
          Other experiences are for practice and reinforcement.
        </p>
        {(progress.simulationCompleted || progress.spotViolationCompleted || progress.riskMeterCompleted) && (
          <button
            onClick={handleResetProgress}
            className="mt-4 text-gray-400 hover:text-gray-600 underline"
          >
            Reset all progress
          </button>
        )}
      </div>
    </div>
  );
}
