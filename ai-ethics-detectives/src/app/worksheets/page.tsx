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
        <div><b>교사용 사건 활동지</b><span>사건마다 1쪽, 총 4쪽입니다.</span></div>
        <PrintButton />
      </div>
      <section className="worksheet-guide no-print"><b>인쇄 안내</b><p>인쇄 창에서 필요한 사건 페이지만 선택하거나 PDF로 저장할 수 있습니다.</p></section>

      <div className="worksheet-stack">
        {ethicsCases.map((item, index) => (
          <article className="print-sheet" key={item.id}>
            <header className="print-sheet-head">
              <div><span>AI 윤리탐정단</span><h1>{item.caseNo} · {item.title}</h1><p>{item.question}</p></div>
              <div className="student-fields"><span>학년 <i /></span><span>반 <i /></span><span>번호 <i /></span><span>이름 <i /></span></div>
            </header>

            <section className="print-target"><b>오늘 밝혀낼 것</b><span>{item.principle}</span></section>

            <section className="print-scene"><h2>무슨 일이 있었나요?</h2><p>{item.scene}</p><div><b>현장에서 확인한 사실</b>{item.clues.map((clue, clueIndex) => <span key={clue}><i>{clueIndex + 1}</i>{clue}</span>)}</div></section>

            <section className="print-thinking">
              <h2>사실 · 사람 · 가치를 연결해 봅시다.</h2>
              <div className="print-three-columns">
                <WritingBox number="1" title="사실" question="가장 믿을 만한 자료는 무엇인가요?" />
                <WritingBox number="2" title="사람" question="누가 어떤 영향을 받나요?" />
                <WritingBox number="3" title="가치" question={`지켜야 할 가치는? (${item.values.join(" · ")})`} />
              </div>
              <div className="print-sentence"><b>나의 근거 문장</b><p>____________ 자료를 살펴보니, ____________에게 미칠 영향을 생각해 ____________의 가치를 지켜야 합니다.</p></div>
            </section>

            <section className="print-discussion"><h2>친구와 판단을 나누어 봅시다.</h2><p className="print-question">{item.discussion.question}</p><div className="print-sides">{item.discussion.sides.map((side) => <div key={side.id}><b>입장 {side.id} · {side.title}</b><p>{side.description}</p><span>이 입장의 중요한 근거:</span><i /></div>)}</div></section>

            <section className="print-action"><h2>더 나은 행동을 정해 봅시다.</h2>{item.actions.map((action, actionIndex) => <label key={action.text}><i />{String.fromCharCode(65 + actionIndex)}. {action.text}</label>)}<div><b>우리 모둠의 한 줄 약속</b><i /></div></section>

            <footer><span>정답을 맞히기보다 근거와 영향을 중심으로 이야기합니다.</span><b>{index + 1} / {ethicsCases.length}</b></footer>
          </article>
        ))}
      </div>
    </main>
  );
}

function WritingBox({ number, title, question }: { number: string; title: string; question: string }) {
  return <div><span>{number}</span><b>{title}</b><p>{question}</p><i /><i /></div>;
}
