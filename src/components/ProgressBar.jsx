const STEP_LABELS = ['기본 정보', '항목 입력', '결과 확인']

export default function ProgressBar({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-6">
      {STEP_LABELS.map((label, index) => {
        const stepNum = index + 1
        const isCompleted = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isCurrent ? 'bg-blue-600 text-white' : ''}
                ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-400' : ''}
              `}>
                {isCompleted ? '✓' : stepNum}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap
                ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-400'}
              `}>
                {label}
              </span>
            </div>
            {index < STEP_LABELS.length - 1 && (
              <div className={`w-16 h-0.5 mb-4 mx-1
                ${stepNum < currentStep ? 'bg-green-500' : 'bg-gray-200'}
              `} />
            )}
          </div>
        )
      })}
    </div>
  )
}
