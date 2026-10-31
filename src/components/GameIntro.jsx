import { useEffect, useRef, useState } from "react";

function makeNoiseBuffer(context, duration) {
  const length = Math.ceil(context.sampleRate * duration);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playNoise(context, master, start, duration, options = {}) {
  const {
    frequency = 1400,
    endFrequency,
    q = 0.8,
    volume = 0.12,
    filterType = "bandpass",
  } = options;

  const source = context.createBufferSource();
  source.buffer = makeNoiseBuffer(context, duration + 0.06);

  const filter = context.createBiquadFilter();
  filter.type = filterType;
  filter.Q.setValueAtTime(q, start);
  filter.frequency.setValueAtTime(frequency, start);
  if (endFrequency) {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(80, endFrequency),
      start + duration
    );
  }

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(master);
  source.start(start);
  source.stop(start + duration + 0.02);
}

function playTone(context, master, start, duration, options = {}) {
  const {
    frequency = 440,
    endFrequency,
    type = "sine",
    volume = 0.12,
    filterFrequency,
  } = options;

  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(20, endFrequency),
      start + duration
    );
  }

  let output = oscillator;
  if (filterFrequency) {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFrequency, start);
    oscillator.connect(filter);
    output = filter;
  }

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  output.connect(envelope);
  envelope.connect(master);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function playPoliceSiren(context, master, start, duration) {
  const oscillator = context.createOscillator();
  oscillator.type = "triangle";

  // Alternating two-tone sweep for a recognisable approaching police siren.
  oscillator.frequency.setValueAtTime(660, start);
  for (let index = 0; index < 8; index += 1) {
    const time = start + 0.34 * (index + 1);
    oscillator.frequency.setValueAtTime(index % 2 === 0 ? 920 : 660, time);
  }

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1500, start);

  const panner = context.createStereoPanner();
  panner.pan.setValueAtTime(-0.88, start);
  panner.pan.linearRampToValueAtTime(0.88, start + duration);

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.linearRampToValueAtTime(0.052, start + 0.42);
  envelope.gain.setValueAtTime(0.052, start + duration - 0.45);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(filter);
  filter.connect(panner);
  panner.connect(envelope);
  envelope.connect(master);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);

  // A quieter, slightly detuned layer makes the siren feel wider and more distant.
  const layer = context.createOscillator();
  layer.type = "sine";
  layer.frequency.setValueAtTime(664, start);
  for (let index = 0; index < 8; index += 1) {
    layer.frequency.setValueAtTime(
      index % 2 === 0 ? 924 : 664,
      start + 0.34 * (index + 1)
    );
  }
  const layerGain = context.createGain();
  layerGain.gain.setValueAtTime(0.0001, start);
  layerGain.linearRampToValueAtTime(0.018, start + 0.45);
  layerGain.setValueAtTime(0.018, start + duration - 0.45);
  layerGain.exponentialRampToValueAtTime(0.0001, start + duration);
  layer.connect(layerGain);
  layerGain.connect(master);
  layer.start(start);
  layer.stop(start + duration + 0.04);
}

function playJacksonIntroAudio(context) {
  const start = context.currentTime + 0.04;
  const master = context.createGain();
  master.gain.setValueAtTime(0.72, start);
  master.connect(context.destination);

  // Magazine seats with a low mechanical thud and a sharp metal catch.
  playNoise(context, master, start + 0.08, 0.12, {
    frequency: 760,
    endFrequency: 420,
    q: 1.2,
    volume: 0.22,
    filterType: "lowpass",
  });
  playTone(context, master, start + 0.08, 0.13, {
    frequency: 112,
    endFrequency: 54,
    volume: 0.2,
  });
  playTone(context, master, start + 0.17, 0.075, {
    frequency: 1850,
    endFrequency: 920,
    type: "square",
    volume: 0.085,
  });

  // Slide rack: metallic scrape, then the unmistakable chamber clack.
  playNoise(context, master, start + 0.58, 0.28, {
    frequency: 720,
    endFrequency: 3100,
    q: 1.7,
    volume: 0.19,
  });
  playTone(context, master, start + 0.83, 0.11, {
    frequency: 520,
    endFrequency: 155,
    type: "square",
    volume: 0.12,
  });
  playTone(context, master, start + 0.96, 0.2, {
    frequency: 2350,
    endFrequency: 640,
    volume: 0.1,
  });

  // Police response approaches from left to right across the stereo field.
  playPoliceSiren(context, master, start + 1.12, 3.0);

  // Dispatch-radio squelch and two short radio beeps.
  playNoise(context, master, start + 1.67, 0.25, {
    frequency: 1850,
    endFrequency: 950,
    q: 1.4,
    volume: 0.14,
  });
  playTone(context, master, start + 1.68, 0.07, {
    frequency: 1040,
    endFrequency: 820,
    type: "square",
    volume: 0.045,
  });
  playTone(context, master, start + 1.86, 0.065, {
    frequency: 820,
    endFrequency: 1040,
    type: "square",
    volume: 0.04,
  });

  // A distant cinematic shot: sharp report with a low, short impact tail.
  playNoise(context, master, start + 2.38, 0.19, {
    frequency: 2100,
    endFrequency: 430,
    q: 0.7,
    volume: 0.34,
    filterType: "lowpass",
  });
  playTone(context, master, start + 2.38, 0.23, {
    frequency: 92,
    endFrequency:  35,
    volume: 0.32,
  });

  // A car engine rises in pitch and sweeps away under the siren.
  playTone(context, master, start + 2.62, 1.45, {
    frequency: 48,
    endFrequency: 118,
    type: "sawtooth",
    volume: 0.085,
    filterFrequency: 230,
  });
  playTone(context, master, start + 3.28, 0.75, {
    frequency: 118,
    endFrequency: 72,
    type: "sawtooth",
    volume: 0.045,
    filterFrequency: 210,
  });
  playNoise(context, master, start + 3.15, 0.58, {
    frequency: 2900,
    endFrequency: 1450,
    q: 0.5,
    volume: 0.065,
  });

  // Final cinematic bass hit for the JACKSON title reveal.
  playTone(context, master, start + 3.92, 0.58, {
    frequency: 78,
    endFrequency:  35,
    volume: 0.38,
  });
  playNoise(context, master, start + 3.94, 0.28, {
    frequency: 560,
    endFrequency: 120,
    q: 0.6,
    volume: 0.19,
    filterType: "lowpass",
  });
}

function 35 {
  return 35;
}

export default function GameIntro() {
  const [visible, setVisible] = useState(() => {
    try {
      return window.sessionStorage.getItem("jackson-intro-seen") !== "1";
    } catch {
      return true;
    }
  });
  const [starting, setStarting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const audioContextRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    if (!visible) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
  }, []);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem("jackson-intro-seen", "1");
    } catch {
      // The intro still works when session storage is unavailable.
    }
    setVisible(false);
  };

  const startGame = () => {
    if (starting) return;
    setStarting(true);

    // AudioContext is created and resumed directly inside the user's click,
    // so mobile Safari and desktop browsers can allow the sound sequence.
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const context = new AudioContextClass();
        audioContextRef.current = context;
        // Schedule immediately inside the click gesture; the graph starts as soon as
        // the browser completes resume(), including on mobile Safari.
        context.resume().catch(() => {});
        playJacksonIntroAudio(context);
      }
    } catch {
      // Keep the visual intro usable if audio is unavailable.
    }

    timersRef.current.push(window.setTimeout(() => setFinishing(true), 4050));
    timersRef.current.push(window.setTimeout(dismiss, 4650));
  };

  if (!visible) return null;

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
            <div className="jackson-intro__loading" role="status">LOADING JACKSON<span>...</span></div>
          )}
          <p className="jackson-intro__hint">
            {starting ? "GET READY" : "SOUND ON  •  HEADPHONES RECOMMENDED"}
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
