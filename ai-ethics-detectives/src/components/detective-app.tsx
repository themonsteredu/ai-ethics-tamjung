"use client";

import { useEffect, useMemo, useState } from "react";
import { ethicsCases, sharedPromises, signalOptions, type DetectiveAnswer, type Signal } from "@/data/cases";

type Screen = "home" | "setup" | "scene" | "think" | "talk" | "resolve" | "pledge" | "complete";

type SavedProgress = {
  nickname?: string;
  caseIndex?: number;
  answers?: Record<number, DetectiveAnswer>;
  promises?: number[];
};

const STORAGE_KEY = "ai-ethics-detectives-rebuilt-v1";
const nicknames = ["별빛 탐정", "진실 수사관", "마음 탐정", "초록 돋보기", "용기 탐정"];

function readProgress(): SavedProgress {
  if (typeof window === "undefined") return {};
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return {};
  try {
    return JSON.parse(saved) as SavedProgress;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

export function DetectiveApp() {
  const [saved] = useState(readProgress);
  const [screen, setScreen] = useState<Screen>("home");
  const [nickname, setNickname] = useState(saved.nickname ?? "");
  const [caseIndex, setCaseIndex] = useState(Math.min(saved.caseIndex ?? 0, ethicsCases.length - 1));
  const [answers, setAnswers] = useState<Record<number, DetectiveAnswer>>(saved.answers ?? {});
  const [promises, setPromises] = useState<number[]>(saved.promises ?? []);
  const [teacherOpen, setTeacherOpen] = useState(false);

  const item = ethicsCases[caseIndex];
  const answer = answers[item.id] ?? {};
  const solvedCount = useMemo(() => ethicsCases.filter((caseItem) => answers[caseItem.id]?.action !== undefined).length, [answers]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ nickname, caseIndex, answers, promises }));
  }, [nickname, caseIndex, answers, promises]);

  function go(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function patchAnswer(patch: Partial<DetectiveAnswer>) {
    setAnswers((previous) => ({
      ...previous,
      [item.id]: { ...previous[item.id], ...patch },
    }));
  }

  function continueCase() {
    if (caseIndex < ethicsCases.length - 1) {
      setCaseIndex((value) => value + 1);
      go("scene");
    } else {
      go("pledge");
    }
  }

  function resetProgram() {
    if (!window.confirm("저장된 탐정 기록을 모두 지우고 처음부터 시작할까요?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setNickname("");
    setCaseIndex(0);
    setAnswers({});
    setPromises([]);
    go("home");
  }

  const showCaseProgress = ["scene", "think", "talk", "resolve"].includes(screen);

  return (
    <main className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => go("home")} aria-label="AI 윤리탐정단 처음 화면으로 이동">
          <span className="brand-mark" aria-hidden="true">⌕</span>
          <span><b>AI 윤리탐정단</b><small>사실 · 사람 · 가치 · 행동</small></span>
        </button>
        <div className="header-actions">
          {screen !== "home" && <span className="detective-id">탐정 {nickname || "연수생"}</span>}
          <a className="header-link" href="/worksheets" target="_blank" rel="noreferrer">수업 활동지</a>
          <button className="header-button" onClick={() => setTeacherOpen(true)}>교사용 안내</button>
        </div>
      </header>

      {showCaseProgress && <CaseProgress caseIndex={caseIndex} screen={screen} />}

      {screen === "home" && <HomeScreen onStart={() => go("setup")} onTeacher={() => setTeacherOpen(true)} />}

      {screen === "setup" && (
        <section className="setup-page page-enter">
          <div className="setup-intro">
            <span className="page-label">탐정 등록</span>
            <h1>사건을 해결하기 전에<br />판단 순서부터 익혀요.</h1>
            <p>AI 윤리탐정은 정답을 빨리 맞히는 사람이 아니라, 사람과 근거를 생각하며 더 나은 행동을 찾는 사람입니다.</p>
          </div>
          <div className="thinking-route" aria-label="윤리 판단 네 단계">
            <ThinkingStep number="1" title="사실" text="무슨 일이 있었나요?" />
            <ThinkingStep number="2" title="사람" text="누가 영향을 받나요?" />
            <ThinkingStep number="3" title="가치" text="무엇을 지켜야 하나요?" />
            <ThinkingStep number="4" title="행동" text="어떻게 바꾸면 좋을까요?" />
          </div>
          <div className="nickname-card">
            <label htmlFor="nickname">오늘 사용할 탐정 별명</label>
            <div><input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 12))} placeholder="예: 별빛 탐정" autoComplete="off" /><button onClick={() => setNickname(nicknames[Math.floor(Math.random() * nicknames.length)])} aria-label="탐정 별명 무작위 만들기">↻</button></div>
            <small>실명은 쓰지 않아도 됩니다. 기록은 이 기기에만 저장됩니다.</small>
          </div>
          <button className="primary-button large" disabled={!nickname.trim()} onClick={() => { setCaseIndex(0); go("scene"); }}>첫 사건 만나기 <span>→</span></button>
        </section>
      )}

      {screen === "scene" && (
        <CasePage item={item} caseIndex={caseIndex} stage="사건 이해">
          <LearningTarget question={item.question} principle={item.principle} />
          <section className="scene-layout">
            <article className="case-story">
              <div className="case-story-head"><span>{item.caseNo}</span><b>{item.topic}</b></div>
              <h1>{item.title}</h1>
              <p>{item.scene}</p>
            </article>
            <aside className="case-notebook">
              <div className="helpful-note"><span>AI가 도운 점</span><p>{item.aiHelp}</p></div>
              <div className="clue-list"><span>현장에서 확인한 사실</span>{item.clues.map((clue, index) => <p key={clue}><i>{index + 1}</i>{clue}</p>)}</div>
            </aside>
          </section>
          <section className="first-judgement">
            <div className="section-heading"><span>나의 첫 판단</span><h2>이대로 행동해도 괜찮을까요?</h2><p>친구와 이야기하기 전, 지금 내 생각을 먼저 남겨요.</p></div>
            <SignalPicker value={answer.firstSignal} onChange={(firstSignal) => patchAnswer({ firstSignal })} />
            {answer.firstSignal && (
              <div className="reason-choice page-enter">
                <b>그렇게 생각한 가장 큰 이유는?</b>
                {item.reasonOptions.map((reason, index) => <button key={reason} className={answer.firstReason === index ? "selected" : ""} onClick={() => patchAnswer({ firstReason: index })} aria-pressed={answer.firstReason === index}><span>{String.fromCharCode(65 + index)}</span>{reason}</button>)}
              </div>
            )}
          </section>
          <PageActions><button className="primary-button large" disabled={answer.firstSignal === undefined || answer.firstReason === undefined} onClick={() => go("think")}>근거를 따라가 보기 <span>→</span></button></PageActions>
        </CasePage>
      )}

      {screen === "think" && (
        <CasePage item={item} caseIndex={caseIndex} stage="근거 찾기">
          <LearningTarget question={item.question} principle={item.principle} />
          <div className="thinking-intro"><span>생각의 돋보기</span><h1>사실만 보지 말고, 사람과 가치까지 연결해요.</h1><p>세 가지 질문에 답하면 내 판단의 근거가 한 문장으로 완성됩니다.</p></div>
          <section className="lens-block fact-lens">
            <LensHeading number="1" label="사실을 확인해요" question="어떤 자료가 판단에 가장 도움이 될까요?" />
            <div className="option-grid evidence-options">{item.evidenceOptions.map((option, index) => <button key={option.label} className={answer.evidence === index ? "selected" : ""} onClick={() => patchAnswer({ evidence: index })} aria-pressed={answer.evidence === index}><span>{option.strong ? "믿을 만한 자료" : "추가 확인 필요"}</span><b>{option.label}</b><p>{option.detail}</p></button>)}</div>
          </section>
          <section className="lens-block people-lens">
            <LensHeading number="2" label="사람을 살펴요" question="이 일로 가장 먼저 생각해야 할 사람은 누구일까요?" />
            <div className="option-grid people-options">{item.people.map((person, index) => <button key={person.name} className={answer.affected === index ? "selected" : ""} onClick={() => patchAnswer({ affected: index })} aria-pressed={answer.affected === index}><span aria-hidden="true">{["◉", "◇", "△"][index]}</span><b>{person.name}</b><p>{person.impact}</p></button>)}</div>
          </section>
          <section className="lens-block value-lens">
            <LensHeading number="3" label="가치를 연결해요" question="더 나은 판단을 위해 무엇을 지켜야 할까요?" />
            <div className="value-options">{item.values.map((value) => <button key={value} className={answer.value === value ? "selected" : ""} onClick={() => patchAnswer({ value })} aria-pressed={answer.value === value}>{value}</button>)}</div>
          </section>
          {answer.evidence !== undefined && answer.affected !== undefined && answer.value && (
            <div className="reason-summary page-enter" role="status"><span>나의 근거 문장</span><p><b>{item.evidenceOptions[answer.evidence].label}</b>을 살펴보니, <b>{item.people[answer.affected].name}</b>에게 미칠 영향을 생각해 <b>{answer.value}</b>의 가치를 지켜야 합니다.</p></div>
          )}
          <PageActions><button className="secondary-button" onClick={() => go("scene")}>← 첫 판단 보기</button><button className="primary-button large" disabled={answer.evidence === undefined || answer.affected === undefined || !answer.value} onClick={() => go("talk")}>친구와 판단 나누기 <span>→</span></button></PageActions>
        </CasePage>
      )}

      {screen === "talk" && (
        <CasePage item={item} caseIndex={caseIndex} stage="모둠 이야기">
          <LearningTarget question={item.question} principle={item.principle} />
          <section className="discussion-board">
            <div className="discussion-heading"><span>모둠 이야기</span><h1>{item.discussion.question}</h1><p>누가 이기는 토론이 아니라, 더 좋은 근거와 행동을 함께 찾는 시간입니다.</p></div>
            <div className="position-grid">{item.discussion.sides.map((side) => <button key={side.id} className={answer.discussionSide === side.id ? "selected" : ""} onClick={() => patchAnswer({ discussionSide: side.id })} aria-pressed={answer.discussionSide === side.id}><span>입장 {side.id}</span><b>{side.title}</b><p>{side.description}</p><strong>{answer.discussionSide === side.id ? "우리 모둠의 현재 입장 ✓" : "이 입장 선택하기"}</strong></button>)}</div>
            <div className="talk-guide">
              <div><span>말할 때 사용할 세 가지 질문</span>{item.discussion.prompts.map((prompt, index) => <p key={prompt}><i>{index + 1}</i>{prompt}</p>)}</div>
              <div className="sentence-start"><span>이렇게 시작해 보세요</span><p>“나는 <b>___ 단서</b> 때문에 이렇게 생각해.”</p><p>“<b>___의 마음</b>에서 보면 달라질 수 있어.”</p><p>“우리 둘의 의견을 합치면 <b>___</b>할 수 있어.”</p></div>
            </div>
            <DiscussionTimer />
          </section>
          <PageActions><button className="secondary-button" onClick={() => go("think")}>← 근거 다시 보기</button><button className="primary-button large" disabled={!answer.discussionSide} onClick={() => go("resolve")}>더 나은 행동 정하기 <span>→</span></button></PageActions>
        </CasePage>
      )}

      {screen === "resolve" && (
        <CasePage item={item} caseIndex={caseIndex} stage="행동 결정">
          <LearningTarget question={item.question} principle={item.principle} />
          <section className="resolution-intro"><span>사건 해결</span><h1>그래서 우리는 어떻게 행동해야 할까요?</h1><p>문제를 찾는 데서 끝나지 않고, 실제로 할 수 있는 행동을 선택해요.</p></section>
          <div className="action-options">{item.actions.map((action, index) => <button key={action.text} className={answer.action === index ? "selected" : ""} onClick={() => patchAnswer({ action: index })} aria-pressed={answer.action === index}><span>{String.fromCharCode(65 + index)}</span><b>{action.text}</b>{answer.action === index && <p className={action.recommended ? "good" : "rethink"}>{action.recommended ? "좋은 해결 행동이에요. " : "한 번 더 생각해 봐요. "}{action.why}</p>}</button>)}</div>
          {answer.action !== undefined && (
            <section className="final-judgement page-enter">
              <div className="section-heading"><span>나의 최종 판단</span><h2>근거와 친구의 생각을 들은 지금은 어떻게 판단하나요?</h2></div>
              <SignalPicker value={answer.finalSignal} onChange={(finalSignal) => patchAnswer({ finalSignal })} />
              {answer.finalSignal && <div className="change-reasons"><b>내 생각에 가장 영향을 준 것은?</b>{["새로 확인한 자료", "영향받는 사람의 마음", "친구가 말한 다른 근거", "처음 생각의 근거가 더 분명해짐"].map((reason) => <button key={reason} className={answer.changeReason === reason ? "selected" : ""} onClick={() => patchAnswer({ changeReason: reason })} aria-pressed={answer.changeReason === reason}>{reason}</button>)}</div>}
            </section>
          )}
          {answer.action !== undefined && answer.finalSignal && answer.changeReason && (
            <div className="principle-card page-enter"><div className="principle-badge">{item.badge}</div><div><span>이번 사건의 탐정 원칙</span><h2>{item.principle}</h2><p>{item.checklist.stage}에 확인할 약속으로 탐정 수첩에 기록했습니다.</p></div></div>
          )}
          <PageActions><button className="secondary-button" onClick={() => go("talk")}>← 모둠 이야기 보기</button><button className="primary-button large" disabled={answer.action === undefined || !answer.finalSignal || !answer.changeReason} onClick={continueCase}>{caseIndex === ethicsCases.length - 1 ? "우리 반 약속 만들기" : "다음 사건으로"} <span>→</span></button></PageActions>
        </CasePage>
      )}

      {screen === "pledge" && (
        <section className="pledge-page page-enter">
          <div className="pledge-heading"><span>마지막 활동</span><h1>우리 반에 필요한<br />AI 윤리 약속을 골라요.</h1><p>사건에서 배운 내용을 생활 속 행동으로 바꾸는 단계입니다. 가장 중요하다고 생각하는 약속 세 가지 이상을 선택하세요.</p></div>
          <div className="learned-principles">{ethicsCases.map((caseItem) => <div key={caseItem.id}><span>{caseItem.badge}</span><p><b>{caseItem.topic}</b>{caseItem.principle}</p></div>)}</div>
          <section className="promise-picker"><span>우리 반 AI 윤리 키워드와 실천 방법</span>{sharedPromises.map((promise, index) => <button key={promise.value} className={promises.includes(index) ? "selected" : ""} onClick={() => setPromises((previous) => previous.includes(index) ? previous.filter((value) => value !== index) : [...previous, index])} aria-pressed={promises.includes(index)}><i>{promises.includes(index) ? "✓" : index + 1}</i><b>{promise.value}</b><p>{promise.text}</p></button>)}</section>
          <div className="pledge-status"><b>{promises.length}</b><span>/ 3개 이상 선택</span></div>
          <PageActions><button className="primary-button large" disabled={promises.length < 3} onClick={() => go("complete")}>윤리탐정단 임무 완료 <span>→</span></button></PageActions>
        </section>
      )}

      {screen === "complete" && (
        <section className="complete-page page-enter">
          <div className="complete-mark" aria-hidden="true">⌕</div>
          <span>AI 윤리탐정 인증</span>
          <h1>{nickname} 탐정,<br />이제 AI를 스스로 판단하며 사용할 수 있어요.</h1>
          <p>AI를 무조건 믿거나 두려워하지 않고, 사실과 사람을 살피며 책임 있는 행동을 선택했습니다.</p>
          <div className="complete-summary"><div><b>{solvedCount}</b><span>해결한 사건</span></div><div><b>{promises.length}</b><span>선택한 약속</span></div><div><b>4</b><span>판단 단계</span></div></div>
          <div className="my-promises"><span>내가 선택한 AI 윤리 약속</span>{promises.map((index) => <p key={index}><b>{sharedPromises[index].value}</b>{sharedPromises[index].text}</p>)}</div>
          <div className="complete-actions"><button className="primary-button" onClick={() => window.print()}>인증 기록 인쇄</button><button className="secondary-button" onClick={resetProgram}>새로 시작하기</button></div>
        </section>
      )}

      {teacherOpen && <TeacherPanel onClose={() => setTeacherOpen(false)} />}
    </main>
  );
}

function HomeScreen({ onStart, onTeacher }: { onStart: () => void; onTeacher: () => void }) {
  return (
    <>
      <section className="home-hero page-enter">
        <div className="home-copy">
          <span className="eyebrow">초등 AI 윤리 시민 수업</span>
          <h1>AI가 도와줘도,<br /><em>마지막 판단은 내가 해요.</em></h1>
          <p>네 가지 생활 속 사건을 살펴보며 <b>사실을 확인하고, 사람의 마음을 살피고, 지켜야 할 가치를 찾아 더 나은 행동</b>을 선택합니다.</p>
          <div className="home-actions"><button className="primary-button large" onClick={onStart}>윤리탐정단 시작하기 <span>→</span></button><button className="text-button" onClick={onTeacher}>40분 수업 운영안</button></div>
          <small>실명·로그인 없이 사용할 수 있으며 기록은 현재 기기에만 저장됩니다.</small>
        </div>
        <div className="hero-notebook" aria-label="윤리탐정의 생각 순서">
          <div className="notebook-shadow" />
          <div className="notebook-page">
            <div className="notebook-top"><span>DETECTIVE NOTE 01</span><b>AI ETHICS</b></div>
            <div className="notebook-question">AI의 답보다 먼저<br /><b>무엇을 생각해야 할까?</b></div>
            <div className="notebook-route"><p><i>1</i><span><b>사실</b>무슨 일이 있었나요?</span></p><p><i>2</i><span><b>사람</b>누가 영향을 받나요?</span></p><p><i>3</i><span><b>가치</b>무엇을 지켜야 하나요?</span></p><p><i>4</i><span><b>행동</b>어떻게 바꾸면 좋을까요?</span></p></div>
            <div className="notebook-stamp">생각하고<br />결정하기</div>
          </div>
          <div className="notebook-tabs"><span>확</span><span>멈</span><span>살</span><span>밝</span></div>
        </div>
      </section>
      <section className="core-message"><span>이 수업이 전하려는 한 문장</span><h2>AI는 편리한 도구이지만, 결과를 살피고 책임지는 사람은 우리입니다.</h2></section>
      <section className="case-preview">
        <div className="preview-heading"><span>4개의 생활 속 사건</span><h2>사건마다 한 가지 원칙을 분명하게 배워요.</h2></div>
        <div className="preview-grid">{ethicsCases.map((item) => <article key={item.id}><span>{item.caseNo}</span><i>{item.badge}</i><b>{item.title}</b><p>{item.question}</p><small>{item.principle}</small></article>)}</div>
      </section>
      <section className="home-footer-cta"><div><span>교실에서 바로 사용할 수 있어요</span><h2>개인 판단 → 근거 찾기 → 모둠 이야기 → 실천 약속</h2></div><button className="primary-button large" onClick={onStart}>첫 사건 시작하기 <span>→</span></button></section>
    </>
  );
}

function ThinkingStep({ number, title, text }: { number: string; title: string; text: string }) {
  return <div><i>{number}</i><p><b>{title}</b><span>{text}</span></p></div>;
}

function CaseProgress({ caseIndex, screen }: { caseIndex: number; screen: Screen }) {
  const stages: { id: Screen; label: string }[] = [{ id: "scene", label: "사건" }, { id: "think", label: "근거" }, { id: "talk", label: "이야기" }, { id: "resolve", label: "행동" }];
  const active = stages.findIndex((stage) => stage.id === screen);
  return <nav className="case-progress" aria-label="사건 진행 단계"><span>사건 {caseIndex + 1} / {ethicsCases.length}</span><div>{stages.map((stage, index) => <p key={stage.id} className={index < active ? "done" : index === active ? "active" : ""} aria-current={index === active ? "step" : undefined}><i>{index < active ? "✓" : index + 1}</i><b>{stage.label}</b></p>)}</div></nav>;
}

function CasePage({ item, caseIndex, stage, children }: { item: (typeof ethicsCases)[number]; caseIndex: number; stage: string; children: React.ReactNode }) {
  return <section className="case-page page-enter"><header className="case-page-head"><div><span>{item.caseNo}</span><b>{item.topic}</b></div><p>{caseIndex + 1}번째 사건 · {stage}</p></header>{children}</section>;
}

function LearningTarget({ question, principle }: { question: string; principle: string }) {
  return <div className="learning-target"><span>오늘 밝혀낼 것</span><h2>{question}</h2><p><b>수업이 끝나면</b> {principle}</p></div>;
}

function SignalPicker({ value, onChange }: { value?: Signal; onChange: (value: Signal) => void }) {
  return <div className="signal-picker">{signalOptions.map((option) => <button key={option.id} className={`${option.id} ${value === option.id ? "selected" : ""}`} onClick={() => onChange(option.id)} aria-pressed={value === option.id}><i>{option.symbol}</i><span><b>{option.label}</b><small>{option.description}</small></span></button>)}</div>;
}

function LensHeading({ number, label, question }: { number: string; label: string; question: string }) {
  return <div className="lens-heading"><i>{number}</i><div><span>{label}</span><h2>{question}</h2></div></div>;
}

function PageActions({ children }: { children: React.ReactNode }) {
  return <div className="page-actions">{children}</div>;
}

function DiscussionTimer() {
  const total = 180;
  const [seconds, setSeconds] = useState(total);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds === 0) return;
    const timer = window.setTimeout(() => {
      if (seconds <= 1) {
        setSeconds(0);
        setRunning(false);
      } else {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [running, seconds]);

  const minute = Math.floor(seconds / 60).toString().padStart(2, "0");
  const second = (seconds % 60).toString().padStart(2, "0");
  const progress = ((total - seconds) / total) * 100;

  return <div className="discussion-timer"><div><span>모둠 이야기 타이머</span><time aria-live="polite">{minute}:{second}</time></div><div className="timer-line"><i style={{ width: `${progress}%` }} /></div><p><button onClick={() => { setSeconds(total); setRunning(false); }}>처음으로</button><button onClick={() => setRunning((value) => !value)}>{running ? "잠시 멈춤" : seconds === 0 ? "다시 시작" : "3분 시작"}</button></p></div>;
}

function TeacherPanel({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="teacher-panel" role="dialog" aria-modal="true" aria-labelledby="teacher-title"><button className="modal-close" onClick={onClose} aria-label="교사용 안내 닫기">×</button><span>교사용 빠른 안내</span><h2 id="teacher-title">40분 수업 운영안</h2><p className="teacher-purpose">이 수업은 AI에 대한 두려움을 키우는 것이 아니라, AI의 편리함과 오류 가능성을 함께 이해하고 책임 있는 사용자로 판단하는 힘을 기르는 수업입니다.</p><div className="lesson-flow"><div><b>5분</b><span>도입</span><p>AI가 도와준 경험과 마지막 결정은 누가 했는지 이야기합니다.</p></div><div><b>12분</b><span>개인 판단</span><p>사건을 읽고 첫 판단과 이유를 선택합니다.</p></div><div><b>13분</b><span>근거·모둠 이야기</span><p>사실·사람·가치를 연결하고 두 입장을 비교합니다.</p></div><div><b>10분</b><span>행동·약속</span><p>해결 행동을 고르고 우리 반 AI 윤리 약속을 만듭니다.</p></div></div><div className="teacher-principles"><h3>교사가 꼭 확인할 것</h3><ul><li>정답을 빨리 알려주기보다 학생이 어떤 근거와 영향을 생각했는지 묻습니다.</li><li>생각을 바꾸는 것을 오답이 아니라 새로운 근거를 받아들인 성장으로 다룹니다.</li><li>각 사건을 ‘문제 찾기’에서 끝내지 않고 구체적인 실천 행동으로 연결합니다.</li><li>실제 개인정보·사진·학교 정보는 입력하지 않습니다.</li></ul></div><div className="curriculum-box"><b>지도서·교육과정 연계</b><p>지도서 1차시: AI 역기능 사례를 살펴보고 예방 및 대처법 알기</p><p>지도서 2차시: 필요한 윤리 키워드를 선정하고 구체적인 실천 방법 만들기</p><p><strong>[6실05-05]</strong> 인공지능이 사회에 미치는 영향을 탐색한다.</p><p><strong>[6도02-03]</strong> 인간과 인공지능의 관계를 파악하고 도덕에 기반한 관계 형성의 필요성을 탐구한다.</p></div><button className="primary-button full" onClick={onClose}>수업안 확인</button></section></div>;
}
