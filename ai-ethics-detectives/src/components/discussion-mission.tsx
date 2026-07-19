"use client";

import { useEffect, useState } from "react";
import type { CaseAnswer } from "@/data/cases";
import { ethicsCases } from "@/data/cases";

const phases = [
  { title: "비밀 질문 열기", seconds: 45, guide: "질문을 읽고 사건에서 가장 수상한 점을 하나 찾아요." },
  { title: "단서 연결하기", seconds: 150, guide: "핵심 단서와 사건 속 사람의 마음을 연결해 이야기해요." },
  { title: "모둠 판결 준비", seconds: 75, guide: "우리 모둠이 제안할 가장 안전하고 정직한 행동을 정해요." },
] as const;

const challengeCards = [
  { code: "SOURCE", icon: "⌕", title: "출처 추적", question: "우리 판단을 뒷받침하는 가장 믿을 만한 단서는 무엇일까?" },
  { code: "HEART", icon: "♡", title: "마음 탐지", question: "이 일로 가장 불편하거나 속상할 사람은 누구일까?" },
  { code: "WHAT IF", icon: "?", title: "반대 단서", question: "우리 판단이 틀렸다면 어떤 일이 생길 수 있을까?" },
  { code: "ACTION", icon: "→", title: "해결 작전", question: "누구를 보호하며 무엇부터 바꾸면 좋을까?" },
] as const;

const activityMeta = [
  { code: "TRUTH LAB", title: "진짜·가짜 단서 감정소", teaser: "AI의 확신 속에 숨은 빈칸을 찾아라" },
  { code: "PRIVACY SOS", title: "긴급 개인정보 구조회의", teaser: "친구의 비밀이 퍼지기 전에 멈춰라" },
  { code: "RIGHTS OPS", title: "사진 권리 보호 작전", teaser: "웃음 뒤에 가려진 마음을 찾아라" },
  { code: "HONEST EDIT", title: "정직한 작품 편집회의", teaser: "사라진 AI 사용 흔적을 밝혀라" },
] as const;

type DiscussionMissionProps = {
  item: (typeof ethicsCases)[number];
  answer: CaseAnswer;
  onPatch: (patch: Partial<CaseAnswer>) => void;
  onComplete: () => void;
};

export function DiscussionMission({ item, answer, onPatch, onComplete }: DiscussionMissionProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(phases[0].seconds);
  const [running, setRunning] = useState(false);
  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState<number>();
  const phase = phases[phaseIndex];
  const meta = activityMeta[item.id - 1] ?? activityMeta[0];
  const investigated = answer.investigated ?? [];

  useEffect(() => {
    if (!running || secondsLeft === 0) return;
    const timer = window.setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setRunning(false);
      } else {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [running, secondsLeft]);

  function movePhase(nextIndex: number) {
    setPhaseIndex(nextIndex);
    setSecondsLeft(phases[nextIndex].seconds);
    setRunning(false);
  }

  function assignRandomLens() {
    onPatch({ roleIndex: Math.floor(Math.random() * item.viewpoints.length) });
  }

  function toggleTimer() {
    if (secondsLeft === 0) {
      setSecondsLeft(phase.seconds);
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const progress = ((phase.seconds - secondsLeft) / phase.seconds) * 100;
  const ready = questionRevealed && challengeIndex !== undefined && answer.roleIndex !== undefined;

  return (
    <>
      <section className={`council-hero ${questionRevealed ? "revealed" : ""}`}>
        <div className="council-radar" aria-hidden="true"><i /><i /><i /></div>
        <div className="council-copy">
          <div className="council-live"><i aria-hidden="true" /> LIVE MISSION · {meta.code}</div>
          <span>이번 사건의 수사 방식</span>
          <h2>{meta.title}</h2>
          <p>{meta.teaser}</p>
        </div>
        <button className="secret-question" onClick={() => setQuestionRevealed(true)} aria-expanded={questionRevealed}>
          <span className="secret-tab">TOP SECRET</span>
          {!questionRevealed ? (
            <><i aria-hidden="true">?</i><b>비밀 질문 열기</b><small>눌러서 봉인을 해제하세요</small></>
          ) : (
            <><i aria-hidden="true">!</i><b>{item.discuss}</b><small>이 질문을 단서와 연결해 보세요</small></>
          )}
        </button>
      </section>

      <section className="case-evidence-board">
        <div className="board-heading">
          <div><span className="section-kicker">EVIDENCE BOARD</span><h2>어떤 단서가 사건의 방향을 바꿀까요?</h2></div>
          <span className="board-status"><i aria-hidden="true" /> {investigated.length}개 확보</span>
        </div>
        <div className="evidence-string" aria-hidden="true" />
        <div className="board-notes">
          {investigated.map((index) => {
            const evidence = item.investigation[index];
            const selected = answer.influentialEvidence === index;
            return (
              <button key={evidence.action} className={selected ? "selected" : ""} onClick={() => onPatch({ influentialEvidence: index })} aria-pressed={selected}>
                <span>단서 {String(index + 1).padStart(2, "0")}</span>
                <b>{evidence.source}</b>
                <p>{evidence.clue}</p>
                <strong>{selected ? "✓ 핵심 단서로 연결됨" : "핵심 단서로 연결하기 +"}</strong>
              </button>
            );
          })}
          <div className="board-mystery-note" aria-hidden="true"><span>?</span><b>우리가 놓친 사람은<br />없을까?</b></div>
        </div>
      </section>

      <section className="lens-assignment">
        <div className="role-assignment-head">
          <div><span className="section-kicker">CASE LENS</span><h2>사건을 바라볼 렌즈를 하나 골라요</h2><p>같은 사건도 누구의 눈으로 보느냐에 따라 새로운 단서가 보여요.</p></div>
          <button className="ghost-button" onClick={assignRandomLens}>렌즈 무작위 뽑기 ↻</button>
        </div>
        <div className="viewpoint-grid curiosity-lenses">
          {item.viewpoints.map((viewpoint, index) => (
            <button key={viewpoint.role} className={answer.roleIndex === index ? "selected" : ""} onClick={() => onPatch({ roleIndex: index })} aria-pressed={answer.roleIndex === index}>
              <span className="role-number">LENS 0{index + 1}</span>
              <span className="role-icon" aria-hidden="true">{["◒", "◇", "⌕"][index]}</span>
              <b>{viewpoint.role}의 눈</b>
              <p>{viewpoint.question}</p>
              <strong>{answer.roleIndex === index ? "✓ 렌즈 장착 완료" : "이 렌즈로 관찰하기"}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="challenge-deck">
        <div className="challenge-heading"><span className="section-kicker">DOUBT CARD</span><h2>의심 카드 한 장을 뒤집어 보세요</h2><p>친구의 의견을 공격하지 않고, 더 깊게 생각하게 하는 질문이에요.</p></div>
        <div className="challenge-cards">
          {challengeCards.map((card, index) => (
            <button key={card.code} className={challengeIndex === index ? "selected" : ""} onClick={() => setChallengeIndex(index)} aria-pressed={challengeIndex === index}>
              <span>{card.code}</span><i aria-hidden="true">{card.icon}</i><b>{card.title}</b>
              <p>{challengeIndex === index ? card.question : "카드를 눌러 질문을 확인하세요"}</p>
              <strong>{challengeIndex === index ? "질문 공개!" : "뒤집기"}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="discussion-timer council-timer" aria-label="수사회의 타이머">
        <div className="timer-phase-list">{phases.map((itemPhase, index) => <button key={itemPhase.title} className={phaseIndex === index ? "active" : phaseIndex > index ? "done" : ""} onClick={() => movePhase(index)}><span>{phaseIndex > index ? "✓" : index + 1}</span>{itemPhase.title}</button>)}</div>
        <div className="timer-main">
          <div><span className="section-kicker"><i aria-hidden="true" />MISSION {phaseIndex + 1}</span><h3>{phase.guide}</h3></div>
          <time aria-live="polite">{minutes}:{seconds}</time>
        </div>
        <div className="timer-track"><i style={{ width: `${progress}%` }} /></div>
        <div className="timer-actions">
          <button className="ghost-button" onClick={() => { setSecondsLeft(phase.seconds); setRunning(false); }}>처음으로</button>
          <button className="primary-button" onClick={toggleTimer}>{running ? "잠시 멈춤" : secondsLeft === 0 ? "다시 시작" : "타이머 시작"}</button>
          {phaseIndex < phases.length - 1 && <button className="outline-button" onClick={() => movePhase(phaseIndex + 1)}>다음 작전 →</button>}
        </div>
      </section>

      <div className="council-ready" role="status">
        <div className={questionRevealed ? "done" : ""}><span>{questionRevealed ? "✓" : "1"}</span>비밀 질문</div>
        <i aria-hidden="true" />
        <div className={answer.roleIndex !== undefined ? "done" : ""}><span>{answer.roleIndex !== undefined ? "✓" : "2"}</span>사건 렌즈</div>
        <i aria-hidden="true" />
        <div className={challengeIndex !== undefined ? "done" : ""}><span>{challengeIndex !== undefined ? "✓" : "3"}</span>의심 카드</div>
      </div>
      <div className="center-actions"><button className="primary-button large" disabled={!ready} onClick={onComplete}>모둠 판결 준비 완료 <span>→</span></button></div>
    </>
  );
}
