export default function ResultView({ result, onEditConditions, onReset }) {
  const { passed, items } = result
  const failedItems = items.filter(i => i.met === false)

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className={`rounded-xl p-5 mb-6 text-center border
        ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="text-4xl mb-2">{passed ? '✅' : '❌'}</div>
        <div className={`text-xl font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>
          {passed ? '졸업 가능' : '졸업 불가'}
        </div>
        {!passed && (
          <p className="text-sm text-red-600 mt-1">
            미충족 항목 {failedItems.length}개 · 아래에서 확인하세요
          </p>
        )}
        {passed && (
          <p className="text-sm text-green-600 mt-1">
            모든 졸업요건을 충족했습니다
          </p>
        )}
      </div>

      <h4 className="text-sm font-semibold text-gray-600 mb-3">항목별 결과</h4>
      <div className="space-y-2 mb-5">
        {items.map(item => (
          <div key={item.id}
            className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm
              ${item.met === true  ? 'bg-green-50' : ''}
              ${item.met === false ? 'bg-red-50'   : ''}
            `}>
            <span className="mt-0.5 shrink-0">
              {item.met === true  && '✅'}
              {item.met === false && '❌'}
            </span>
            <div>
              <p className={`font-medium leading-tight
                ${item.met === false ? 'text-red-700' : 'text-gray-700'}`}>
                {item.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800 mb-4">
        ※ 이 결과는 모의 시뮬레이션입니다. 실제 졸업사정은 대학원 교학지원처의 공식 심사를 통해 결정되며,
        예외 사항이 있거나 궁금한 점은 담당자에게 문의하세요.
      </div>

      <div className="flex gap-3">
        <button onClick={onEditConditions}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >← 조건 수정하기</button>
        <button onClick={onReset}
          className="flex-1 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >처음부터 다시하기</button>
      </div>
    </div>
  )
}
