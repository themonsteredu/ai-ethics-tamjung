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
const nicknames = ["蹂꾨튆 ?먯젙", "吏꾩떎 ?섏궗愿", "留덉쓬 ?먯젙", "珥덈줉 ?뗫낫湲?, "?⑷린 ?먯젙"];

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
    if (!window.confirm("??λ맂 ?먯젙 湲곕줉??紐⑤몢 吏?곌퀬 泥섏쓬遺???쒖옉?좉퉴??")) return;
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
        <button className="brand" onClick={() => go("home")} aria-label="AI ?ㅻ━?먯젙??泥섏쓬 ?붾㈃?쇰줈 ?대룞">
          <span className="brand-mark" aria-hidden="true">??/span>
          <span><b>AI ?ㅻ━?먯젙??/b><small>?ъ떎 쨌 ?щ엺 쨌 媛移?쨌 ?됰룞</small></span>
        </button>
        <div className="header-actions">
          {screen !== "home" && <span className="detective-id">?먯젙 {nickname || "?곗닔??}</span>}
          <a className="header-link" href="/worksheets" target="_blank" rel="noreferrer">?섏뾽 ?쒕룞吏</a>
          <button className="header-button" onClick={() => setTeacherOpen(true)}>援먯궗???덈궡</button>
        </div>
      </header>

      {showCaseProgress && <CaseProgress caseIndex={caseIndex} screen={screen} />}

      {screen === "home" && <HomeScreen onStart={() => go("setup")} onTeacher={() => setTeacherOpen(true)} />}

      {screen === "setup" && (
        <section className="setup-page page-enter">
          <div className="setup-intro">
            <span className="page-label">?먯젙 ?깅줉</span>
            <h1>?ш굔???닿껐?섍린 ?꾩뿉<br />?먮떒 ?쒖꽌遺???듯???</h1>
            <p>AI ?ㅻ━?먯젙? ?뺣떟??鍮⑤━ 留욏엳???щ엺???꾨땲?? ?щ엺怨?洹쇨굅瑜??앷컖?섎ŉ ???섏? ?됰룞??李얜뒗 ?щ엺?낅땲??</p>
          </div>
          <div className="thinking-route" aria-label="?ㅻ━ ?먮떒 ???④퀎">
            <ThinkingStep number="1" title="?ъ떎" text="臾댁뒯 ?쇱씠 ?덉뿀?섏슂?" />
            <ThinkingStep number="2" title="?щ엺" text="?꾧? ?곹뼢??諛쏅굹??" />
            <ThinkingStep number="3" title="媛移? text="臾댁뾿??吏耳쒖빞 ?섎굹??" />
            <ThinkingStep number="4" title="?됰룞" text="?대뼸寃?諛붽씀硫?醫뗭쓣源뚯슂?" />
          </div>
          <div className="nickname-card">
            <label htmlFor="nickname">?ㅻ뒛 ?ъ슜???먯젙 蹂꾨챸</label>
            <div><input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 12))} placeholder="?? 蹂꾨튆 ?먯젙" autoComplete="off" /><button onClick={() => setNickname(nicknames[Math.floor(Math.random() * nicknames.length)])} aria-label="?먯젙 蹂꾨챸 臾댁옉??留뚮뱾湲?>??/button></div>
            <small>?ㅻ챸? ?곗? ?딆븘???⑸땲?? 湲곕줉? ??湲곌린?먮쭔 ??λ맗?덈떎.</small>
          </div>
          <button className="primary-button large" disabled={!nickname.trim()} onClick={() => { setCaseIndex(0); go("scene"); }}>泥??ш굔 留뚮굹湲?<span>??/span></button>
        </section>
      )}

      {screen === "scene" && (
        <CasePage item={item} caseIndex={caseIndex} stage="?ш굔 ?댄빐">
          <LearningTarget question={item.question} principle={item.principle} />
          <section className="scene-layout">
            <article className="case-story">
              <div className="case-story-head"><span>{item.caseNo}</span><b>{item.topic}</b></div>
              <h1>{item.title}</h1>
              <p>{item.scene}</p>
            </article>
            <aside className="case-notebook">
              <div className="helpful-note"><span>AI媛 ?꾩슫 ??/span><p>{item.aiHelp}</p></div>
              <div className="clue-list"><span>?꾩옣?먯꽌 ?뺤씤???ъ떎</span>{item.clues.map((clue, index) => <p key={clue}><i>{index + 1}</i>{clue}</p>)}</div>
            </aside>
          </section>
          <section className="first-judgement">
            <div className="section-heading"><span>?섏쓽 泥??먮떒</span><h2>?대?濡??됰룞?대룄 愿쒖갖?꾧퉴??</h2><p>移쒓뎄? ?댁빞湲고븯湲??? 吏湲????앷컖??癒쇱? ?④꺼??</p></div>
            <SignalPicker value={answer.firstSignal} onChange={(firstSignal) => patchAnswer({ firstSignal })} />
            {answer.firstSignal && (
              <div className="reason-choice page-enter">
                <b>洹몃젃寃??앷컖??媛?????댁쑀??</b>
                {item.reasonOptions.map((reason, index) => <button key={reason} className={answer.firstReason === index ? "selected" : ""} onClick={() => patchAnswer({ firstReason: index })} aria-pressed={answer.firstReason === index}><span>{String.fromCharCode(65 + index)}</span>{reason}</button>)}
              </div>
            )}
          </section>
          <PageActions><button className="primary-button large" disabled={answer.firstSignal === undefined || answer.firstReason === undefined} onClick={() => go("think")}>洹쇨굅瑜??곕씪媛 蹂닿린 <span>??/span></button></PageActions>
        </CasePage>
      )}

      {screen === "think" && (
        <CasePage item={item} caseIndex={caseIndex} stage="洹쇨굅 李얘린">
          <LearningTarget question={item.question} principle={item.principle} />
          <div className="thinking-intro"><span>?앷컖???뗫낫湲?/span><h1>?ъ떎留?蹂댁? 留먭퀬, ?щ엺怨?媛移섍퉴吏 ?곌껐?댁슂.</h1><p>??媛吏 吏덈Ц???듯븯硫????먮떒??洹쇨굅媛 ??臾몄옣?쇰줈 ?꾩꽦?⑸땲??</p></div>
          <section className="lens-block fact-lens">
            <LensHeading number="1" label="?ъ떎???뺤씤?댁슂" question="?대뼡 ?먮즺媛 ?먮떒??媛???꾩????좉퉴??" />
            <div className="option-grid evidence-options">{item.evidenceOptions.map((option, index) => <button key={option.label} className={answer.evidence === index ? "selected" : ""} onClick={() => patchAnswer({ evidence: index })} aria-pressed={answer.evidence === index}><span>{option.strong ? "誘우쓣 留뚰븳 ?먮즺" : "異붽? ?뺤씤 ?꾩슂"}</span><b>{option.label}</b><p>{option.detail}</p></button>)}</div>
          </section>
          <section className="lens-block people-lens">
            <LensHeading number="2" label="?щ엺???댄렣?? question="???쇰줈 媛??癒쇱? ?앷컖?댁빞 ???щ엺? ?꾧뎄?쇨퉴??" />
            <div className="option-grid people-options">{item.people.map((person, index) => <button key={person.name} className={answer.affected === index ? "selected" : ""} onClick={() => patchAnswer({ affected: index })} aria-pressed={answer.affected === index}><span aria-hidden="true">{["??, "??, "??][index]}</span><b>{person.name}</b><p>{person.impact}</p></button>)}</div>
          </section>
          <section className="lens-block value-lens">
            <LensHeading number="3" label="媛移섎? ?곌껐?댁슂" question="???섏? ?먮떒???꾪빐 臾댁뾿??吏耳쒖빞 ?좉퉴??" />
            <div className="value-options">{item.values.map((value) => <button key={value} className={answer.value === value ? "selected" : ""} onClick={() => patchAnswer({ value })} aria-pressed={answer.value === value}>{value}</button>)}</div>
          </section>
          {answer.evidence !== undefined && answer.affected !== undefined && answer.value && (
            <div className="reason-summary page-enter" role="status"><span>?섏쓽 洹쇨굅 臾몄옣</span><p>?뺤씤???⑥꽌 <b>{item.evidenceOptions[answer.evidence].label}</b>???곕Ⅴ硫? <b>{item.people[answer.affected].name}</b>?먭쾶 誘몄튌 ?곹뼢???앷컖??<b>{answer.value}</b>??媛移섎? 吏耳쒖빞 ?⑸땲??</p></div>
          )}
          <PageActions><button className="secondary-button" onClick={() => go("scene")}>??泥??먮떒 蹂닿린</button><button className="primary-button large" disabled={answer.evidence === undefined || answer.affected === undefined || !answer.value} onClick={() => go("talk")}>移쒓뎄? ?먮떒 ?섎늻湲?<span>??/span></button></PageActions>
        </CasePage>
      )}

      {screen === "talk" && (
        <CasePage item={item} caseIndex={caseIndex} stage="紐⑤몺 ?댁빞湲?>
          <LearningTarget question={item.question} principle={item.principle} />
          <section className="discussion-board">
            <div className="discussion-heading"><span>紐⑤몺 ?댁빞湲?/span><h1>{item.discussion.question}</h1><p>?꾧? ?닿린???좊줎???꾨땲?? ??醫뗭? 洹쇨굅? ?됰룞???④퍡 李얜뒗 ?쒓컙?낅땲??</p></div>
            <div className="position-grid">{item.discussion.sides.map((side) => <button key={side.id} className={answer.discussionSide === side.id ? "selected" : ""} onClick={() => patchAnswer({ discussionSide: side.id })} aria-pressed={answer.discussionSide === side.id}><span>?낆옣 {side.id}</span><b>{side.title}</b><p>{side.description}</p><strong>{answer.discussionSide === side.id ? "?곕━ 紐⑤몺???꾩옱 ?낆옣 ?? : "???낆옣 ?좏깮?섍린"}</strong></button>)}</div>
            <div className="talk-guide">
              <div><span>留먰븷 ???ъ슜????媛吏 吏덈Ц</span>{item.discussion.prompts.map((prompt, index) => <p key={prompt}><i>{index + 1}</i>{prompt}</p>)}</div>
              <div className="sentence-start"><span>?대젃寃??쒖옉??蹂댁꽭??/span><p>?쒕굹??<b>___ ?⑥꽌</b> ?뚮Ц???대젃寃??앷컖????/p><p>??b>___??留덉쓬</b>?먯꽌 蹂대㈃ ?щ씪吏????덉뼱.??/p><p>?쒖슦由??섏쓽 ?섍껄???⑹튂硫?<b>___</b>?????덉뼱.??/p></div>
            </div>
            <DiscussionTimer />
          </section>
          <PageActions><button className="secondary-button" onClick={() => go("think")}>??洹쇨굅 ?ㅼ떆 蹂닿린</button><button className="primary-button large" disabled={!answer.discussionSide} onClick={() => go("resolve")}>???섏? ?됰룞 ?뺥븯湲?<span>??/span></button></PageActions>
        </CasePage>
      )}

      {screen === "resolve" && (
        <CasePage item={item} caseIndex={caseIndex} stage="?됰룞 寃곗젙">
          <LearningTarget question={item.question} principle={item.principle} />
          <section className="resolution-intro"><span>?ш굔 ?닿껐</span><h1>洹몃옒???곕━???대뼸寃??됰룞?댁빞 ?좉퉴??</h1><p>臾몄젣瑜?李얜뒗 ?곗꽌 ?앸굹吏 ?딄퀬, ?ㅼ젣濡??????덈뒗 ?됰룞???좏깮?댁슂.</p></section>
          <div className="action-options">{item.actions.map((action, index) => <button key={action.text} className={answer.action === index ? "selected" : ""} onClick={() => patchAnswer({ action: index })} aria-pressed={answer.action === index}><span>{String.fromCharCode(65 + index)}</span><b>{action.text}</b>{answer.action === index && <p className={action.recommended ? "good" : "rethink"}>{action.recommended ? "醫뗭? ?닿껐 ?됰룞?댁뿉?? " : "??踰????앷컖??遊먯슂. "}{action.why}</p>}</button>)}</div>
          {answer.action !== undefined && (
            <section className="final-judgement page-enter">
              <div className="section-heading"><span>?섏쓽 理쒖쥌 ?먮떒</span><h2>洹쇨굅? 移쒓뎄???앷컖???ㅼ? 吏湲덉? ?대뼸寃??먮떒?섎굹??</h2></div>
              <SignalPicker value={answer.finalSignal} onChange={(finalSignal) => patchAnswer({ finalSignal })} />
              {answer.finalSignal && <div className="change-reasons"><b>???앷컖??媛???곹뼢??以 寃껋??</b>{["?덈줈 ?뺤씤???먮즺", "?곹뼢諛쏅뒗 ?щ엺??留덉쓬", "移쒓뎄媛 留먰븳 ?ㅻⅨ 洹쇨굅", "泥섏쓬 ?앷컖??洹쇨굅媛 ??遺꾨챸?댁쭚"].map((reason) => <button key={reason} className={answer.changeReason === reason ? "selected" : ""} onClick={() => patchAnswer({ changeReason: reason })} aria-pressed={answer.changeReason === reason}>{reason}</button>)}</div>}
            </section>
          )}
          {answer.action !== undefined && answer.finalSignal && answer.changeReason && (
            <div className="principle-card page-enter"><div className="principle-badge">{item.badge}</div><div><span>?대쾲 ?ш굔???먯젙 ?먯튃</span><h2>{item.principle}</h2><p>{item.checklist.stage}???뺤씤???쎌냽?쇰줈 ?먯젙 ?섏꺽??湲곕줉?덉뒿?덈떎.</p></div></div>
          )}
          <PageActions><button className="secondary-button" onClick={() => go("talk")}>??紐⑤몺 ?댁빞湲?蹂닿린</button><button className="primary-button large" disabled={answer.action === undefined || !answer.finalSignal || !answer.changeReason} onClick={continueCase}>{caseIndex === ethicsCases.length - 1 ? "?곕━ 諛??쎌냽 留뚮뱾湲? : "?ㅼ쓬 ?ш굔?쇰줈"} <span>??/span></button></PageActions>
        </CasePage>
      )}

      {screen === "pledge" && (
        <section className="pledge-page page-enter">
          <div className="pledge-heading"><span>留덉?留??쒕룞</span><h1>?곕━ 諛섏뿉 ?꾩슂??br />AI ?ㅻ━ ?쎌냽??怨⑤씪??</h1><p>?ш굔?먯꽌 諛곗슫 ?댁슜???앺솢 ???됰룞?쇰줈 諛붽씀???④퀎?낅땲?? 媛??以묒슂?섎떎怨??앷컖?섎뒗 ?쎌냽 ??媛吏 ?댁긽???좏깮?섏꽭??</p></div>
          <div className="learned-principles">{ethicsCases.map((caseItem) => <div key={caseItem.id}><span>{caseItem.badge}</span><p><b>{caseItem.topic}</b>{caseItem.principle}</p></div>)}</div>
          <section className="promise-picker"><span>?곕━ 諛?AI ?ㅻ━ ?ㅼ썙?쒖? ?ㅼ쿇 諛⑸쾿</span>{sharedPromises.map((promise, index) => <button key={promise.value} className={promises.includes(index) ? "selected" : ""} onClick={() => setPromises((previous) => previous.includes(index) ? previous.filter((value) => value !== index) : [...previous, index])} aria-pressed={promises.includes(index)}><i>{promises.includes(index) ? "?? : index + 1}</i><b>{promise.value}</b><p>{promise.text}</p></button>)}</section>
          <div className="pledge-status"><b>{promises.length}</b><span>/ 3媛??댁긽 ?좏깮</span></div>
          <PageActions><button className="primary-button large" disabled={promises.length < 3} onClick={() => go("complete")}>?ㅻ━?먯젙???꾨Т ?꾨즺 <span>??/span></button></PageActions>
        </section>
      )}

      {screen === "complete" && (
        <section className="complete-page page-enter">
          <div className="complete-mark" aria-hidden="true">??/div>
          <span>AI ?ㅻ━?먯젙 ?몄쬆</span>
          <h1>{nickname} ?먯젙,<br />?댁젣 AI瑜??ㅼ뒪濡??먮떒?섎ŉ ?ъ슜?????덉뼱??</h1>
          <p>AI瑜?臾댁“嫄?誘욧굅???먮젮?뚰븯吏 ?딄퀬, ?ъ떎怨??щ엺???댄뵾硫?梨낆엫 ?덈뒗 ?됰룞???좏깮?덉뒿?덈떎.</p>
          <div className="complete-summary"><div><b>{solvedCount}</b><span>?닿껐???ш굔</span></div><div><b>{promises.length}</b><span>?좏깮???쎌냽</span></div><div><b>4</b><span>?먮떒 ?④퀎</span></div></div>
          <div className="my-promises"><span>?닿? ?좏깮??AI ?ㅻ━ ?쎌냽</span>{promises.map((index) => <p key={index}><b>{sharedPromises[index].value}</b>{sharedPromises[index].text}</p>)}</div>
          <div className="complete-actions"><button className="primary-button" onClick={() => window.print()}>?몄쬆 湲곕줉 ?몄뇙</button><button className="secondary-button" onClick={resetProgram}>?덈줈 ?쒖옉?섍린</button></div>
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
          <span className="eyebrow">珥덈벑 AI ?ㅻ━ ?쒕? ?섏뾽</span>
          <h1>AI媛 ?꾩?以섎룄,<br /><em>留덉?留??먮떒? ?닿? ?댁슂.</em></h1>
          <p>??媛吏 ?앺솢 ???ш굔???댄렣蹂대ŉ <b>?ъ떎???뺤씤?섍퀬, ?щ엺??留덉쓬???댄뵾怨? 吏耳쒖빞 ??媛移섎? 李얠븘 ???섏? ?됰룞</b>???좏깮?⑸땲??</p>
          <div className="home-actions"><button className="primary-button large" onClick={onStart}>?ㅻ━?먯젙???쒖옉?섍린 <span>??/span></button><button className="text-button" onClick={onTeacher}>40遺??섏뾽 ?댁쁺??/button></div>
          <small>?ㅻ챸쨌濡쒓렇???놁씠 ?ъ슜?????덉쑝硫?湲곕줉? ?꾩옱 湲곌린?먮쭔 ??λ맗?덈떎.</small>
        </div>
        <div className="hero-notebook" aria-label="?ㅻ━?먯젙???앷컖 ?쒖꽌">
          <div className="notebook-shadow" />
          <div className="notebook-page">
            <div className="notebook-top"><span>DETECTIVE NOTE 01</span><b>AI ETHICS</b></div>
            <div className="notebook-question">AI???듬낫??癒쇱?<br /><b>臾댁뾿???앷컖?댁빞 ?좉퉴?</b></div>
            <div className="notebook-route"><p><i>1</i><span><b>?ъ떎</b>臾댁뒯 ?쇱씠 ?덉뿀?섏슂?</span></p><p><i>2</i><span><b>?щ엺</b>?꾧? ?곹뼢??諛쏅굹??</span></p><p><i>3</i><span><b>媛移?/b>臾댁뾿??吏耳쒖빞 ?섎굹??</span></p><p><i>4</i><span><b>?됰룞</b>?대뼸寃?諛붽씀硫?醫뗭쓣源뚯슂?</span></p></div>
            <div className="notebook-stamp">?앷컖?섍퀬<br />寃곗젙?섍린</div>
          </div>
          <div className="notebook-tabs"><span>??/span><span>硫?/span><span>??/span><span>諛?/span></div>
        </div>
      </section>
      <section className="core-message"><span>???섏뾽???꾪븯?ㅻ뒗 ??臾몄옣</span><h2>AI???몃━???꾧뎄?댁?留? 寃곌낵瑜??댄뵾怨?梨낆엫吏???щ엺? ?곕━?낅땲??</h2></section>
      <section className="case-preview">
        <div className="preview-heading"><span>4媛쒖쓽 ?앺솢 ???ш굔</span><h2>?ш굔留덈떎 ??媛吏 ?먯튃??遺꾨챸?섍쾶 諛곗썙??</h2></div>
        <div className="preview-grid">{ethicsCases.map((item) => <article key={item.id}><span>{item.caseNo}</span><i>{item.badge}</i><b>{item.title}</b><p>{item.question}</p><small>{item.principle}</small></article>)}</div>
      </section>
      <section className="home-footer-cta"><div><span>援먯떎?먯꽌 諛붾줈 ?ъ슜?????덉뼱??/span><h2>媛쒖씤 ?먮떒 ??洹쇨굅 李얘린 ??紐⑤몺 ?댁빞湲????ㅼ쿇 ?쎌냽</h2></div><button className="primary-button large" onClick={onStart}>泥??ш굔 ?쒖옉?섍린 <span>??/span></button></section>
    </>
  );
}

function ThinkingStep({ number, title, text }: { number: string; title: string; text: string }) {
  return <div><i>{number}</i><p><b>{title}</b><span>{text}</span></p></div>;
}

function CaseProgress({ caseIndex, screen }: { caseIndex: number; screen: Screen }) {
  const stages: { id: Screen; label: string }[] = [{ id: "scene", label: "?ш굔" }, { id: "think", label: "洹쇨굅" }, { id: "talk", label: "?댁빞湲? }, { id: "resolve", label: "?됰룞" }];
  const active = stages.findIndex((stage) => stage.id === screen);
  return <nav className="case-progress" aria-label="?ш굔 吏꾪뻾 ?④퀎"><span>?ш굔 {caseIndex + 1} / {ethicsCases.length}</span><div>{stages.map((stage, index) => <p key={stage.id} className={index < active ? "done" : index === active ? "active" : ""} aria-current={index === active ? "step" : undefined}><i>{index < active ? "?? : index + 1}</i><b>{stage.label}</b></p>)}</div></nav>;
}

function CasePage({ item, caseIndex, stage, children }: { item: (typeof ethicsCases)[number]; caseIndex: number; stage: string; children: React.ReactNode }) {
  return <section className="case-page page-enter"><header className="case-page-head"><div><span>{item.caseNo}</span><b>{item.topic}</b></div><p>{caseIndex + 1}踰덉㎏ ?ш굔 쨌 {stage}</p></header>{children}</section>;
}

function LearningTarget({ question, principle }: { question: string; principle: string }) {
  return <div className="learning-target"><span>?ㅻ뒛 諛앺???寃?/span><h2>{question}</h2><p><b>?섏뾽???앸굹硫?/b> {principle}</p></div>;
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

  return <div className="discussion-timer"><div><span>紐⑤몺 ?댁빞湲???대㉧</span><time aria-live="polite">{minute}:{second}</time></div><div className="timer-line"><i style={{ width: `${progress}%` }} /></div><p><button onClick={() => { setSeconds(total); setRunning(false); }}>泥섏쓬?쇰줈</button><button onClick={() => setRunning((value) => !value)}>{running ? "?좎떆 硫덉땄" : seconds === 0 ? "?ㅼ떆 ?쒖옉" : "3遺??쒖옉"}</button></p></div>;
}

function TeacherPanel({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="teacher-panel" role="dialog" aria-modal="true" aria-labelledby="teacher-title"><button className="modal-close" onClick={onClose} aria-label="援먯궗???덈궡 ?リ린">횞</button><span>援먯궗??鍮좊Ⅸ ?덈궡</span><h2 id="teacher-title">40遺??섏뾽 ?댁쁺??/h2><p className="teacher-purpose">???섏뾽? AI??????먮젮????ㅼ슦??寃껋씠 ?꾨땲?? AI???몃━?④낵 ?ㅻ쪟 媛?μ꽦???④퍡 ?댄빐?섍퀬 梨낆엫 ?덈뒗 ?ъ슜?먮줈 ?먮떒?섎뒗 ?섏쓣 湲곕Ⅴ???섏뾽?낅땲??</p><div className="lesson-flow"><div><b>5遺?/b><span>?꾩엯</span><p>AI媛 ?꾩?以 寃쏀뿕怨?留덉?留?寃곗젙? ?꾧? ?덈뒗吏 ?댁빞湲고빀?덈떎.</p></div><div><b>12遺?/b><span>媛쒖씤 ?먮떒</span><p>?ш굔???쎄퀬 泥??먮떒怨??댁쑀瑜??좏깮?⑸땲??</p></div><div><b>13遺?/b><span>洹쇨굅쨌紐⑤몺 ?댁빞湲?/span><p>?ъ떎쨌?щ엺쨌媛移섎? ?곌껐?섍퀬 ???낆옣??鍮꾧탳?⑸땲??</p></div><div><b>10遺?/b><span>?됰룞쨌?쎌냽</span><p>?닿껐 ?됰룞??怨좊Ⅴ怨??곕━ 諛?AI ?ㅻ━ ?쎌냽??留뚮벊?덈떎.</p></div></div><div className="teacher-principles"><h3>援먯궗媛 瑗??뺤씤??寃?/h3><ul><li>?뺣떟??鍮⑤━ ?뚮젮二쇨린蹂대떎 ?숈깮???대뼡 洹쇨굅? ?곹뼢???앷컖?덈뒗吏 臾살뒿?덈떎.</li><li>?앷컖??諛붽씀??寃껋쓣 ?ㅻ떟???꾨땲???덈줈??洹쇨굅瑜?諛쏆븘?ㅼ씤 ?깆옣?쇰줈 ?ㅻ９?덈떎.</li><li>媛??ш굔???섎Ц??李얘린?숈뿉???앸궡吏 ?딄퀬 援ъ껜?곸씤 ?ㅼ쿇 ?됰룞?쇰줈 ?곌껐?⑸땲??</li><li>?ㅼ젣 媛쒖씤?뺣낫쨌?ъ쭊쨌?숆탳 ?뺣낫???낅젰?섏? ?딆뒿?덈떎.</li></ul></div><div className="curriculum-box"><b>吏?꾩꽌쨌援먯쑁怨쇱젙 ?곌퀎</b><p>吏?꾩꽌 1李⑥떆: AI ??린???щ?瑜??댄렣蹂닿퀬 ?덈갑 諛??泥섎쾿 ?뚭린</p><p>吏?꾩꽌 2李⑥떆: ?꾩슂???ㅻ━ ?ㅼ썙?쒕? ?좎젙?섍퀬 援ъ껜?곸씤 ?ㅼ쿇 諛⑸쾿 留뚮뱾湲?/p><p><strong>[6??5-05]</strong> ?멸났吏?μ씠 ?ы쉶??誘몄튂???곹뼢???먯깋?쒕떎.</p><p><strong>[6??2-03]</strong> ?멸컙怨??멸났吏?μ쓽 愿怨꾨? ?뚯븙?섍퀬 ?꾨뜒??湲곕컲??愿怨??뺤꽦???꾩슂?깆쓣 ?먭뎄?쒕떎.</p></div><button className="primary-button full" onClick={onClose}>?섏뾽???뺤씤</button></section></div>;
}

