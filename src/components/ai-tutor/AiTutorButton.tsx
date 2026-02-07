import { MessageCircle } from 'lucide-react';
import type { AiTutorTheme } from '../../types/ai-tutor';

interface AiTutorButtonProps {
  onClick: () => void;
  isVisible: boolean;
  theme: AiTutorTheme;
}

export default function AiTutorButton({ onClick, isVisible, theme }: AiTutorButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 ${theme.buttonBg} ${theme.buttonHoverBg} text-white p-4 rounded-2xl shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-105 active:scale-95`}
      title="Ask AI Study Assistant"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
