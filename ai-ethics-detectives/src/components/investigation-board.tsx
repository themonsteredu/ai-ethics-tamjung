import type { CaseAnswer, EvidenceRating } from "@/data/cases";
import { ethicsCases } from "@/data/cases";

const ratingOptions: { id: EvidenceRating; label: string; hint: string }[] = [
  { id: "high", label: "높음", hint: "직접 확인한 믿을 만한 자료" },
  { id: "medium", label: "보통", hint: "도움은 되지만 추가 확인 필요" },
  { id: "low", label: "낮음", hint: "의견이거나 출처가 불분명함" },
];

type InvestigationBoardProps = {
  item: (typeof ethicsCases)[number];
  answer: CaseAnswer;
  onPatch: (patch: Partial<CaseAnswer>) => void;
  onContinue: () => void;
};

export function InvestigationBoard({ item, answer, onPatch, onContinue }: InvestigationBoardProps) {
  const investigated = answer.investigated ?? [];
  const ratings = answer.evidenceRatings ?? {};
  const ready = investigated.length >= 2 && investigated.every((index) => ratings[index]);

  function toggleStep(index: number) {
    const isOpen = investigated.includes(index);
    const nextInvestigated = isOpen ? investigated.filter((value) => value !== index) : [...investigated, index];
    const nextRatings = { ...ratings };
    if (isOpen) delete nextRatings[index];
    onPatch({ investigated: nextInvestigated, evidenceRatings: nextRatings });
  }

  function rateEvidence(index: number, rating: EvidenceRating) {
    onPatch({ evidenceRatings: { ...ratings, [index]: rating } });
  }

  return (
    <>
      <div className="investigation-intro">
        <div><span>조사 원칙</span><h2>무엇을 확인해야 판단이 단단해질까요?</h2><p>조사 행동을 두 가지 이상 선택하고, 얻은 단서의 신뢰도를 직접 판단하세요.</p></div>
        <div className="evidence-counter"><b>{investigated.length}</b><span>/ {item.investigation.length}개 조사</span></div>
      </div>

      <div className="investigation-grid">
        {item.investigation.map((step, index) => {
          const isOpen = investigated.includes(index);
          const rating = ratings[index];
          const matches = rating === step.reliability;
          return (
            <article className={`investigation-card ${isOpen ? "open" : ""}`} key={step.action}>
              <div className="investigation-card-head"><span>조사 {index + 1}</span><i>{isOpen ? "단서 발견" : "미확인"}</i><h3>{step.action}</h3></div>
              {!isOpen ? (
                <button className="outline-button investigation-open" onClick={() => toggleStep(index)}>이 행동으로 조사하기 <span>+</span></button>
              ) : (
                <div className="evidence-reveal page-enter">
                  <div className="evidence-found"><span aria-hidden="true">✦</span> 새로운 단서를 찾았어요!</div>
                  <span className="evidence-source">출처 · {step.source}</span>
                  <p>{step.clue}</p>
                  <fieldset className="rating-fieldset">
                    <legend>이 단서는 얼마나 믿을 만할까요?</legend>
                    <div>{ratingOptions.map((option) => <button type="button" key={option.id} className={rating === option.id ? "selected" : ""} onClick={() => rateEvidence(index, option.id)} aria-pressed={rating === option.id}><b>{option.label}</b><small>{option.hint}</small></button>)}</div>
                  </fieldset>
                  {rating && <div className={`rating-feedback ${matches ? "match" : "rethink"}`}>{matches ? "출처의 성격을 잘 살폈어요." : "누가 만든 자료인지, 직접 확인한 자료인지 다시 살펴봐요."}</div>}
                  <button className="evidence-close" onClick={() => toggleStep(index)}>이 조사 취소</button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="investigation-footer">
        <p>{ready ? "조사 완료! 이제 비밀 질문을 열고 단서를 수사판에 연결해 보세요." : "단서를 2개 이상 열고 각각의 신뢰도를 판단하면 다음 단계로 갈 수 있어요."}</p>
        <button className="primary-button large" disabled={!ready} onClick={onContinue}>탐정 수사회의로 <span>→</span></button>
      </div>
    </>
  );
}
