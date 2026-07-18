"use client";

import { useEffect, useState } from "react";
import type { CaseAnswer } from "@/data/cases";
import { ethicsCases } from "@/data/cases";

const phases = [
  { title: "혼자 생각하기", seconds: 60, guide: "내 역할의 입장에서 중요한 점을 한 가지 정해요." },
  { title: "역할 토론하기", seconds: 180, guide: "주장과 까닭을 말하고 다른 역할의 의견을 들어요." },
  { title: "최종 의견 정리", seconds: 60, guide: "친구의 의견을 반영해 마지막 판단을 준비해요." },
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
  const phase = phases[phaseIndex];

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

  function assignRandomRole() {
    onPatch({ roleIndex: Math.floor(Math.random() * item.viewpoints.length) });
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const progress = ((phase.seconds - secondsLeft) / phase.seconds) * 100;

  return (
    <>
      <div className="discussion-hero">
        <div className="talk-icon" aria-hidden="true">“</div>
        <div><span>모둠 토론 질문</span><h2>{item.discuss}</h2></div>
      </div>

      <section className="role-assignment">
        <div className="role-assignment-head"><div><span className="section-kicker">역할 카드</span><h2>누구의 눈으로 사건을 볼까요?</h2></div><button className="ghost-button" onClick={assignRandomRole}>무작위 역할 뽑기 ↻</button></div>
        <div className="viewpoint-grid">
          {item.viewpoints.map((viewpoint, index) => (
            <button key={viewpoint.role} className={answer.roleIndex === index ? "selected" : ""} onClick={() => onPatch({ roleIndex: index })} aria-pressed={answer.roleIndex === index}>
              <span className="role-number">0{index + 1}</span><span className="role-icon" aria-hidden="true">{["◒", "◇", "⌕"][index]}</span><b>{viewpoint.role}의 눈</b><p>{viewpoint.question}</p>{answer.roleIndex === index && <strong>나의 역할</strong>}
            </button>
          ))}
        </div>
      </section>

      <section className="discussion-timer" aria-label="토론 타이머">
        <div className="timer-phase-list">{phases.map((itemPhase, index) => <button key={itemPhase.title} className={phaseIndex === index ? "active" : phaseIndex > index ? "done" : ""} onClick={() => movePhase(index)}><span>{phaseIndex > index ? "✓" : index + 1}</span>{itemPhase.title}</button>)}</div>
        <div className="timer-main">
          <div><span className="section-kicker">{phase.title}</span><h3>{phase.guide}</h3></div>
          <time aria-live="polite">{minutes}:{seconds}</time>
        </div>
        <div className="timer-track"><i style={{ width: `${progress}%` }} /></div>
        <div className="timer-actions">
          <button className="ghost-button" onClick={() => { setSecondsLeft(phase.seconds); setRunning(false); }}>처음으로</button>
          <button className="primary-button" onClick={() => setRunning((value) => !value)}>{running ? "잠시 멈춤" : secondsLeft === 0 ? "다시 시작" : "타이머 시작"}</button>
          {phaseIndex < phases.length - 1 && <button className="outline-button" onClick={() => movePhase(phaseIndex + 1)}>다음 단계 →</button>}
        </div>
      </section>

      <div className="discussion-tip"><b>탐정 대화법</b><span>“나는 ___ 때문에 ___라고 생각해.”</span><span>“네 말을 듣고 ___을 새롭게 알았어.”</span></div>
      <div className="center-actions"><button className="primary-button large" disabled={answer.roleIndex === undefined} onClick={onComplete}>토론을 마쳤어요 <span>→</span></button></div>
    </>
  );
}
