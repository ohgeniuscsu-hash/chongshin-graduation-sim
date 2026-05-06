import { useState } from 'react'
import ProgressBar from './components/ProgressBar'
import StepSelector from './components/StepSelector'
import rules from './data/rules.json'

export default function App() {
  const [step, setStep] = useState(1)
  const [selection, setSelection] = useState({})

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">총신대학교 대학원</h1>
        <p className="text-center text-gray-500 mb-6">졸업사정 모의 시뮬레이션</p>
        <ProgressBar currentStep={step} />
        <div className="mt-6">
          {step === 1 && (
            <StepSelector
              rules={rules}
              initialSelection={selection}
              onComplete={sel => { setSelection(sel); setStep(2) }}
            />
          )}
          {step === 2 && <div className="bg-white rounded-xl shadow p-6 text-gray-500">Step 2 (준비 중)</div>}
        </div>
      </div>
    </div>
  )
}
