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
        <div className="bg-white rounded-2xl shadow-apple overflow-hidden">
          <div className="bg-gray-900 p-8 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-semibold tracking-tight">Certificate of Completion</h1>
          </div>

          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">This certifies that</p>
            <p className="text-2xl font-medium text-gray-900 mb-2">Healthcare Professional</p>
            <p className="text-gray-500 mb-6">has successfully completed</p>

            <div className="bg-blue-50/50 rounded-2xl p-6 mb-6 border border-blue-100">
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Medical Law & Ethics Foundations
              </h2>
              <p className="text-blue-600">Interactive Learning Experiences</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="font-medium text-gray-900">Simulation</p>
                <p className="text-gray-500">{progress.simulationScore}/{progress.simulationTotal}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="font-medium text-gray-900">Spot Violation</p>
                <p className="text-gray-500">{progress.spotViolationScore}/{progress.spotViolationTotal}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="font-medium text-gray-900">Risk Meter</p>
                <p className="text-gray-500">{progress.riskMeterScore}/{progress.riskMeterTotal}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Completed on {new Date(progress.completedAt || '').toLocaleDateString()}
            </p>

            <button
              onClick={() => setShowCertificate(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-apple-sm"
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
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl shadow-apple-sm mb-6">
          <Gamepad2 className="w-9 h-9 text-blue-600" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Interactive Learning</h1>
        <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Put your knowledge to the test with hands-on experiences. Practice making decisions, spotting problems, and assessing risks.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Your Progress</h3>
              <p className="text-sm text-gray-500">
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
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    exp.completed ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  title={exp.title}
                />
              ))}
            </div>

            {progress.allCompleted && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all duration-300"
              >
                <Award className="w-4 h-4" />
                View Certificate
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(completedCount / experiences.length) * 100}%` }}
          />
        </div>
      </div>

      {/* All Complete Banner */}
      {progress.allCompleted && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Congratulations!</h3>
              <p className="text-gray-500">
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
              className={`bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden hover-lift transition-all duration-300 ${
                experience.locked ? 'opacity-60' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">{experience.title}</h3>
                        {experience.required && (
                          <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                            Required
                          </span>
                        )}
                        {experience.completed && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-500 mt-1">{experience.description}</p>
                      {experience.score && (
                        <p className="text-sm text-gray-400 mt-2">
                          Last score: {experience.score}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveExperience(experience.id as ActiveExperience)}
                    disabled={experience.locked}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition-all duration-300 ${
                      experience.locked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : experience.completed
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-apple-sm'
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
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-10 text-center text-sm text-gray-400">
        <p>
          Complete "Your First Day" with 70% or higher to pass the Foundations module.
          <br />
          Other experiences are for practice and reinforcement.
        </p>
        {(progress.simulationCompleted || progress.spotViolationCompleted || progress.riskMeterCompleted) && (
          <button
            onClick={handleResetProgress}
            className="mt-4 text-gray-400 hover:text-gray-600 underline transition-colors duration-300"
          >
            Reset all progress
          </button>
        )}
      </div>
    </div>
  );
}
