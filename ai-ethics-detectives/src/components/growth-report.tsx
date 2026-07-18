import type { CaseAnswer, Signal } from "@/data/cases";
import { ethicsCases } from "@/data/cases";

const signalLabels: Record<Signal, string> = { green: "괜찮아요", yellow: "더 살펴봐요", red: "멈춰야 해요" };

export function GrowthReport({ answers }: { answers: Record<number, CaseAnswer> }) {
  const completed = ethicsCases.filter((item) => answers[item.id]?.finalSignal);
  const changed = completed.filter((item) => answers[item.id]?.firstSignal !== answers[item.id]?.finalSignal).length;
  const evidenceCount = completed.reduce((total, item) => total + (answers[item.id]?.investigated?.length ?? 0), 0);
  const valueCounts = completed.reduce<Record<string, number>>((counts, item) => {
    const value = answers[item.id]?.value;
    if (value) counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
  const leadingValue = Object.entries(valueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "아직 없음";

  return (
    <section className="growth-report">
      <div className="growth-report-head"><span className="section-kicker">나의 성장 기록</span><h2>판단 변화 보고서</h2><p>어떤 근거를 살피고, 누구의 관점에서 생각했는지 돌아보세요.</p></div>
      <div className="report-summary"><div><span>판단 변화</span><b>{changed}<small>건</small></b></div><div><span>수집한 단서</span><b>{evidenceCount}<small>개</small></b></div><div><span>대표 윤리 가치</span><b>{leadingValue}</b></div></div>
      <div className="report-case-list">
        {completed.map((item) => {
          const answer = answers[item.id];
          const first = answer.firstSignal ? signalLabels[answer.firstSignal] : "기록 없음";
          const final = answer.finalSignal ? signalLabels[answer.finalSignal] : "기록 없음";
          const changedMind = answer.firstSignal !== answer.finalSignal;
          const clue = answer.influentialEvidence === undefined ? undefined : item.investigation[answer.influentialEvidence];
          return (
            <article key={item.id}>
              <div className="report-case-number">0{item.id}</div>
              <div className="report-case-copy"><h3>{item.title}</h3><p>{clue ? `가장 영향을 준 단서: ${clue.source}` : "영향을 준 단서를 기록하지 않았어요."}</p></div>
              <div className="report-change"><span>{first}</span><b>→</b><span>{final}</span><strong className={changedMind ? "changed" : "kept"}>{changedMind ? "생각 확장" : "근거 강화"}</strong></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
