import { useState, useRef, useEffect } from 'react';
import { Bot, Stethoscope, ClipboardCheck, Users, FileText, ChevronDown } from 'lucide-react';
import type { AgentMode } from '../../types/agent';

interface AgentModeIndicatorProps {
  activeAgent: AgentMode;
  onModeChange: (mode: AgentMode) => void;
}

const agentModeConfig: Record<AgentMode, { label: string; color: string; bg: string; icon: typeof Bot }> = {
  tutor: { label: 'Tutor', color: 'text-blue-700', bg: 'bg-blue-100', icon: Bot },
  'ehr-coach': { label: 'EHR Coach', color: 'text-teal-700', bg: 'bg-teal-100', icon: Stethoscope },
  assessment: { label: 'Practice', color: 'text-green-700', bg: 'bg-green-100', icon: ClipboardCheck },
  'patient-sim': { label: 'Patient Sim', color: 'text-purple-700', bg: 'bg-purple-100', icon: Users },
  'sop-scenario': { label: 'Scenarios', color: 'text-amber-700', bg: 'bg-amber-100', icon: FileText },
};

export default function AgentModeIndicator({ activeAgent, onModeChange }: AgentModeIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const config = agentModeConfig[activeAgent];
  const Icon = config.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} hover:opacity-80 transition-opacity`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
          {(Object.entries(agentModeConfig) as [AgentMode, typeof config][]).map(([mode, cfg]) => {
            const ModeIcon = cfg.icon;
            return (
              <button
                key={mode}
                onClick={() => { onModeChange(mode); setIsOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  mode === activeAgent ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <ModeIcon className={`w-4 h-4 ${cfg.color}`} />
                <span className={mode === activeAgent ? cfg.color : 'text-gray-700'}>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
