// SVG radial gauge for readiness score

interface ReadinessGaugeProps {
  score: number;
  size?: number;
}

export function ReadinessGauge({ score, size = 140 }: ReadinessGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  // Color based on score
  const getColor = (s: number) => {
    if (s >= 70) return { stroke: '#16a34a', text: 'text-green-600' }; // green
    if (s >= 40) return { stroke: '#d97706', text: 'text-amber-600' }; // amber
    return { stroke: '#dc2626', text: 'text-red-600' }; // red
  };

  const { stroke, text } = getColor(progress);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${text}`}>{progress}%</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Ready</span>
      </div>
    </div>
  );
}
