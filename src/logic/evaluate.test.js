import { describe, it, expect } from 'vitest'
import { getRequiredCredits, getQualExams, evaluate } from './evaluate'

// ── 테스트용 픽스처 ──────────────────────────────────────
const theologyMajor = {
  id: 'theology_thm',
  creditRules: [
    { admissionYearFrom: 2020, admissionYearTo: 9999, totalCredits: 24 },
    { admissionYearFrom: 2016, admissionYearTo: 2019, totalCredits: 24 },
  ],
}

const theologyPhDMajor = {
  id: 'theology_phd',
  isTheologyDoctoral: true,
  extraQualExams: ['전공언어', '제2외국어'],
  creditRules: [{ admissionYearFrom: 2020, admissionYearTo: 9999, totalCredits: 36 }],
}

const masterProgram = {
  id: 'master',
  minSemesters: 4,
  maxSemesters: 12,
  thesisOptions: ['논문'],
  thesisAdvisoryMin: 5,
  baseQualExams: ['영어', '전공'],
  qualExamCounts: { '전공': 1 },
}

const doctorProgram = {
  id: 'doctor',
  minSemesters: 6,
  maxSemesters: 20,
  thesisOptions: ['논문'],
  thesisAdvisoryMin: 10,
  baseQualExams: ['영어', '전공'],
  qualExamCounts: { '전공': 1 },
  requiresPublication: true,
  requiresProposal: true,
}

const passingMasterInput = {
  admissionYear: 2022,
  registeredSemesters: 4,
  earnedCredits: 24,
  gpa: 3.5,
  qualExam_english: true,
  qualExam_major: true,
  thesisOption: '논문',
  thesisAdvisoryCount: 5,
  thesisPublicDefense: true,
  thesisSimilarityOk: true,
  academicConference: 'attended',
  researchEthicsEducation: true,
  researchEthicsCourse: true,
}

const passingDoctorInput = {
  admissionYear: 2020,
  registeredSemesters: 6,
  earnedCredits: 36,
  gpa: 3.5,
  qualExam_english: true,
  qualExam_major: true,
  qualExam_specialLanguage: true,
  qualExam_secondLanguage: true,
  thesisOption: '논문',
  thesisAdvisoryCount: 10,
  thesisPublicDefense: true,
  thesisSimilarityOk: true,
  thesisPublication: true,
  thesisProposal: true,
  academicConference: 'presented',
  researchEthicsEducation: true,
  researchEthicsCourse: true,
}

// ── getRequiredCredits ────────────────────────────────────
describe('getRequiredCredits', () => {
  it('입학년도 2022 → 24학점 반환', () => {
    expect(getRequiredCredits(theologyMajor, 2022)).toBe(24)
  })
  it('입학년도 2018 → 24학점 반환', () => {
    expect(getRequiredCredits(theologyMajor, 2018)).toBe(24)
  })
  it('범위 밖 입학년도 → null 반환', () => {
    const major = { creditRules: [{ admissionYearFrom: 2020, admissionYearTo: 2024, totalCredits: 24 }] }
    expect(getRequiredCredits(major, 2019)).toBeNull()
  })
})

// ── getQualExams ──────────────────────────────────────────
describe('getQualExams', () => {
  it('일반 석사 → [영어, 전공]', () => {
    expect(getQualExams(masterProgram, theologyMajor)).toEqual(['영어', '전공'])
  })
  it('박사 신학계열 → [영어, 전공, 전공언어, 제2외국어]', () => {
    expect(getQualExams(doctorProgram, theologyPhDMajor)).toEqual(['영어', '전공', '전공언어', '제2외국어'])
  })
})

// ── evaluate — 석사 합격 ──────────────────────────────────
describe('evaluate: 석사 합격 케이스', () => {
  it('모든 요건 충족 시 passed=true', () => {
    const result = evaluate(passingMasterInput, masterProgram, theologyMajor)
    expect(result.passed).toBe(true)
  })
  it('결과 items에 semesters 항목 포함', () => {
    const result = evaluate(passingMasterInput, masterProgram, theologyMajor)
    expect(result.items.find(i => i.id === 'semesters')).toBeDefined()
  })
})

// ── evaluate — 석사 불합격 케이스 ────────────────────────
describe('evaluate: 석사 불합격 케이스', () => {
  it('등록학기 부족 → passed=false, semesters.met=false', () => {
    const input = { ...passingMasterInput, registeredSemesters: 3 }
    const result = evaluate(input, masterProgram, theologyMajor)
    expect(result.passed).toBe(false)
    expect(result.items.find(i => i.id === 'semesters').met).toBe(false)
  })
  it('이수학점 부족 → passed=false', () => {
    const input = { ...passingMasterInput, earnedCredits: 20 }
    const result = evaluate(input, masterProgram, theologyMajor)
    expect(result.passed).toBe(false)
    expect(result.items.find(i => i.id === 'credits').met).toBe(false)
  })
  it('평균평점 2.9 → passed=false', () => {
    const result = evaluate({ ...passingMasterInput, gpa: 2.9 }, masterProgram, theologyMajor)
    expect(result.passed).toBe(false)
  })
  it('영어시험 미합격 → passed=false', () => {
    const result = evaluate({ ...passingMasterInput, qualExam_english: false }, masterProgram, theologyMajor)
    expect(result.passed).toBe(false)
  })
  it('재학연한 초과 → passed=false', () => {
    const result = evaluate({ ...passingMasterInput, registeredSemesters: 13 }, masterProgram, theologyMajor)
    expect(result.passed).toBe(false)
    expect(result.items.find(i => i.id === 'maxSemesters').met).toBe(false)
  })
  it('논문 지도 4회(5회 미만) → passed=false', () => {
    const result = evaluate({ ...passingMasterInput, thesisAdvisoryCount: 4 }, masterProgram, theologyMajor)
    expect(result.passed).toBe(false)
  })
  it('학술대회 none → passed=false', () => {
    const result = evaluate({ ...passingMasterInput, academicConference: 'none' }, masterProgram, theologyMajor)
    expect(result.passed).toBe(false)
  })
})

// ── evaluate — 박사 신학계열 ──────────────────────────────
describe('evaluate: 박사 신학계열', () => {
  it('모든 요건 충족 시 passed=true', () => {
    const result = evaluate(passingDoctorInput, doctorProgram, theologyPhDMajor)
    expect(result.passed).toBe(true)
  })
  it('전공언어 미합격 → passed=false', () => {
    const input = { ...passingDoctorInput, qualExam_specialLanguage: false }
    const result = evaluate(input, doctorProgram, theologyPhDMajor)
    expect(result.passed).toBe(false)
  })
  it('논문 게재 없음 → passed=false', () => {
    const result = evaluate({ ...passingDoctorInput, thesisPublication: false }, doctorProgram, theologyPhDMajor)
    expect(result.passed).toBe(false)
  })
  it('프로포절 미통과 → passed=false', () => {
    const result = evaluate({ ...passingDoctorInput, thesisProposal: false }, doctorProgram, theologyPhDMajor)
    expect(result.passed).toBe(false)
  })
})

// ── evaluate — 논문대체 옵션 ─────────────────────────────
describe('evaluate: 논문대체', () => {
  const altProgram = { ...masterProgram, thesisOptions: ['논문', '논문대체'] }
  it('논문대체 선택 시 논문관련 항목(지도횟수 등) 없음', () => {
    const input = { ...passingMasterInput, thesisOption: '논문대체' }
    const result = evaluate(input, altProgram, theologyMajor)
    expect(result.items.find(i => i.id === 'thesisAdvisory')).toBeUndefined()
  })
})

// ── getRequiredCredits — nonThesisCredits ─────────────────
describe('getRequiredCredits: 논문대체 학점', () => {
  const counselingMajor = {
    id: 'counseling_master',
    creditRules: [{ admissionYearFrom: 2020, admissionYearTo: 9999, totalCredits: 24, nonThesisCredits: 30 }],
  }
  it('논문 선택 → 24학점', () => {
    expect(getRequiredCredits(counselingMajor, 2022, '논문')).toBe(24)
  })
  it('논문대체 선택 → 30학점', () => {
    expect(getRequiredCredits(counselingMajor, 2022, '논문대체')).toBe(30)
  })
  it('thesisOption 미전달 → 24학점(기본값)', () => {
    expect(getRequiredCredits(counselingMajor, 2022)).toBe(24)
  })
})

// ── evaluate — requiredCourses ────────────────────────────
describe('evaluate: 필수과목', () => {
  const practiceProgram = {
    ...masterProgram,
    thesisOptions: ['논문', '논문대체'],
    requiredCourses: [
      { id: 'practicum_1', label: '실습 I 이수', detail: '필수' },
    ],
  }
  it('필수과목 이수 완료 → passed=true', () => {
    const input = { ...passingMasterInput, requiredCourse_practicum_1: true }
    const result = evaluate(input, practiceProgram, theologyMajor)
    expect(result.passed).toBe(true)
  })
  it('필수과목 미이수 → passed=false', () => {
    const input = { ...passingMasterInput, requiredCourse_practicum_1: false }
    const result = evaluate(input, practiceProgram, theologyMajor)
    expect(result.passed).toBe(false)
    expect(result.items.find(i => i.id === 'requiredCourse_practicum_1').met).toBe(false)
  })
})
