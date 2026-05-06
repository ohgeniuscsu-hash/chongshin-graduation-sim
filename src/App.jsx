import ProgressBar from './components/ProgressBar'
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">총신대학교 대학원</h1>
        <p className="text-center text-gray-500 mb-6">졸업사정 모의 시뮬레이션</p>
        <ProgressBar currentStep={2} />
      </div>
    </div>
  )
}
