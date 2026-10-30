import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

const links = [
  { label: "The story", href: "#story" },
  { label: "The movement", href: "#movement" },
  { label: "The token", href: "#token" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="$JACKSON home">
          <img className="brand__mark" src="/images/jackson-coin.webp" alt="" />
          <span className="brand__name">$JACKSON<span>.</span></span>
        </a>

        <nav className={`desktop-nav ${menuOpen ? "desktop-nav--open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a className="nav-tiktok" href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer">
            TikTok <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        </nav>

        <a className="header-cta" href={siteConfig.baseMemeUrl} target="_blank" rel="noreferrer">
          Get $JACKSON <ArrowUpRight size={16} />
        </a>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              <span>0{index + 1}</span>{link.label}
            </a>
          ))}
          <a href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
            <span>04</span>Follow on TikTok <ArrowUpRight size={16} />
          </a>
          <a className="mobile-nav__buy" href={siteConfig.baseMemeUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
            Get $JACKSON <ArrowUpRight size={16} />
          </a>
        </nav>
      )}
    </header>
  );
}
