import React from 'react';



export const HalfCircleProgress: React.FC<{ level: 'Facil' | 'Medio' | 'Dificil' }> = ({ level }) => {
    const difficultyLevels = {
        Facil: 0.33,
        Medio: 0.66,
        Dificil: 1,
      };
      
      const colors = {
        Facil: '#32cd32',
        Medio: '#ffa500',
        Dificil: '#ff4828',
      };
  const radius = 20; // Radius of the circle
  const strokeWidth = 5; // Width of the stroke
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const progress = difficultyLevels[level] * circumference; // Progress length
  const offset = circumference - progress; // Offset for the stroke-dasharray

  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      className="half-circle-progress"
    >
      <circle
        cx="25"
        cy="25"
        r={radius}
        fill="none"
        stroke="#d6d6d6"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={0}
      />
      <circle
        cx="25"
        cy="25"
        r={radius}
        fill="none"
        stroke={colors[level]}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 25 25)"
      />
    </svg>
  );
};