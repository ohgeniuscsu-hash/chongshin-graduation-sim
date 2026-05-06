import { useState } from 'react'
import ProgressBar from './components/ProgressBar'
import StepSelector from './components/StepSelector'
import ChecklistForm from './components/ChecklistForm'
import ResultView from './components/ResultView'
import rules from './data/rules.json'
import { evaluate } from './logic/evaluate'

export default function App() {
  const [step, setStep] = useState(1)
  const [selection, setSelection] = useState({ schoolId: '', programId: '', majorId: '', admissionYear: '' })
  const [result, setResult] = useState(null)

  const school   = rules.schools.find(s => s.id === selection.schoolId)
  const program  = school?.programs.find(p => p.id === selection.programId)
  const major    = program?.majors.find(m => m.id === selection.majorId)

  function handleSelectionComplete(sel) {
    setSelection(sel)
    setStep(2)
  }

  function handleFormSubmit(formData) {
    const evalResult = evaluate(formData, program, major)
    setResult(evalResult)
    setStep(3)
  }

  function handleReset() {
    setStep(1)
    setSelection({ schoolId: '', programId: '', majorId: '', admissionYear: '' })
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">총신대학교 대학원</h1>
        <p className="text-center text-gray-500 mb-6">졸업사정 모의 시뮬레이션</p>
        <ProgressBar currentStep={step} />
        <div className="mt-6">
          {step === 1 && (
            <StepSelector rules={rules} initialSelection={selection} onComplete={handleSelectionComplete} />
          )}
          {step === 2 && program && major && (
            <ChecklistForm
              program={program}
              major={major}
              admissionYear={selection.admissionYear}
              onSubmit={handleFormSubmit}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && result && (
            <ResultView result={result} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  )
}
