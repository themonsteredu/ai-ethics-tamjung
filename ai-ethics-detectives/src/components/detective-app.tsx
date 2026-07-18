"use client";

import { useEffect, useMemo, useState } from "react";
import { DiscussionMission } from "@/components/discussion-mission";
import { GrowthReport } from "@/components/growth-report";
import { InvestigationBoard } from "@/components/investigation-board";
import { constitutionRules, ethicsCases, type CaseAnswer, type Signal } from "@/data/cases";

type Screen = "home" | "briefing" | "case" | "investigation" | "discussion" | "result" | "constitution" | "complete";

type SavedProgress = {
  nickname?: string;
  caseIndex?: number;
  answers?: Record<number, CaseAnswer>;
  selectedRules?: number[];
  customRule?: string;
};

const signalOptions: { id: Signal; label: string; hint: string; icon: string }[] = [
  { id: "green", label: "초록", hint: "그대로 해도 괜찮아요", icon: "✓" },
  { id: "yellow", label: "노랑", hint: "확인하거나 허락이 필요해요", icon: "!" },
  { id: "red", label: "빨강", hint: "멈추고 바로잡아야 해요", icon: "×" },
];

const STORAGE_KEY = "ai-ethics-detective-progress-v1";

function readSavedProgress(): SavedProgress {
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
  const [initialProgress] = useState(readSavedProgress);
  const [screen, setScreen] = useState<Screen>("home");
  const [nickname, setNickname] = useState(initialProgress.nickname ?? "");
  const [caseIndex, setCaseIndex] = useState(Math.min(initialProgress.caseIndex ?? 0, ethicsCases.length - 1));
  const [answers, setAnswers] = useState<Record<number, CaseAnswer>>(initialProgress.answers ?? {});
  const [selectedRules, setSelectedRules] = useState<number[]>(initialProgress.selectedRules ?? []);
  const [customRule, setCustomRule] = useState(initialProgress.customRule ?? "");
  const [showTeacher, setShowTeacher] = useState(false);

  const currentCase = ethicsCases[caseIndex];
  const currentAnswer = answers[currentCase?.id] ?? {};

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ nickname, caseIndex, answers, selectedRules, customRule }),
    );
  }, [nickname, caseIndex, answers, selectedRules, customRule]);

  const earnedBadges = useMemo(
    () => ethicsCases.filter((item) => answers[item.id]?.finalSignal).map((item) => item.badge),
    [answers],
  );

  const changedMindCount = useMemo(
    () => ethicsCases.filter((item) => {
      const answer = answers[item.id];
      return answer?.firstSignal && answer?.finalSignal && answer.firstSignal !== answer.finalSignal;
    }).length,
    [answers],
  );

  function patchAnswer(patch: Partial<CaseAnswer>) {
    setAnswers((previous) => ({
      ...previous,
      [currentCase.id]: { ...previous[currentCase.id], ...patch },
    }));
  }

  function startMission() {
    setCaseIndex(0);
    setScreen("briefing");
  }

  function resetMission() {
    if (!window.confirm("저장된 탐정 기록을 모두 지우고 처음부터 시작할까요?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setNickname("");
    setCaseIndex(0);
    setAnswers({});
    setSelectedRules([]);
    setCustomRule("");
    setScreen("home");
  }

  function continueFromResult() {
    if (caseIndex < ethicsCases.length - 1) {
      setCaseIndex((value) => value + 1);
      setScreen("case");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setScreen("constitution");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header">
        <button className="brand" onClick={() => setScreen("home")} aria-label="처음 화면으로 이동">
          <span className="brand-mark" aria-hidden="true">⌕</span>
          <span><b>AI 윤리탐정단</b><small>멈 · 살 · 확 · 밝</small></span>
        </button>
        <div className="header-actions">
          {screen !== "home" && <span className="mini-id">탐정 {nickname || "새싹"}</span>}
          <details className="resource-menu">
            <summary className="ghost-button resource-trigger">수업 자료 <span aria-hidden="true">⌄</span></summary>
            <div className="resource-popover">
              <span className="resource-label">교사용 인쇄 자료</span>
              <a href="/worksheets" target="_blank" rel="noreferrer">
                <strong>사건별 활동지</strong>
                <small>4쪽 · 인쇄 또는 PDF 저장</small>
              </a>
              <p>새 창에서 필요한 페이지만 선택해 인쇄할 수 있어요.</p>
            </div>
          </details>
          <button className="ghost-button" onClick={() => setShowTeacher(true)}>교사용 안내</button>
        </div>
      </header>

      {screen !== "home" && screen !== "briefing" && screen !== "complete" && (
        <ProgressBar current={screen === "constitution" ? ethicsCases.length : caseIndex} />
      )}

      {screen === "home" && (
        <section className="hero page-enter">
          <div className="hero-copy">
            <div className="eyebrow"><span>●</span> AI 시대의 첫 번째 시민 수업</div>
            <h1>AI가 말하면<br /><em>전부 믿어도 될까?</em></h1>
            <p className="hero-lead">네 개의 수상한 사건을 해결하며<br className="desktop-break" /> 안전하고 정직한 AI 사용법을 찾아보세요.</p>
            <div className="hero-actions">
              <button className="primary-button large" onClick={startMission}>탐정 임무 시작 <span>→</span></button>
              <button className="text-button" onClick={() => setShowTeacher(true)}>40분 수업 운영법 보기</button>
            </div>
            <div className="privacy-note"><span aria-hidden="true">◈</span> 실명도, 로그인도 필요 없어요. 기록은 이 기기에만 저장됩니다.</div>
          </div>
          <div className="hero-visual" aria-label="AI 윤리 사건 파일 일러스트">
            <div className="case-file back-file"><span>TOP SECRET</span></div>
            <div className="case-file main-file">
              <div className="file-top"><span>사건 파일</span><b>#AI-042</b></div>
              <div className="robot-face"><i /><div className="eyes"><span /><span /></div><div className="mouth" /></div>
              <div className="scan-line" />
              <div className="file-stamp">판단 보류</div>
              <div className="file-clips"><i /><i /><i /></div>
            </div>
            <div className="magnifier"><span /></div>
            <div className="floating-chip chip-one">사실 확인</div>
            <div className="floating-chip chip-two">개인정보</div>
          </div>
          <div className="method-strip">
            {[
              ["멈", "개인정보라면"], ["살", "피해가 없는지"], ["확", "사실과 출처를"], ["밝", "AI 사용 사실을"],
            ].map(([letter, text]) => (
              <div className="method-item" key={letter}><strong>{letter}</strong><span>{text}<b>{letter === "멈" ? "멈춰요" : letter === "살" ? "살펴요" : letter === "확" ? "확인해요" : "밝혀요"}</b></span></div>
            ))}
          </div>
        </section>
      )}

      {screen === "briefing" && (
        <section className="content-page compact page-enter">
          <div className="briefing-card">
            <span className="section-kicker">탐정 등록</span>
            <h2>사건 현장에 들어갈 준비가 됐나요?</h2>
            <p>실명 대신 오늘 사용할 탐정 별명을 적어주세요.</p>
            <label className="input-label" htmlFor="nickname">나의 탐정 별명</label>
            <div className="input-row">
              <input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 12))} placeholder="예: 별빛 탐정" autoComplete="off" />
              <button className="dice-button" onClick={() => setNickname(["별빛 탐정", "지혜 탐정", "초록 부엉이", "진실 나침반"][Math.floor(Math.random() * 4)])} aria-label="별명 무작위 만들기">↻</button>
            </div>
            <div className="briefing-rules">
              <div><span>1</span><p><b>먼저 혼자 판단해요.</b><small>친구의 답을 보기 전에 내 생각을 기록해요.</small></p></div>
              <div><span>2</span><p><b>다른 생각을 존중해요.</b><small>정답보다 판단한 이유를 귀 기울여 들어요.</small></p></div>
              <div><span>3</span><p><b>생각은 바뀔 수 있어요.</b><small>토론 후 더 좋은 판단으로 바꾸는 건 멋진 일이에요.</small></p></div>
            </div>
            <button className="primary-button full" disabled={!nickname.trim()} onClick={() => setScreen("case")}>사건 파일 열기 <span>→</span></button>
          </div>
        </section>
      )}

      {screen === "case" && currentCase && (
        <section className="content-page page-enter">
          <CaseHeading item={currentCase} step="첫 판단" />
          <div className="case-layout">
            <article className="story-card">
              <div className="story-label">사건 현장</div>
              <h3>{currentCase.title}</h3>
              <p>{currentCase.scene}</p>
              <div className="evidence-box"><b>발견된 단서</b>{currentCase.evidence.map((clue, index) => <div key={clue}><span>{String(index + 1).padStart(2, "0")}</span>{clue}</div>)}</div>
            </article>
            <aside className="judgement-card">
              <div className="question-number">Q1</div>
              <h3>이 행동, 어떻게 판단할까요?</h3>
              <p>지금 내 생각과 가장 가까운 신호를 골라요.</p>
              <SignalPicker value={currentAnswer.firstSignal} onChange={(value) => patchAnswer({ firstSignal: value })} />
              <label className="input-label" htmlFor="reason">그렇게 판단한 까닭</label>
              <textarea id="reason" value={currentAnswer.reason ?? ""} onChange={(event) => patchAnswer({ reason: event.target.value.slice(0, 180) })} placeholder="누가 어떤 영향을 받을지 생각해 보세요." />
              <div className="char-count">{currentAnswer.reason?.length ?? 0}/180</div>
              <button className="primary-button full" disabled={!currentAnswer.firstSignal || (currentAnswer.reason?.trim().length ?? 0) < 5} onClick={() => setScreen("investigation")}>증거 조사 시작 <span>→</span></button>
            </aside>
          </div>
        </section>
      )}

      {screen === "investigation" && currentCase && (
        <section className="content-page page-enter">
          <CaseHeading item={currentCase} step="증거 조사" />
          <InvestigationBoard item={currentCase} answer={currentAnswer} onPatch={patchAnswer} onContinue={() => setScreen("discussion")} />
        </section>
      )}

      {screen === "discussion" && currentCase && (
        <section className="content-page page-enter">
          <CaseHeading item={currentCase} step="역할 토론" />
          <DiscussionMission item={currentCase} answer={currentAnswer} onPatch={patchAnswer} onComplete={() => setScreen("result")} />
        </section>
      )}

      {screen === "result" && currentCase && (
        <section className="content-page page-enter">
          <CaseHeading item={currentCase} step="최종 판단" />
          <div className="final-grid">
            <div className="final-question">
              <span className="section-kicker">다시 생각하기</span>
              <h2>토론 후 내 판단은?</h2>
              <p>처음과 달라도 괜찮아요. 더 깊이 생각했다는 증거예요.</p>
              <SignalPicker value={currentAnswer.finalSignal} onChange={(value) => patchAnswer({ finalSignal: value })} />
              {currentAnswer.finalSignal && <div className={`mind-change ${currentAnswer.firstSignal !== currentAnswer.finalSignal ? "changed" : ""}`}>{currentAnswer.firstSignal !== currentAnswer.finalSignal ? "생각이 바뀌었어요 — 멋진 성장!" : "판단을 유지했어요 — 근거가 더 단단해졌어요!"}</div>}
            </div>
            <div className="decision-panel">
              <div className="decision-block"><b>내 판단에 가장 영향을 준 단서</b><div className="clue-chips">{(currentAnswer.investigated ?? []).map((index) => { const step = currentCase.investigation[index]; return <button key={step.action} className={currentAnswer.influentialEvidence === index ? "selected" : ""} onClick={() => patchAnswer({ influentialEvidence: index })}><span>단서 {index + 1}</span>{step.source}</button>; })}</div></div>
              <div className="decision-block"><b>필요한 윤리 키워드 하나</b><div className="choice-chips">{currentCase.values.map((value) => <button key={value} className={currentAnswer.value === value ? "selected" : ""} onClick={() => patchAnswer({ value })}>{value}</button>)}</div></div>
              <div className="decision-block"><b>가장 좋은 해결 행동</b><div className="action-list">{currentCase.actions.map((action, index) => <button key={action} className={currentAnswer.action === action ? "selected" : ""} onClick={() => patchAnswer({ action })}><span>{String.fromCharCode(65 + index)}</span>{action}</button>)}</div></div>
            </div>
          </div>
          {currentAnswer.finalSignal && currentAnswer.influentialEvidence !== undefined && currentAnswer.value && currentAnswer.action && (
            <SolutionReveal item={currentCase} onNext={continueFromResult} isLast={caseIndex === ethicsCases.length - 1} />
          )}
        </section>
      )}

      {screen === "constitution" && (
        <section className="content-page page-enter">
          <div className="constitution-head"><span className="section-kicker">마지막 임무</span><h1>우리의 AI 윤리 헌법</h1><p>가장 중요하다고 생각하는 약속을 세 가지 이상 선택해요.</p></div>
          <div className="constitution-layout">
            <div className="rule-picker">
              {constitutionRules.map((rule, index) => (
                <button key={rule} className={selectedRules.includes(index) ? "selected" : ""} onClick={() => setSelectedRules((previous) => previous.includes(index) ? previous.filter((value) => value !== index) : [...previous, index])}><span>{selectedRules.includes(index) ? "✓" : index + 1}</span><p>{rule}</p></button>
              ))}
              <label className="input-label" htmlFor="custom-rule">우리가 직접 만드는 한 가지 약속 (선택)</label>
              <input id="custom-rule" value={customRule} onChange={(event) => setCustomRule(event.target.value.slice(0, 80))} placeholder="우리만의 약속을 적어 보세요." />
            </div>
            <ConstitutionPreview nickname={nickname} selectedRules={selectedRules} customRule={customRule} />
          </div>
          <div className="center-actions"><button className="primary-button large" disabled={selectedRules.length < 3} onClick={() => setScreen("complete")}>탐정 임무 완료 <span>→</span></button></div>
        </section>
      )}

      {screen === "complete" && (
        <section className="completion page-enter">
          <div className="confetti c1" /><div className="confetti c2" /><div className="confetti c3" /><div className="confetti c4" />
          <div className="completion-seal"><span>⌕</span><b>MISSION<br />COMPLETE</b></div>
          <span className="section-kicker">AI 윤리탐정 인증</span>
          <h1>{nickname} 탐정,<br />모든 사건을 해결했어요!</h1>
          <p>정답을 외운 것이 아니라, 다른 사람의 마음과 권리를 생각하며<br />스스로 판단하는 힘을 길렀습니다.</p>
          <div className="badge-row">{earnedBadges.map((badge) => <div key={badge.syllable}><strong>{badge.syllable}</strong><span>{badge.title}</span></div>)}</div>
          <div className="growth-card"><div><span>해결 사건</span><b>{earnedBadges.length}<small> / {ethicsCases.length}</small></b></div><div><span>생각의 성장</span><b>{changedMindCount}<small> 번</small></b></div><div><span>헌법 조항</span><b>{selectedRules.length + (customRule.trim() ? 1 : 0)}<small> 개</small></b></div></div>
          <GrowthReport answers={answers} />
          <div className="completion-actions"><button className="primary-button" onClick={() => window.print()}>인증서·헌법 인쇄</button><button className="ghost-button" onClick={resetMission}>새로 시작하기</button></div>
        </section>
      )}

      {showTeacher && <TeacherPanel onClose={() => setShowTeacher(false)} />}
    </main>
  );
}

function ProgressBar({ current }: { current: number }) {
  return <nav className="progress-wrap" aria-label="수업 진행 단계"><span>탐정 임무</span><div className="progress-track">{ethicsCases.map((item, index) => <div key={item.id} className={index < current ? "done" : index === current ? "active" : ""}><i>{index < current ? "✓" : index + 1}</i><small>{index === current ? item.category.split(" · ")[0] : `사건 ${index + 1}`}</small></div>)}<div className={current === ethicsCases.length ? "active" : ""}><i>★</i><small>윤리 헌법</small></div></div></nav>;
}

function CaseHeading({ item, step }: { item: (typeof ethicsCases)[number]; step: string }) {
  return <header className="case-heading"><div><span className="case-number">{item.caseNo}</span><span className="category-pill">{item.category}</span></div><h1>{item.title}</h1><p>{item.summary}</p><b>{step}</b></header>;
}

function SignalPicker({ value, onChange }: { value?: Signal; onChange: (signal: Signal) => void }) {
  return <div className="signal-picker">{signalOptions.map((option) => <button key={option.id} className={`${option.id} ${value === option.id ? "selected" : ""}`} onClick={() => onChange(option.id)} aria-pressed={value === option.id}><i>{option.icon}</i><span><b>{option.label}</b><small>{option.hint}</small></span></button>)}</div>;
}

function SolutionReveal({ item, onNext, isLast }: { item: (typeof ethicsCases)[number]; onNext: () => void; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  if (!open) return <div className="center-actions reveal-space"><button className="outline-button large" onClick={() => setOpen(true)}>탐정 해설 확인하기 <span>+</span></button></div>;
  return <div className="solution-card page-enter"><div className="solution-badge"><strong>{item.badge.syllable}</strong><span>{item.badge.title}</span></div><div><span className="section-kicker">사건 해결 보고서</span><h3>{item.solution}</h3><p><b>{item.badge.title}:</b> {item.badge.text}</p></div><button className="primary-button" onClick={onNext}>{isLast ? "AI 윤리 헌법 만들기" : "다음 사건으로"} <span>→</span></button></div>;
}

function ConstitutionPreview({ nickname, selectedRules, customRule }: { nickname: string; selectedRules: number[]; customRule: string }) {
  return <aside className="constitution-paper"><div className="paper-mark">AI</div><span>AI 윤리탐정단</span><h2>우리의 AI 윤리 헌법</h2><p className="paper-intro">우리는 AI를 편리함만 주는 정답 기계가 아니라, 책임 있게 사용해야 하는 도구로 생각하며 다음을 약속합니다.</p><ol>{selectedRules.map((index) => <li key={index}>{constitutionRules[index]}</li>)}{customRule.trim() && <li>{customRule.trim()}</li>}</ol>{selectedRules.length < 3 && <div className="paper-empty">왼쪽에서 약속을 3개 이상 선택해 주세요.</div>}<div className="signature"><span>AI 윤리탐정</span><b>{nickname || "새싹 탐정"}</b></div></aside>;
}

function TeacherPanel({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="teacher-panel" role="dialog" aria-modal="true" aria-labelledby="teacher-title"><button className="modal-close" onClick={onClose} aria-label="닫기">×</button><span className="section-kicker">교사용 빠른 안내</span><h2 id="teacher-title">40분 수업 운영안</h2><div className="lesson-timeline"><div><b>5분</b><span>도입</span><p>“AI가 확신하면 사실일까?” 질문 후 탐정 별명 만들기</p></div><div><b>18분</b><span>개인 판단</span><p>사건 1~2개를 골라 신호등 판단과 까닭 기록하기</p></div><div><b>10분</b><span>모둠 토론</span><p>피해자·사용자·탐정의 관점으로 말하고 재판단하기</p></div><div><b>7분</b><span>실천</span><p>학급 AI 윤리 헌법을 고르고 한 문장 소감 나누기</p></div></div><div className="teacher-notes"><h3>운영 원칙</h3><ul><li>정답 맞히기보다 판단의 근거와 타인에게 미치는 영향을 묻습니다.</li><li>학생이 판단을 바꾼 것을 오답으로 보지 않고 성찰의 증거로 인정합니다.</li><li>실명·사진·연락처를 입력하지 않습니다. 모든 기록은 현재 브라우저에만 저장됩니다.</li><li>모둠당 기기 한 대로도 운영할 수 있습니다.</li></ul></div><div className="standard-box"><b>2022 개정 교육과정 연계</b><p><strong>[6실05-05]</strong> 인공지능이 만들어지는 과정을 체험하고, 인공지능이 사회에 미치는 영향을 탐색한다.</p><p><strong>[6도02-03]</strong> 인간과 인공지능 로봇 간의 다양한 관계를 파악하고 도덕에 기반을 둔 관계 형성의 필요성을 탐구한다.</p></div><button className="primary-button full" onClick={onClose}>안내 확인</button></section></div>;
}
