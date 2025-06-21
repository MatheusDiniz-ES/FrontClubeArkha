// components/ProgressBar.tsx
interface ProgressBarProps {
  current: number
  goal: number
}

export const ProgressBar = ({ current, goal }: ProgressBarProps) => {
  const percentage = Math.min((current / goal) * 100, 100)

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="h-4 rounded-full bg-orange-500 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}