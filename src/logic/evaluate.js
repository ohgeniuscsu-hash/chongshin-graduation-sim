export function getRequiredCredits(major, admissionYear) {
  const rule = major.creditRules.find(
    r => admissionYear >= r.admissionYearFrom && admissionYear <= r.admissionYearTo
  )
  return rule ? rule.totalCredits : null
}

export function getQualExams(program, major) {
  const exams = [...(program.baseQualExams || [])]
  if (major.extraQualExams) exams.push(...major.extraQualExams)
  return exams
}

export function evaluate(input, program, major) {
  const requiredCredits = getRequiredCredits(major, input.admissionYear)
  const qualExams = getQualExams(program, major)
  const isDoctor = program.id === 'doctor'
  const isThesis = input.thesisOption === '논문'
  const items = []

  items.push({
    id: 'semesters',
    label: '등록학기 수',
    met: input.registeredSemesters >= program.minSemesters,
    detail: `${program.minSemesters}학기 이상 필요 (입력: ${input.registeredSemesters}학기)`,
  })

  items.push({
    id: 'maxSemesters',
    label: '재학연한 이내',
    met: input.registeredSemesters <= program.maxSemesters,
    detail: `${program.maxSemesters}학기 이내 (석사 12학기, 박사 20학기)`,
  })

  if (requiredCredits !== null) {
    items.push({
      id: 'credits',
      label: '이수학점',
      met: input.earnedCredits >= requiredCredits,
      detail: `${requiredCredits}학점 이상 필요 (입력: ${input.earnedCredits}학점)`,
    })
  }

  items.push({
    id: 'gpa',
    label: '평균평점',
    met: input.gpa >= 3.0,
    detail: `3.0(B0) 이상 필요 (입력: ${input.gpa})`,
  })

  if (qualExams.includes('영어')) {
    items.push({
      id: 'qualExam_english',
      label: '자격시험 — 영어',
      met: input.qualExam_english === true,
      detail: 'TOEIC 650 / TOEFL IBT 73 이상 등으로 면제 가능',
    })
  }

  if (qualExams.includes('전공')) {
    const count = program.qualExamCounts?.['전공'] || 1
    items.push({
      id: 'qualExam_major',
      label: `자격시험 — 전공 (${count}과목)`,
      met: input.qualExam_major === true,
      detail: `전공 자격시험 ${count}과목 합격`,
    })
  }

  if (qualExams.includes('교직')) {
    items.push({
      id: 'qualExam_teaching',
      label: '자격시험 — 교직',
      met: input.qualExam_teaching === true,
      detail: '교직 자격시험 합격',
    })
  }

  if (qualExams.includes('전공언어')) {
    items.push({
      id: 'qualExam_specialLanguage',
      label: '자격시험 — 전공언어',
      met: input.qualExam_specialLanguage === true,
      detail: '히브리어(구약) / 헬라어(신약·조직·역사·실천·선교) 합격 또는 면제',
    })
  }

  if (qualExams.includes('제2외국어')) {
    items.push({
      id: 'qualExam_secondLanguage',
      label: '자격시험 — 제2외국어',
      met: input.qualExam_secondLanguage === true,
      detail: '화란어·독일어·불어·일어·중국어 중 택1 합격 또는 면제',
    })
  }

  items.push({
    id: 'thesis',
    label: '논문 / 논문대체 이수',
    met: Boolean(input.thesisOption),
    detail: (program.thesisOptions || ['논문']).join(', ') + ' 중 선택',
  })

  if (isThesis) {
    items.push({
      id: 'thesisAdvisory',
      label: '논문 지도 횟수',
      met: (input.thesisAdvisoryCount || 0) >= (program.thesisAdvisoryMin || 5),
      detail: `${program.thesisAdvisoryMin}회 이상 필요 (입력: ${input.thesisAdvisoryCount}회)`,
    })

    items.push({
      id: 'thesisDefense',
      label: '논문 공개발표',
      met: input.thesisPublicDefense === true,
      detail: '지도교수 참관 하에 공개 발표 완료',
    })

    items.push({
      id: 'thesisSimilarity',
      label: '논문 유사도 검사',
      met: input.thesisSimilarityOk === true,
      detail: '유사도 10% 미만',
    })
  }

  if (isDoctor && program.requiresProposal) {
    items.push({
      id: 'thesisProposal',
      label: '논문 제안서(프로포절) 통과',
      met: input.thesisProposal === true,
      detail: '논문 제안서 심사위원회 심사 통과',
    })
  }

  if (isDoctor && program.requiresPublication && isThesis) {
    items.push({
      id: 'thesisPublication',
      label: '학술지 논문 게재',
      met: input.thesisPublication === true,
      detail: '한국연구재단 등재(후보)지 1편 이상',
    })
  }

  items.push({
    id: 'academicConference',
    label: '학술대회 발표 또는 참석',
    met: input.academicConference === 'presented' || input.academicConference === 'attended',
    detail: '전국 규모 이상 발표 1회 또는 참석 2회 이상',
  })

  items.push({
    id: 'researchEthicsEducation',
    label: '연구윤리교육 이수',
    met: input.researchEthicsEducation === true,
    detail: '알파캠퍼스 온라인 연구윤리교육 이수증 제출',
  })

  items.push({
    id: 'researchEthicsCourse',
    label: '연구윤리와 논문작성법 이수',
    met: input.researchEthicsCourse === true,
    detail: '과목 이수 또는 면제',
  })

  const passed = items.every(item => item.met === true)
  return { passed, items }
}
