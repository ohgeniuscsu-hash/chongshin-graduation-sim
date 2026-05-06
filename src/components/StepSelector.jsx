import { useState } from 'react'

export default function StepSelector({ rules, initialSelection, onComplete }) {
  const [sel, setSel] = useState(initialSelection || {
    schoolId: '', programId: '', majorId: '', admissionYear: ''
  })
  const [error, setError] = useState('')

  const school = rules.schools.find(s => s.id === sel.schoolId)
  const program = school?.programs.find(p => p.id === sel.programId)

  function handleSubmit(e) {
    e.preventDefault()
    if (!sel.schoolId || !sel.programId || !sel.majorId || !sel.admissionYear) {
      setError('모든 항목을 선택/입력해주세요.')
      return
    }
    const year = parseInt(sel.admissionYear)
    if (isNaN(year) || year < 2000 || year > new Date().getFullYear() + 1) {
      setError('올바른 입학년도를 입력해주세요. (예: 2022)')
      return
    }
    setError('')
    onComplete({ ...sel, admissionYear: String(year) })
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-base font-semibold text-gray-700 mb-4">Step 1. 기본 정보 입력</h3>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대학원</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={sel.schoolId}
            onChange={e => setSel({ schoolId: e.target.value, programId: '', majorId: '', admissionYear: sel.admissionYear })}
          >
            <option value="">선택하세요</option>
            {rules.schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {school && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">과정</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sel.programId}
              onChange={e => setSel({ ...sel, programId: e.target.value, majorId: '' })}
            >
              <option value="">선택하세요</option>
              {school.programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {program && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전공</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sel.majorId}
              onChange={e => setSel({ ...sel, majorId: e.target.value })}
            >
              <option value="">선택하세요</option>
              {program.majors.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">입학년도</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="예: 2022"
            min="2000"
            max="2030"
            value={sel.admissionYear}
            onChange={e => setSel({ ...sel, admissionYear: e.target.value })}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          다음 단계로 →
        </button>
      </form>
    </div>
  )
}
