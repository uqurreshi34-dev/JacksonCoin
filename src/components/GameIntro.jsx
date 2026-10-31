import { useEffect, useRef, useState } from "react";

export default function GameIntro() {
  const [visible, setVisible] = useState(() => {
    try {
      return window.sessionStorage.getItem("jackson-intro-seen") !== "1";
    } catch {
      return true;
    }
  });
  const [starting, setStarting] = useState(false);
  const [phase, setPhase] = useState("ready");
  const [finishing, setFinishing] = useState(false);
  const sirenRef = useRef(null);
  const gunshotRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Preload the real sound effects before the visitor presses START.
    const siren = new Audio("/audio/117181__drewkelly__sirens.wav");
    const gunshot = new Audio("/audio/683311__pnmcarrierailfan__pistol-gun-shot-mix.mp3");
    siren.preload = "auto";
    gunshot.preload = "auto";
    siren.volume = 0.95;
    gunshot.volume = 0.9;
    sirenRef.current = siren;
    gunshotRef.current = gunshot;

    return () => {
      document.body.style.overflow = previousOverflow;
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      [siren, gunshot].forEach((audio) => {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
        audio.currentTime = 0;
      });
      sirenRef.current = null;
      gunshotRef.current = null;
    };
  }, [visible]);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem("jackson-intro-seen", "1");
    } catch {
      // The intro remains usable when session storage is unavailable.
    }

    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    [sirenRef.current, gunshotRef.current].forEach((audio) => {
      if (!audio) return;
      audio.onended = null;
      audio.pause();
      audio.currentTime = 0;
    });
    setVisible(false);
  };

  const finishSequence = () => {
    setPhase("complete");
    setFinishing(true);
    timersRef.current.push(window.setTimeout(dismiss, 700));
  };

  const handleAudioError = () => {
    setStarting(false);
    setPhase("audio-error");
  };

  const startGame = () => {
    if (starting) return;

    const siren = sirenRef.current;
    const gunshot = gunshotRef.current;
    if (!siren || !gunshot) {
      handleAudioError();
      return;
    }

    setStarting(true);
    setFinishing(false);
    setPhase("siren");

    // This first play() call is made directly from the START click/tap,
    // unlocking sound on desktop browsers and mobile Safari.
    siren.currentTime = 0;
    gunshot.currentTime = 0;

    gunshot.onended = finishSequence;
    siren.onended = () => {
      setPhase("gunshot");
      gunshot.currentTime = 0;
      const gunshotPlayback = gunshot.play();
      if (gunshotPlayback?.catch) {
        gunshotPlayback.catch(handleAudioError);
      }
    };

    const sirenPlayback = siren.play();
    if (sirenPlayback?.catch) {
      sirenPlayback.catch(handleAudioError);
    }
  };

  if (!visible) return null;

  const statusText = {
    ready: "SOUND ON  •  HEADPHONES RECOMMENDED",
    siren: "POLICE RESPONSE INBOUND",
    gunshot: "ONE LAST JOB...",
    complete: "WELCOME TO THE CITY",
    "audio-error": "CHECK public/audio SOUND FILES",
  }[phase];

  return (
    <div
      className={`jackson-intro${starting ? " is-starting" : ""}${finishing ? " is-finishing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Jackson game intro"
      onKeyDown={(event) => {
        if (event.key === "Escape") dismiss();
      }}
    >
      <div className="jackson-intro__city" aria-hidden="true" />
      <div className="jackson-intro__light jackson-intro__light--red" aria-hidden="true" />
      <div className="jackson-intro__light jackson-intro__light--blue" aria-hidden="true" />
      <div className="jackson-intro__edge-light jackson-intro__edge-light--left" aria-hidden="true" />
      <div className="jackson-intro__edge-light jackson-intro__edge-light--right" aria-hidden="true" />
      <div className="jackson-intro__scanlines" aria-hidden="true" />
      <div className="jackson-intro__flash" aria-hidden="true" />

      <div className="jackson-intro__hud">
        <span><i /> JACKSON INTERACTIVE</span>
        <span>BASE NETWORK <b>///</b> 001</span>
      </div>

      <div className="jackson-intro__center">
        <p className="jackson-intro__eyebrow">THE CITY HAS A NEW PROBLEM</p>
        <h1 className="jackson-intro__logo">JACKSON<span>.</span></h1>
        <p className="jackson-intro__tagline">ONE LAST JOB.<br /><em>THEN I'M RETIRING.</em></p>

        <div className="jackson-intro__action">
          {!starting ? (
            <button className="jackson-intro__start" type="button" onClick={startGame}>
              <span className="jackson-intro__play" aria-hidden="true">▶</span>
              PRESS START
            </button>
          ) : (
            <div className="jackson-intro__loading" role="status">
              {phase === "gunshot" ? "FINAL WARNING" : "POLICE DISPATCH"}
              <span>...</span>
            </div>
          )}
          <p className={`jackson-intro__hint${phase === "audio-error" ? " is-error" : ""}`} aria-live="polite">
            {statusText}
          </p>
        </div>
      </div>

      <button className="jackson-intro__skip" type="button" onClick={dismiss}>
        SKIP INTRO <span aria-hidden="true">↗</span>
      </button>

      <div className="jackson-intro__footer" aria-hidden="true">
        <span>AN ORIGINAL CITY STORY</span>
        <span>PRESS START TO ENTER</span>
      </div>
    </div>
  );
}
