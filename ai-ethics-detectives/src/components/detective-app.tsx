"use client";

import { useEffect, useMemo, useState } from "react";
import { constitutionRules, ethicsCases, type Signal } from "@/data/cases";

type Screen = "home" | "briefing" | "case" | "discussion" | "result" | "constitution" | "complete";

type CaseAnswer = {
  firstSignal?: Signal;
  finalSignal?: Signal;
  reason?: string;
  value?: string;
  action?: string;
};

type SavedProgress = {
  nickname?: string;
  caseIndex?: number;
  answers?: Record<number, CaseAnswer>;
  selectedRules?: number[];
  customRule?: string;
};

const signalOptions: { id: Signal; label: string; hint: string; icon: string }[] = [
  { id: "green", label: "珥덈줉", hint: "洹몃?濡??대룄 愿쒖갖?꾩슂", icon: "?? },
  { id: "yellow", label: "?몃옉", hint: "?뺤씤?섍굅???덈씫???꾩슂?댁슂", icon: "!" },
  { id: "red", label: "鍮④컯", hint: "硫덉텛怨?諛붾줈?≪븘???댁슂", icon: "횞" },
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
    if (!window.confirm("??λ맂 ?먯젙 湲곕줉??紐⑤몢 吏?곌퀬 泥섏쓬遺???쒖옉?좉퉴??")) return;
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
        <button className="brand" onClick={() => setScreen("home")} aria-label="泥섏쓬 ?붾㈃?쇰줈 ?대룞">
          <span className="brand-mark" aria-hidden="true">??/span>
          <span><b>AI ?ㅻ━?먯젙??/b><small>硫?쨌 ??쨌 ??쨌 諛?/small></span>
        </button>
        <div className="header-actions">
          {screen !== "home" && <span className="mini-id">?먯젙 {nickname || "?덉떦"}</span>}
          <button className="ghost-button" onClick={() => setShowTeacher(true)}>援먯궗???덈궡</button>
        </div>
      </header>

      {screen !== "home" && screen !== "briefing" && screen !== "complete" && (
        <ProgressBar current={screen === "constitution" ? ethicsCases.length : caseIndex} />
      )}

      {screen === "home" && (
        <section className="hero page-enter">
          <div className="hero-copy">
            <div className="eyebrow"><span>??/span> AI ?쒕???泥?踰덉㎏ ?쒕? ?섏뾽</div>
            <h1>AI媛 留먰븯硫?br /><em>?꾨? 誘우뼱???좉퉴?</em></h1>
            <p className="hero-lead">??媛쒖쓽 ?섏긽???ш굔???닿껐?섎ŉ<br className="desktop-break" /> ?덉쟾?섍퀬 ?뺤쭅??AI ?ъ슜踰뺤쓣 李얠븘蹂댁꽭??</p>
            <div className="hero-actions">
              <button className="primary-button large" onClick={startMission}>?먯젙 ?꾨Т ?쒖옉 <span>??/span></button>
              <button className="text-button" onClick={() => setShowTeacher(true)}>40遺??섏뾽 ?댁쁺踰?蹂닿린</button>
            </div>
            <div className="privacy-note"><span aria-hidden="true">??/span> ?ㅻ챸?? 濡쒓렇?몃룄 ?꾩슂 ?놁뼱?? 湲곕줉? ??湲곌린?먮쭔 ??λ맗?덈떎.</div>
          </div>
          <div className="hero-visual" aria-label="AI ?ㅻ━ ?ш굔 ?뚯씪 ?쇰윭?ㅽ듃">
            <div className="case-file back-file"><span>TOP SECRET</span></div>
            <div className="case-file main-file">
              <div className="file-top"><span>?ш굔 ?뚯씪</span><b>#AI-042</b></div>
              <div className="robot-face"><i /><div className="eyes"><span /><span /></div><div className="mouth" /></div>
              <div className="scan-line" />
              <div className="file-stamp">?먮떒 蹂대쪟</div>
              <div className="file-clips"><i /><i /><i /></div>
            </div>
            <div className="magnifier"><span /></div>
            <div className="floating-chip chip-one">?ъ떎 ?뺤씤</div>
            <div className="floating-chip chip-two">媛쒖씤?뺣낫</div>
          </div>
          <div className="method-strip">
            {[
              ["硫?, "媛쒖씤?뺣낫?쇰㈃"], ["??, "?쇳빐媛 ?녿뒗吏"], ["??, "?ъ떎怨?異쒖쿂瑜?], ["諛?, "AI ?ъ슜 ?ъ떎??],
            ].map(([letter, text]) => (
              <div className="method-item" key={letter}><strong>{letter}</strong><span>{text}<b>{letter === "硫? ? "硫덉떠?? : letter === "?? ? "?댄렣?? : letter === "?? ? "?뺤씤?댁슂" : "諛앺???}</b></span></div>
            ))}
          </div>
        </section>
      )}

      {screen === "briefing" && (
        <section className="content-page compact page-enter">
          <div className="briefing-card">
            <span className="section-kicker">?먯젙 ?깅줉</span>
            <h2>?ш굔 ?꾩옣???ㅼ뼱媛?以鍮꾧? ?먮굹??</h2>
            <p>?ㅻ챸 ????ㅻ뒛 ?ъ슜???먯젙 蹂꾨챸???곸뼱二쇱꽭??</p>
            <label className="input-label" htmlFor="nickname">?섏쓽 ?먯젙 蹂꾨챸</label>
            <div className="input-row">
              <input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 12))} placeholder="?? 蹂꾨튆 ?먯젙" autoComplete="off" />
              <button className="dice-button" onClick={() => setNickname(["蹂꾨튆 ?먯젙", "吏???먯젙", "珥덈줉 遺?됱씠", "吏꾩떎 ?섏묠諛?][Math.floor(Math.random() * 4)])} aria-label="蹂꾨챸 臾댁옉??留뚮뱾湲?>??/button>
            </div>
            <div className="briefing-rules">
              <div><span>1</span><p><b>癒쇱? ?쇱옄 ?먮떒?댁슂.</b><small>移쒓뎄???듭쓣 蹂닿린 ?꾩뿉 ???앷컖??湲곕줉?댁슂.</small></p></div>
              <div><span>2</span><p><b>?ㅻⅨ ?앷컖??議댁쨷?댁슂.</b><small>?뺣떟蹂대떎 ?먮떒???댁쑀瑜?洹 湲곗슱???ㅼ뼱??</small></p></div>
              <div><span>3</span><p><b>?앷컖? 諛붾????덉뼱??</b><small>?좊줎 ????醫뗭? ?먮떒?쇰줈 諛붽씀??嫄?硫뗭쭊 ?쇱씠?먯슂.</small></p></div>
            </div>
            <button className="primary-button full" disabled={!nickname.trim()} onClick={() => setScreen("case")}>?ш굔 ?뚯씪 ?닿린 <span>??/span></button>
          </div>
        </section>
      )}

      {screen === "case" && currentCase && (
        <section className="content-page page-enter">
          <CaseHeading item={currentCase} step="泥??먮떒" />
          <div className="case-layout">
            <article className="story-card">
              <div className="story-label">?ш굔 ?꾩옣</div>
              <h3>{currentCase.title}</h3>
              <p>{currentCase.scene}</p>
              <div className="evidence-box"><b>諛쒓껄???⑥꽌</b>{currentCase.evidence.map((clue, index) => <div key={clue}><span>{String(index + 1).padStart(2, "0")}</span>{clue}</div>)}</div>
            </article>
            <aside className="judgement-card">
              <div className="question-number">Q1</div>
              <h3>???됰룞, ?대뼸寃??먮떒?좉퉴??</h3>
              <p>吏湲????앷컖怨?媛??媛源뚯슫 ?좏샇瑜?怨⑤씪??</p>
              <SignalPicker value={currentAnswer.firstSignal} onChange={(value) => patchAnswer({ firstSignal: value })} />
              <label className="input-label" htmlFor="reason">洹몃젃寃??먮떒??源뚮떗</label>
              <textarea id="reason" value={currentAnswer.reason ?? ""} onChange={(event) => patchAnswer({ reason: event.target.value.slice(0, 180) })} placeholder="?꾧? ?대뼡 ?곹뼢??諛쏆쓣吏 ?앷컖??蹂댁꽭??" />
              <div className="char-count">{currentAnswer.reason?.length ?? 0}/180</div>
              <button className="primary-button full" disabled={!currentAnswer.firstSignal || (currentAnswer.reason?.trim().length ?? 0) < 5} onClick={() => setScreen("discussion")}>?좊줎 ?⑥꽌 諛쏄린 <span>??/span></button>
            </aside>
          </div>
        </section>
      )}

      {screen === "discussion" && currentCase && (
        <section className="content-page page-enter">
          <CaseHeading item={currentCase} step="?앷컖 ?섎늻湲? />
          <div className="discussion-hero">
            <div className="talk-icon" aria-hidden="true">??/div>
            <div><span>紐⑤몺 ?좊줎 吏덈Ц</span><h2>{currentCase.discuss}</h2></div>
          </div>
          <div className="viewpoint-grid">
            {currentCase.viewpoints.map((viewpoint, index) => (
              <article key={viewpoint.role}><span className="role-number">0{index + 1}</span><div className="role-icon" aria-hidden="true">{["??, "??, "??][index]}</div><b>{viewpoint.role}????/b><p>{viewpoint.question}</p></article>
            ))}
          </div>
          <div className="discussion-tip"><b>?먯젙 ??붾쾿</b><span>?쒕굹??___ ?뚮Ц??___?쇨퀬 ?앷컖????/span><span>?쒕꽕 留먯쓣 ?ｊ퀬 ___???덈∼寃??뚯븯????/span></div>
          <div className="center-actions"><button className="primary-button large" onClick={() => setScreen("result")}>?좊줎??留덉낀?댁슂 <span>??/span></button></div>
        </section>
      )}

      {screen === "result" && currentCase && (
        <section className="content-page page-enter">
          <CaseHeading item={currentCase} step="理쒖쥌 ?먮떒" />
          <div className="final-grid">
            <div className="final-question">
              <span className="section-kicker">?ㅼ떆 ?앷컖?섍린</span>
              <h2>?좊줎 ?????먮떒??</h2>
              <p>泥섏쓬怨??щ씪??愿쒖갖?꾩슂. ??源딆씠 ?앷컖?덈떎??利앷굅?덉슂.</p>
              <SignalPicker value={currentAnswer.finalSignal} onChange={(value) => patchAnswer({ finalSignal: value })} />
              {currentAnswer.finalSignal && <div className={`mind-change ${currentAnswer.firstSignal !== currentAnswer.finalSignal ? "changed" : ""}`}>{currentAnswer.firstSignal !== currentAnswer.finalSignal ? "?앷컖??諛붾뚯뿀?댁슂 ??硫뗭쭊 ?깆옣!" : "?먮떒???좎??덉뼱????洹쇨굅媛 ???⑤떒?댁죱?댁슂!"}</div>}
            </div>
            <div className="decision-panel">
              <div className="decision-block"><b>?꾩슂???ㅻ━ ?ㅼ썙???섎굹</b><div className="choice-chips">{currentCase.values.map((value) => <button key={value} className={currentAnswer.value === value ? "selected" : ""} onClick={() => patchAnswer({ value })}>{value}</button>)}</div></div>
              <div className="decision-block"><b>媛??醫뗭? ?닿껐 ?됰룞</b><div className="action-list">{currentCase.actions.map((action, index) => <button key={action} className={currentAnswer.action === action ? "selected" : ""} onClick={() => patchAnswer({ action })}><span>{String.fromCharCode(65 + index)}</span>{action}</button>)}</div></div>
            </div>
          </div>
          {currentAnswer.finalSignal && currentAnswer.value && currentAnswer.action && (
            <SolutionReveal item={currentCase} onNext={continueFromResult} isLast={caseIndex === ethicsCases.length - 1} />
          )}
        </section>
      )}

      {screen === "constitution" && (
        <section className="content-page page-enter">
          <div className="constitution-head"><span className="section-kicker">留덉?留??꾨Т</span><h1>?곕━??AI ?ㅻ━ ?뚮쾿</h1><p>媛??以묒슂?섎떎怨??앷컖?섎뒗 ?쎌냽????媛吏 ?댁긽 ?좏깮?댁슂.</p></div>
          <div className="constitution-layout">
            <div className="rule-picker">
              {constitutionRules.map((rule, index) => (
                <button key={rule} className={selectedRules.includes(index) ? "selected" : ""} onClick={() => setSelectedRules((previous) => previous.includes(index) ? previous.filter((value) => value !== index) : [...previous, index])}><span>{selectedRules.includes(index) ? "?? : index + 1}</span><p>{rule}</p></button>
              ))}
              <label className="input-label" htmlFor="custom-rule">?곕━媛 吏곸젒 留뚮뱶????媛吏 ?쎌냽 (?좏깮)</label>
              <input id="custom-rule" value={customRule} onChange={(event) => setCustomRule(event.target.value.slice(0, 80))} placeholder="?곕━留뚯쓽 ?쎌냽???곸뼱 蹂댁꽭??" />
            </div>
            <ConstitutionPreview nickname={nickname} selectedRules={selectedRules} customRule={customRule} />
          </div>
          <div className="center-actions"><button className="primary-button large" disabled={selectedRules.length < 3} onClick={() => setScreen("complete")}>?먯젙 ?꾨Т ?꾨즺 <span>??/span></button></div>
        </section>
      )}

      {screen === "complete" && (
        <section className="completion page-enter">
          <div className="confetti c1" /><div className="confetti c2" /><div className="confetti c3" /><div className="confetti c4" />
          <div className="completion-seal"><span>??/span><b>MISSION<br />COMPLETE</b></div>
          <span className="section-kicker">AI ?ㅻ━?먯젙 ?몄쬆</span>
          <h1>{nickname} ?먯젙,<br />紐⑤뱺 ?ш굔???닿껐?덉뼱??</h1>
          <p>?뺣떟???몄슫 寃껋씠 ?꾨땲?? ?ㅻⅨ ?щ엺??留덉쓬怨?沅뚮━瑜??앷컖?섎ŉ<br />?ㅼ뒪濡??먮떒?섎뒗 ?섏쓣 湲몃??듬땲??</p>
          <div className="badge-row">{earnedBadges.map((badge) => <div key={badge.syllable}><strong>{badge.syllable}</strong><span>{badge.title}</span></div>)}</div>
          <div className="growth-card"><div><span>?닿껐 ?ш굔</span><b>{earnedBadges.length}<small> / {ethicsCases.length}</small></b></div><div><span>?앷컖???깆옣</span><b>{changedMindCount}<small> 踰?/small></b></div><div><span>?뚮쾿 議고빆</span><b>{selectedRules.length + (customRule.trim() ? 1 : 0)}<small> 媛?/small></b></div></div>
          <div className="completion-actions"><button className="primary-button" onClick={() => window.print()}>?몄쬆?쑣룻뿄踰??몄뇙</button><button className="ghost-button" onClick={resetMission}>?덈줈 ?쒖옉?섍린</button></div>
        </section>
      )}

      {showTeacher && <TeacherPanel onClose={() => setShowTeacher(false)} />}
    </main>
  );
}

function ProgressBar({ current }: { current: number }) {
  return <nav className="progress-wrap" aria-label="?섏뾽 吏꾪뻾 ?④퀎"><span>?먯젙 ?꾨Т</span><div className="progress-track">{ethicsCases.map((item, index) => <div key={item.id} className={index < current ? "done" : index === current ? "active" : ""}><i>{index < current ? "?? : index + 1}</i><small>{index === current ? item.category.split(" 쨌 ")[0] : `?ш굔 ${index + 1}`}</small></div>)}<div className={current === ethicsCases.length ? "active" : ""}><i>??/i><small>?ㅻ━ ?뚮쾿</small></div></div></nav>;
}

function CaseHeading({ item, step }: { item: (typeof ethicsCases)[number]; step: string }) {
  return <header className="case-heading"><div><span className="case-number">{item.caseNo}</span><span className="category-pill">{item.category}</span></div><h1>{item.title}</h1><p>{item.summary}</p><b>{step}</b></header>;
}

function SignalPicker({ value, onChange }: { value?: Signal; onChange: (signal: Signal) => void }) {
  return <div className="signal-picker">{signalOptions.map((option) => <button key={option.id} className={`${option.id} ${value === option.id ? "selected" : ""}`} onClick={() => onChange(option.id)} aria-pressed={value === option.id}><i>{option.icon}</i><span><b>{option.label}</b><small>{option.hint}</small></span></button>)}</div>;
}

function SolutionReveal({ item, onNext, isLast }: { item: (typeof ethicsCases)[number]; onNext: () => void; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  if (!open) return <div className="center-actions reveal-space"><button className="outline-button large" onClick={() => setOpen(true)}>?먯젙 ?댁꽕 ?뺤씤?섍린 <span>+</span></button></div>;
  return <div className="solution-card page-enter"><div className="solution-badge"><strong>{item.badge.syllable}</strong><span>{item.badge.title}</span></div><div><span className="section-kicker">?ш굔 ?닿껐 蹂닿퀬??/span><h3>{item.solution}</h3><p><b>{item.badge.title}:</b> {item.badge.text}</p></div><button className="primary-button" onClick={onNext}>{isLast ? "AI ?ㅻ━ ?뚮쾿 留뚮뱾湲? : "?ㅼ쓬 ?ш굔?쇰줈"} <span>??/span></button></div>;
}

function ConstitutionPreview({ nickname, selectedRules, customRule }: { nickname: string; selectedRules: number[]; customRule: string }) {
  return <aside className="constitution-paper"><div className="paper-mark">AI</div><span>AI ?ㅻ━?먯젙??/span><h2>?곕━??AI ?ㅻ━ ?뚮쾿</h2><p className="paper-intro">?곕━??AI瑜??몃━?⑤쭔 二쇰뒗 ?뺣떟 湲곌퀎媛 ?꾨땲?? 梨낆엫 ?덇쾶 ?ъ슜?댁빞 ?섎뒗 ?꾧뎄濡??앷컖?섎ŉ ?ㅼ쓬???쎌냽?⑸땲??</p><ol>{selectedRules.map((index) => <li key={index}>{constitutionRules[index]}</li>)}{customRule.trim() && <li>{customRule.trim()}</li>}</ol>{selectedRules.length < 3 && <div className="paper-empty">?쇱そ?먯꽌 ?쎌냽??3媛??댁긽 ?좏깮??二쇱꽭??</div>}<div className="signature"><span>AI ?ㅻ━?먯젙</span><b>{nickname || "?덉떦 ?먯젙"}</b></div></aside>;
}

function TeacherPanel({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="teacher-panel" role="dialog" aria-modal="true" aria-labelledby="teacher-title"><button className="modal-close" onClick={onClose} aria-label="?リ린">횞</button><span className="section-kicker">援먯궗??鍮좊Ⅸ ?덈궡</span><h2 id="teacher-title">40遺??섏뾽 ?댁쁺??/h2><div className="lesson-timeline"><div><b>5遺?/b><span>?꾩엯</span><p>?쏛I媛 ?뺤떊?섎㈃ ?ъ떎?쇨퉴???吏덈Ц ???먯젙 蹂꾨챸 留뚮뱾湲?/p></div><div><b>18遺?/b><span>媛쒖씤 ?먮떒</span><p>?ш굔 1~2媛쒕? 怨⑤씪 ?좏샇???먮떒怨?源뚮떗 湲곕줉?섍린</p></div><div><b>10遺?/b><span>紐⑤몺 ?좊줎</span><p>?쇳빐?먃룹궗?⑹옄쨌?먯젙??愿?먯쑝濡?留먰븯怨??ы뙋?⑦븯湲?/p></div><div><b>7遺?/b><span>?ㅼ쿇</span><p>?숆툒 AI ?ㅻ━ ?뚮쾿??怨좊Ⅴ怨???臾몄옣 ?뚭컧 ?섎늻湲?/p></div></div><div className="teacher-notes"><h3>?댁쁺 ?먯튃</h3><ul><li>?뺣떟 留욏엳湲곕낫???먮떒??洹쇨굅? ??몄뿉寃?誘몄튂???곹뼢??臾살뒿?덈떎.</li><li>?숈깮???먮떒??諛붽씔 寃껋쓣 ?ㅻ떟?쇰줈 蹂댁? ?딄퀬 ?깆같??利앷굅濡??몄젙?⑸땲??</li><li>?ㅻ챸쨌?ъ쭊쨌?곕씫泥섎? ?낅젰?섏? ?딆뒿?덈떎. 紐⑤뱺 湲곕줉? ?꾩옱 釉뚮씪?곗??먮쭔 ??λ맗?덈떎.</li><li>紐⑤몺??湲곌린 ???濡쒕룄 ?댁쁺?????덉뒿?덈떎.</li></ul></div><div className="standard-box"><b>2022 媛쒖젙 援먯쑁怨쇱젙 ?곌퀎</b><p><strong>[6??5-05]</strong> ?멸났吏?μ씠 留뚮뱾?댁???怨쇱젙??泥댄뿕?섍퀬, ?멸났吏?μ씠 ?ы쉶??誘몄튂???곹뼢???먯깋?쒕떎.</p><p><strong>[6??2-03]</strong> ?멸컙怨??멸났吏??濡쒕큸 媛꾩쓽 ?ㅼ뼇??愿怨꾨? ?뚯븙?섍퀬 ?꾨뜒??湲곕컲????愿怨??뺤꽦???꾩슂?깆쓣 ?먭뎄?쒕떎.</p></div><button className="primary-button full" onClick={onClose}>?덈궡 ?뺤씤</button></section></div>;
}
