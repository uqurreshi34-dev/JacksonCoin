# $JACKSON

A lightweight, responsive React single-page site for the $JACKSON meme coin.

## Stack

- React + Vite
- Tailwind CSS
- JavaScript / JSX
- `@` import alias for `src/`
- Static deployment on Vercel

## Run locally

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Project settings

Edit `src/config/site.js` to set the official TikTok profile URL and update the token contract / Base.meme destination if either changes. The TikTok URL currently points to the TikTok homepage because the official profile URL was not included with the supplied assets.

The coin address currently in the site was supplied in the project notes. Verify it against the live Base.meme listing before publishing.

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Keep the framework preset as **Vite** (or **Other** if Vite is not auto-detected).
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

No environment variables are required for the static site.

## Connect a Fasthosts domain

After deployment, add the purchased domain in **Vercel → Project → Settings → Domains**. Vercel will show the DNS records required for that exact domain. Add those records in the Fasthosts DNS control panel, remove conflicting parking records where Vercel instructs, then wait for DNS propagation and complete Vercel's verification. Prefer Vercel's displayed records over generic values because they can vary by configuration.

## Content and safety

The site is a community / entertainment page, not an investment offer. It makes no price, return, or performance promises. Token details and external profile links should be checked before launch.
