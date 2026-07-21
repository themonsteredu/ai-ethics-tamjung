import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { ethicsCases } from "@/data/cases";

export const metadata: Metadata = {
  title: "사건별 활동지 | AI 윤리탐정단",
  description: "사실·사람·가치·행동을 연결하는 AI 윤리탐정단 인쇄 활동지",
};

export default function WorksheetsPage() {
  return (
    <main className="worksheet-hub">
      <div className="worksheet-toolbar no-print">
        <Link href="/">← 윤리탐정단으로 돌아가기</Link>
        <div><b>큰 글씨 사건 활동지</b><span>사건마다 한 장씩 인쇄됩니다.</span></div>
        <PrintButton />
      </div>
      <section className="worksheet-guide no-print"><b>인쇄 안내</b><p>필요한 사건 페이지만 골라 인쇄하거나 PDF로 저장하세요.</p></section>

      <div className="worksheet-stack">
        {ethicsCases.map((item, index) => (
          <article className="print-sheet" key={item.id}>
            <header className="print-sheet-head">
              <div><span>AI 윤리탐정단 활동지</span><h1>{item.caseNo} · {item.title}</h1><p>{item.question}</p></div>
              <div className="student-fields"><span>이름 <i /></span><span>모둠 <i /></span></div>
            </header>

            <section className="print-scene"><h2><span>1</span> 사건 기록 읽기</h2><p>{item.scene}</p><div><b>확인한 단서</b>{item.clues.map((clue, clueIndex) => <span key={clue}><i>{clueIndex + 1}</i>{clue}</span>)}</div></section>

            <section className="print-thinking">
              <h2><span>2</span> 나의 추리 쓰기</h2>
              <div className="print-three-columns">
                <WritingBox title="사실" question="무엇을 더 확인해야 하나요?" />
                <WritingBox title="사람" question="누가 어떤 영향을 받나요?" />
                <WritingBox title="가치" question={`무엇을 지켜야 하나요? (${item.values.join(" · ")})`} />
              </div>
            </section>

            <section className="print-discussion">
              <h2><span>3</span> 친구와 이야기하기</h2>
              <p className="print-question">{item.discussion.question}</p>
              <div className="print-sides">{item.discussion.sides.map((side) => <div key={side.id}><b>{side.id}</b><span>{side.title}</span></div>)}</div>
              <WritingPrompt title="가장 설득력 있었던 친구의 근거는?" />
            </section>

            <section className="print-action">
              <h2><span>4</span> 사건 해결하기</h2>
              <WritingPrompt title="우리 모둠이 정한 더 나은 행동은?" />
              <WritingPrompt title="왜 이 행동이 더 나을까요?" />
            </section>

            <footer><span><b>오늘의 탐정 약속</b> {item.principle}</span><strong>{index + 1} / {ethicsCases.length}</strong></footer>
          </article>
        ))}
      </div>
    </main>
  );
}

function WritingBox({ title, question }: { title: string; question: string }) {
  return <div><b>{title}</b><p>{question}</p><i /><i /></div>;
}

function WritingPrompt({ title }: { title: string }) {
  return <div className="print-writing-prompt"><b>{title}</b><i /><i /></div>;
}
