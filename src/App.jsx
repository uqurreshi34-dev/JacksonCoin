import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy, ExternalLink, MoveUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import StoryCard from "@/components/StoryCard";
import GameIntro from "@/components/GameIntro";
import { siteConfig } from "@/config/site";

const storyBeats = [
  {
    number: "01",
    title: "Clocking in",
    description: "Forty hours a week to survive. Another day on the clock — and a head full of bigger plans.",
    image: "/images/clocking-in.webp",
    alt: "Jackson at his desk, clocking in for another day.",
  },
  {
    number: "02",
    title: "Daydreaming",
    description: "Eyes on the skyline. Imagining the life that could be waiting around the next corner.",
    image: "/images/daydreaming.webp",
    alt: "Jackson leaning back in a car, dreaming of a different life.",
  },
  {
    number: "03",
    title: "Reality hits",
    description: "The radio crackles. The lights come on. One last job… then I'm retiring.",
    image: "/images/reality-hits.webp",
    alt: "Jackson caught in a chaotic city scene with police lights and a helicopter.",
  },
];

function ExternalLinkIcon() {
  return <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden="true" />;
}

export default function App() {
  const [copied, setCopied] = useState(false);

  const copyContract = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contractAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const field = document.createElement("textarea");
      field.value = siteConfig.contractAddress;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const successful = document.execCommand("copy");
      field.remove();
      setCopied(successful);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <>
      <GameIntro />
      <div id="top" className="app-shell">
        <SiteHeader />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__glow hero__glow--one" />
          <div className="hero__glow hero__glow--two" />
          <div className="hero__grid" />
          <div className="hero__inner page-width">
            <div className="hero__copy">
              <div className="eyebrow eyebrow--dark"><span className="eyebrow__dot" /> THE MEME COIN FOR THE MAIN CHARACTERS</div>
              <h1 id="hero-title">JACKSON<span className="hero__period">.</span></h1>
              <p className="hero__tagline">One last job.<br /><em>Then I'm retiring.</em></p>
              <p className="hero__description">
                The meme coin for dreamers, crooks and chaos lovers.
                Same dreams. Different wallet.
              </p>
              <div className="hero__actions">
                <a className="button button--gold" href={siteConfig.baseMemeUrl} target="_blank" rel="noreferrer">
                  Get $JACKSON <ExternalLinkIcon />
                </a>
                <a className="button button--outline-light" href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer">
                  Follow the story <ExternalLinkIcon />
                </a>
              </div>
              <div className="hero__facts" aria-label="Token highlights">
                <span><i /> BASE NETWORK</span>
                <span><i /> 1 BILLION TOTAL SUPPLY</span>
              </div>
            </div>

            <div className="hero__visual">
              <div className="hero__orbit hero__orbit--outer" />
              <div className="hero__orbit hero__orbit--inner" />
              <div className="hero__coin">
                <img src="/images/jackson-coin.webp" alt="The gold $JACKSON coin logo" fetchPriority="high" />
              </div>
              <div className="hero__sticker hero__sticker--top">THE<br />BOSS</div>
              <div className="hero__sticker hero__sticker--bottom">JACKSON<br /><span>ON BASE</span></div>
            </div>
          </div>
          <a className="hero__scroll" href="#story" aria-label="Scroll to the story">
            <span>SCROLL TO THE STORY</span><ArrowDown size={16} />
          </a>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            {Array.from({ length: 2 }).map((_, index) => (
              <span className="ticker__set" key={index}>
                <b>$JACKSON</b><i>✦</i> ONE LAST JOB <i>✦</i> THEN I'M RETIRING <i>✦</i> DREAMERS • CROOKS • CHAOS LOVERS <i>✦</i>
              </span>
            ))}
          </div>
        </div>

        <section id="story" className="section story-section">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <div className="eyebrow"><span className="eyebrow__dot" /> THE STORY SO FAR</div>
                <h2>EVERY LEGEND<br /><span>STARTS SOMEWHERE.</span></h2>
              </div>
              <p className="section-heading__aside">
                Three stages. One character. A lifetime of questionable decisions.
              </p>
            </div>

            <div className="story-grid">
              {storyBeats.map((beat) => <StoryCard key={beat.number} {...beat} />)}
            </div>
          </div>
        </section>

        <section id="movement" className="movement-section">
          <div className="movement-section__image">
            <img src="/images/movement.webp" alt="Jackson looking out over the city at sunset, wearing his Jackson jacket." loading="lazy" />
          </div>
          <div className="movement-section__copy">
            <div className="eyebrow eyebrow--dark"><span className="eyebrow__dot" /> MORE THAN A PROFILE PICTURE</div>
            <h2>IT'S A<br /><span>MOVEMENT.</span></h2>
            <p>
              For the ones still clocking in, still daydreaming, and still convinced
              the next chapter is going to be a good one.
            </p>
            <a className="button button--gold" href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer">
              Join the story on TikTok <ExternalLinkIcon />
            </a>
            <div className="movement-section__note">SAME DREAMS. DIFFERENT WALLET.</div>
          </div>
        </section>

        <section id="token" className="token-section">
          <div className="token-section__flare" />
          <div className="page-width token-layout">
            <div className="token-art">
              <div className="token-art__halo" />
              <img src="/images/jackson-coin.webp" alt="$JACKSON gold coin emblem" loading="lazy" />
            </div>

            <div className="token-content">
              <div className="eyebrow eyebrow--dark"><span className="eyebrow__dot" /> THE DETAILS</div>
              <h2>MEET<br /><span>$JACKSON.</span></h2>
              <p className="token-content__lead">A little chaos. A lot of character.</p>

              <div className="token-stats">
                <div className="token-stat">
                  <span>NETWORK</span>
                  <strong>BASE</strong>
                </div>
                <div className="token-stat">
                  <span>TOTAL SUPPLY</span>
                  <strong>{siteConfig.totalSupply}</strong>
                </div>
                <div className="token-stat token-stat--address">
                  <span>CONTRACT ADDRESS</span>
                  <strong title={siteConfig.contractAddress}>{siteConfig.contractAddress}</strong>
                </div>
              </div>

              <div className="token-actions">
                <a className="button button--gold" href={siteConfig.baseMemeUrl} target="_blank" rel="noreferrer">
                  Open on Base.meme <ExternalLinkIcon />
                </a>
                <button className="button button--outline-light" type="button" onClick={copyContract}>
                  {copied ? <><Check size={17} /> Copied</> : <><Copy size={17} /> Copy contract</>}
                </button>
              </div>
              <a className="token-verify" href={siteConfig.baseScanUrl} target="_blank" rel="noreferrer">
                View contract on BaseScan <MoveUpRight size={14} />
              </a>
              <p className="token-copy-status" aria-live="polite">{copied ? "Contract address copied to clipboard." : ""}</p>
            </div>
          </div>
        </section>

        <section id="community" className="community-section">
          <div className="page-width community-card">
            <div className="community-card__copy">
              <div className="eyebrow"><span className="eyebrow__dot" /> YOUR NEXT CHAPTER STARTS HERE</div>
              <h2>DON'T JUST<br /><span>WATCH THE CHAOS.</span></h2>
              <p>Follow Jackson. Catch the next scene. Bring your own plot twist.</p>
              <a className="button button--dark" href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer">
                Find us on TikTok <ExternalLinkIcon />
              </a>
            </div>
            <div className="community-card__art">
              <img src="/images/reality-hits.webp" alt="Jackson's chaotic city story continues." loading="lazy" />
              <div className="community-card__tag">ONE LAST JOB…</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width site-footer__main">
          <a className="brand brand--footer" href="#top">
            <img className="brand__mark" src="/images/jackson-coin.webp" alt="" />
            <span className="brand__name">$JACKSON<span>.</span></span>
          </a>
          <p>Same dreams. Different wallet.</p>
          <a className="back-top" href="#top">BACK TO TOP <ArrowUpRight size={15} /></a>
        </div>
        <div className="page-width site-footer__fineprint">
          <p>
            $JACKSON is a meme coin created for entertainment purposes only. It has no intrinsic value
            or expectation of financial return. Digital assets are volatile; do your own research and
            never risk money you cannot afford to lose. Nothing on this website is financial advice.
          </p>
          <span>© {new Date().getFullYear()} $JACKSON</span>
        </div>
      </footer>
      </div>
    </>
  );
}
