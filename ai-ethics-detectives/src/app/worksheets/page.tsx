import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { ethicsCases } from "@/data/cases";

export const metadata: Metadata = {
  title: "사건별 활동지 | AI 윤리탐정단",
  description: "AI 윤리탐정단 사건별 토론 활동지 인쇄 페이지",
};

const judgementOptions = ["괜찮다고 생각한다", "더 알아봐야 한다", "멈춰야 한다"];
const actionOptions = [
  "개인정보를 입력하기 전에 멈추기",
  "다른 사람이 피해를 입지 않는지 살피기",
  "사실과 출처 확인하기",
  "AI를 사용한 부분 밝히기",
];

export default function WorksheetsPage() {
  return (
    <main className="worksheet-hub">
      <div className="worksheet-toolbar no-print">
        <Link className="worksheet-back" href="/">← 탐정단으로 돌아가기</Link>
        <div>
          <b>교사용 수업 자료</b>
          <span>활동지는 총 4쪽입니다. 인쇄 창에서 필요한 페이지만 선택하세요.</span>
        </div>
        <PrintButton />
      </div>

      <section className="worksheet-guide no-print">
        <span>인쇄 안내</span>
        <p><b>인쇄 / PDF로 저장</b> 버튼을 누른 뒤 프린터를 선택하거나, 대상을 <b>PDF로 저장</b>으로 바꾸면 파일로 내려받을 수 있습니다.</p>
      </section>

      <div className="worksheet-stack">
        {ethicsCases.map((item, index) => (
          <article className="print-sheet" key={item.id}>
            <header className="print-sheet-head">
              <h1>AI 윤리탐정단 사건 토론 활동지</h1>
              <p>친구의 의견을 듣고 근거를 비교하며 나의 생각을 정리해 봅시다.</p>
              <div className="student-fields">
                <span>학교 <i /></span><span>학년 <i /></span><span>반 <i /></span><span>번호 <i /></span><span>이름 <i /></span>
              </div>
            </header>

            <div className="print-goal"><b>학습 목표</b><span>AI 활용 상황을 여러 관점에서 살펴보고, 근거를 들어 판단할 수 있다.</span></div>

            <section className="print-case">
              <div className="print-case-title">
                <span>사건 {item.id}</span>
                <h2>{item.title}</h2>
                <small>관련 주제: {item.category}</small>
              </div>
              <div className="print-case-body">
                <div><b>사건 내용</b><p>{item.scene}</p></div>
                <div><b>살펴볼 점</b><ul>{item.evidence.map((clue) => <li key={clue}>{clue}</li>)}</ul></div>
              </div>
              <div className="print-question"><b>생각할 문제</b><span>{item.discuss}</span></div>
            </section>

            <WorksheetSection number="1" title="사건을 읽고 나의 생각 정하기">
              <div className="judgement-line"><b>나는 이 행동이</b>{judgementOptions.map((option) => <label key={option}><i />{option}</label>)}</div>
              <WritingLines label="그렇게 생각한 까닭" lines={2} />
            </WorksheetSection>

            <WorksheetSection number="2" title="친구들의 의견과 근거 정리하기" note="친구의 말에서 중요한 내용을 간단히 적습니다.">
              <table className="opinion-table">
                <thead><tr><th>친구 이름</th><th>친구의 의견</th><th>그렇게 생각한 근거</th></tr></thead>
                <tbody>{[1, 2, 3].map((row) => <tr key={row}><td /><td /><td /></tr>)}</tbody>
              </table>
            </WorksheetSection>

            <WorksheetSection number="3" title="토론 후 나의 생각 다시 정리하기">
              <div className="after-row"><b>토론 전과 비교했을 때 내 생각은</b><label><i />달라졌다</label><label><i />그대로이다</label></div>
              <WritingLines label="가장 기억에 남는 친구의 의견" lines={1} />
              <div className="after-row"><b>토론 후 나의 최종 판단</b>{["괜찮다", "더 알아봐야 한다", "멈춰야 한다"].map((option) => <label key={option}><i />{option}</label>)}</div>
              <WritingLines label="생각이 달라졌거나 더 분명해진 이유" lines={2} />
            </WorksheetSection>

            <WorksheetSection number="4" title="우리 모둠의 실천 약속 정하기">
              <p className="action-help">이 사건에서 가장 필요하다고 생각하는 행동에 ○표 해 봅시다.</p>
              <div className="action-grid">{actionOptions.map((option) => <label key={option}><i />{option}</label>)}</div>
              <WritingLines label="우리 모둠의 한 줄 약속" lines={1} />
            </WorksheetSection>

            <footer className="print-sheet-footer">
              <span>※ 서로 다른 의견을 존중하고, 주장보다 근거를 중심으로 이야기합니다.</span>
              <b>AI 윤리탐정단 활동지 {index + 1} / {ethicsCases.length}</b>
            </footer>
          </article>
        ))}
      </div>
    </main>
  );
}

function WorksheetSection({ number, title, note, children }: { number: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="worksheet-section">
      <div className="worksheet-section-head"><span>활동 {number}</span><h3>{title}</h3>{note && <small>※ {note}</small>}</div>
      {children}
    </section>
  );
}

function WritingLines({ label, lines }: { label: string; lines: number }) {
  return <div className="writing-lines"><b>{label}</b><div>{Array.from({ length: lines }, (_, index) => <i key={index} />)}</div></div>;
}
