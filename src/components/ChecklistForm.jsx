import { useState } from 'react'
import { getRequiredCredits, getQualExams } from '../logic/evaluate'

function YesNoField({ fieldKey, label, detail, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-0.5">{label}</label>
      {detail && <p className="text-xs text-gray-400 mb-1">{detail}</p>}
      <div className="flex gap-2">
        <button type="button"
          onClick={() => onChange(fieldKey, true)}
          className={`px-4 py-1.5 rounded-lg text-sm border transition-colors
            ${value === true ? 'bg-green-100 border-green-500 text-green-700 font-medium' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
        >합격 / 완료</button>
        <button type="button"
          onClick={() => onChange(fieldKey, false)}
          className={`px-4 py-1.5 rounded-lg text-sm border transition-colors
            ${value === false ? 'bg-red-100 border-red-400 text-red-700 font-medium' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
        >미완료</button>
      </div>
    </div>
  )
}

export default function ChecklistForm({ program, major, admissionYear, onSubmit, onBack }) {
  const requiredCredits = getRequiredCredits(major, admissionYear)
  const qualExams = getQualExams(program, major)
  const isDoctor = program.id === 'doctor'
  const thesisOptions = program.thesisOptions || ['논문']

  const [data, setData] = useState({
    registeredSemesters: '',
    earnedCredits: '',
    gpa: '',
    qualExam_english: null,
    qualExam_major: null,
    qualExam_teaching: null,
    qualExam_specialLanguage: null,
    qualExam_secondLanguage: null,
    thesisOption: thesisOptions.length === 1 ? thesisOptions[0] : '',
    thesisAdvisoryCount: '',
    thesisPublicDefense: null,
    thesisSimilarityOk: null,
    thesisPublication: null,
    thesisProposal: null,
    academicConference: '',
    researchEthicsEducation: null,
    researchEthicsCourse: null,
  })

  const isThesis = data.thesisOption === '논문'

  function set(key, value) {
    setData(d => ({ ...d, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...data,
      admissionYear,
      registeredSemesters: Number(data.registeredSemesters),
      earnedCredits: Number(data.earnedCredits),
      gpa: Number(data.gpa),
      thesisAdvisoryCount: Number(data.thesisAdvisoryCount),
    })
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-base font-semibold text-gray-700 mb-4">Step 2. 졸업요건 입력</h3>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            등록학기 수 <span className="text-gray-400 font-normal text-xs">(최소 {program.minSemesters}학기)</span>
          </label>
          <input type="number" min="1" max="30"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={`${program.minSemesters} 이상`}
            value={data.registeredSemesters}
            onChange={e => set('registeredSemesters', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이수학점{requiredCredits ? ` (최소 ${requiredCredits}학점)` : ''}
          </label>
          <input type="number" min="0" max="120"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={requiredCredits ? `${requiredCredits} 이상` : '학점 입력'}
            value={data.earnedCredits}
            onChange={e => set('earnedCredits', e.target.value)}
          />
          {!requiredCredits && (
            <p className="text-xs text-yellow-600 mt-1">⚠ 입학년도에 해당하는 이수학점 기준을 찾을 수 없습니다. 담당자에게 문의하세요.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            평균평점 <span className="text-gray-400 font-normal text-xs">(3.0 이상)</span>
          </label>
          <input type="number" step="0.01" min="0" max="4.5"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="예: 3.50"
            value={data.gpa}
            onChange={e => set('gpa', e.target.value)}
          />
        </div>

        <hr className="border-gray-100" />

        {qualExams.includes('영어') && (
          <YesNoField fieldKey="qualExam_english" label="자격시험 — 영어"
            detail="TOEIC 650 / TOEFL IBT 73 / NEW TEPS 281 이상 등으로 면제 가능"
            value={data.qualExam_english} onChange={set} />
        )}
        {qualExams.includes('전공') && (
          <YesNoField fieldKey="qualExam_major"
            label={`자격시험 — 전공 (${program.qualExamCounts?.['전공'] || 1}과목)`}
            value={data.qualExam_major} onChange={set} />
        )}
        {qualExams.includes('교직') && (
          <YesNoField fieldKey="qualExam_teaching" label="자격시험 — 교직"
            value={data.qualExam_teaching} onChange={set} />
        )}
        {qualExams.includes('전공언어') && (
          <YesNoField fieldKey="qualExam_specialLanguage" label="자격시험 — 전공언어"
            detail="히브리어(구약) / 헬라어(신약·조직·역사·실천·선교) · 면제 가능"
            value={data.qualExam_specialLanguage} onChange={set} />
        )}
        {qualExams.includes('제2외국어') && (
          <YesNoField fieldKey="qualExam_secondLanguage" label="자격시험 — 제2외국어"
            detail="화란어·독일어·불어·일어·중국어 중 택1 · 면제 가능"
            value={data.qualExam_secondLanguage} onChange={set} />
        )}

        <hr className="border-gray-100" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">논문 이수 방식</label>
          {thesisOptions.length === 1 ? (
            <p className="text-sm bg-gray-50 rounded-lg px-3 py-2 text-gray-600">{thesisOptions[0]} <span className="text-gray-400">(필수)</span></p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {thesisOptions.map(opt => (
                <button type="button" key={opt}
                  onClick={() => set('thesisOption', opt)}
                  className={`px-4 py-1.5 rounded-lg text-sm border transition-colors
                    ${data.thesisOption === opt ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                >{opt}</button>
              ))}
            </div>
          )}
        </div>

        {isThesis && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                논문 지도 횟수 <span className="text-gray-400 font-normal text-xs">(최소 {program.thesisAdvisoryMin}회)</span>
              </label>
              <input type="number" min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.thesisAdvisoryCount}
                onChange={e => set('thesisAdvisoryCount', e.target.value)}
              />
            </div>
            <YesNoField fieldKey="thesisPublicDefense" label="논문 공개발표 완료"
              detail="지도교수 참관 하에 관련 전공 학생들에게 공개 발표"
              value={data.thesisPublicDefense} onChange={set} />
            <YesNoField fieldKey="thesisSimilarityOk" label="논문 유사도 검사 통과"
              detail="유사도 10% 미만 (가제본 제출 시 결과 확인)"
              value={data.thesisSimilarityOk} onChange={set} />
          </>
        )}

        {isDoctor && program.requiresProposal && (
          <YesNoField fieldKey="thesisProposal" label="논문 제안서(프로포절) 심사 통과"
            detail="논문프로포절 과목 수강신청 필수 · 심사위원회 심사 통과"
            value={data.thesisProposal} onChange={set} />
        )}
        {isDoctor && program.requiresPublication && isThesis && (
          <YesNoField fieldKey="thesisPublication" label="학술지 논문 게재"
            detail="한국연구재단 등재(후보)지 1편 이상"
            value={data.thesisPublication} onChange={set} />
        )}

        <hr className="border-gray-100" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">학술대회</label>
          <p className="text-xs text-gray-400 mb-1">전국 규모 이상 발표 1회 또는 참석 2회 이상</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'presented', label: '발표 1회 이상' },
              { value: 'attended',  label: '참석 2회 이상' },
              { value: 'none',      label: '미충족' },
            ].map(opt => (
              <button type="button" key={opt.value}
                onClick={() => set('academicConference', opt.value)}
                className={`px-4 py-1.5 rounded-lg text-sm border transition-colors
                  ${data.academicConference === opt.value ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        <YesNoField fieldKey="researchEthicsEducation" label="연구윤리교육 이수"
          detail="알파캠퍼스(alpha-campus.kr) 온라인 이수 후 이수증 제출"
          value={data.researchEthicsEducation} onChange={set} />

        <YesNoField fieldKey="researchEthicsCourse" label="연구윤리와 논문작성법 이수"
          detail="과목 이수 또는 면제 (0학점 P/F)"
          value={data.researchEthicsCourse} onChange={set} />

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >← 이전</button>
          <button type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >졸업 가능 여부 확인</button>
        </div>
      </form>
    </div>
  )
}
