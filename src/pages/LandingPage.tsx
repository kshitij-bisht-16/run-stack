import { Fragment, useEffect, useLayoutEffect, useRef, useState, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import Button from '../components/Button'
import DotGrid from '../components/DotGrid'
import FlickeringGrid from '../components/FlickeringGrid'

const font = "'Sora', sans-serif"

function Link({ to, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode }) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  )
}

/* ── Data ── */



// Material Icon paths matching the Figma "Agents - Animation" component
const ICON_CAMPAIGN = 'M18 11V3c0-1.1-.9-2-2-2s-2 .9-2 2v.27L7.04 5.84C6.16 5.36 5.07 5.69 4.59 6.56L3.4 8.69c-.48.88-.16 1.97.72 2.45l.99.55C5.06 11.53 5 11.76 5 12c0 .47.13.93.4 1.34l-.99.56c-.88.48-1.2 1.58-.72 2.45l1.19 2.13c.48.87 1.57 1.21 2.44.74L14 15.73V16c0 1.1.9 2 2 2s2-.9 2-2v-2c1.66 0 3-1.79 3-4s-1.34-3-3-3z'
const ICON_SPARKLE = 'M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 17l2.75 1.25L19 21l1.25-2.75L23 19l-2.75-1.25z'
const ICON_BRUSH = 'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z'
const ICON_BOLT = 'M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z'
const ICON_HEADSET = 'M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z'
const ICON_CHART = 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z'

const agents = [
  { name: 'Spark', role: 'Social Media', color: 'var(--agent-spark)', colorMuted: 'var(--agent-spark-muted)', desc: 'Drafts, schedules, and publishes across all platforms. Trends-aware and always on-brand.', svg: ICON_CAMPAIGN },
  { name: 'Pixel', role: 'Copywriter', color: 'var(--agent-pixel)', colorMuted: 'var(--agent-pixel-muted)', desc: 'Long-form content, ad copy, emails, and landing pages. Learns your voice over time.', svg: ICON_SPARKLE },
  { name: 'Nova', role: 'Designer', color: 'var(--agent-nova)', colorMuted: 'var(--agent-nova-muted)', desc: 'Generates and scores the best image outputs across GPT-4o + Gemini. On-brand every time.', svg: ICON_BRUSH },
  { name: 'Bolt', role: 'Automation', color: 'var(--agent-bolt)', colorMuted: 'var(--agent-bolt-muted)', desc: 'Connects your tools, triggers workflows, and handles repetitive tasks 24/7 automatically.', svg: ICON_BOLT },
  { name: 'Cleo', role: 'Service', color: 'var(--agent-cleo)', colorMuted: 'var(--agent-cleo-muted)', desc: 'Responds to leads and customers on WhatsApp. Qualifies, nurtures, and escalates when needed.', svg: ICON_HEADSET },
  { name: 'Atlas', role: 'Analytics', color: 'var(--info)', colorMuted: 'var(--info-muted)', desc: "Tracks performance, surfaces insights, and tells you what's working before you have to ask.", svg: ICON_CHART },
]

const steps = [
  {
    num: '01',
    title: 'Subscribe',
    desc: 'Pick a plan and activate the agents you need. No setup fee, no onboarding call, no credit card required.',
  },
  {
    num: '02',
    title: 'Assign',
    desc: "Give tasks via the dashboard or just message your agents on WhatsApp — exactly like you'd work with a real team.",
  },
  {
    num: '03',
    title: 'Done',
    desc: 'Review, approve, and publish. Your agents learn your preferences over time and need less guidance with each task.',
  },
]

const features = [
  { title: 'Multi-model routing', desc: 'Auto-selects the best AI model (Claude, GPT-4o, Gemini) for each task — balancing speed, cost, and quality.', icon: '🔀' },
  { title: 'WhatsApp-native', desc: 'Your entire AI workforce is accessible from a single WhatsApp thread. No new apps, no context switching.', icon: '💬' },
  { title: 'Real-time credit meter', desc: 'Track credit usage per agent with live updates. Set limits and alerts before you hit them.', icon: '📊' },
  { title: 'Team collaboration', desc: 'Invite teammates, assign roles, and review AI output together with a full audit trail.', icon: '👥' },
  { title: 'Analytics & insights', desc: 'Understand what performs, which agents drive ROI, and where to double down.', icon: '📈' },
  { title: 'Agent marketplace', desc: 'Add specialists as you grow. Start with one agent, scale to a full AI department on demand.', icon: '🏪' },
]

const pricingPlans = [
  {
    tier: 'STARTER',
    price: '$0',
    period: '/mo',
    desc: 'Free forever. No card required.',
    cta: 'Get started free',
    ctaVariant: 'secondary' as const,
    features: ['1 active agent', '500 credits / month', 'Dashboard access', 'WhatsApp integration', 'Community support'],
    highlighted: false,
  },
  {
    tier: 'PRO',
    price: '$49',
    period: '/mo',
    desc: 'For growing businesses and teams.',
    cta: 'Start Pro trial',
    ctaVariant: 'primary' as const,
    features: ['All 6 agents', '10,000 credits / month', 'Team workspace — 5 seats', 'Analytics dashboard', 'Priority support', 'API access'],
    highlighted: true,
  },
  {
    tier: 'ENTERPRISE',
    price: 'Custom',
    period: '',
    desc: 'Tailored for larger organisations.',
    cta: 'Talk to sales',
    ctaVariant: 'secondary' as const,
    features: ['Unlimited agents', 'Unlimited credits', 'Unlimited team seats', 'Custom integrations', 'Dedicated success manager', 'SLA guarantee'],
    highlighted: false,
  },
]

/* ── Helpers ── */

const SectionLabel = ({ children }: { children: string }) => (
  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', fontFamily: font, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
    {children}
  </span>
)


/* ── Features Section (Figma 1033:6333)
   1440×611 section. Header is LEFT-aligned at full 1296 width, followed by a
   big CENTER-aligned label (48/56 Regular) that shows the name of the currently
   active feature, followed by a row of four 309×188 cards — each card shows
   only the body copy (no title, no illustration) per the latest Figma.

   Interaction: the big label cycles through all four feature names on a 2.4s
   interval, and when the user hovers a card the label jumps directly to that
   card's name (cycle pauses on hover). This gives the section the same feel as
   the old hero word-rotator while reading all four feature names to the user. */
const featuresList = [
  {
    name: 'Multi-model routing',
    desc: 'Auto-selects the best AI model (Claude, GPT-4o, Gemini) for each task — balancing speed, cost, and quality.',
  },
  {
    name: 'WhatsApp-native',
    desc: 'Your entire AI workforce is accessible from a single WhatsApp thread. No new apps, no context switching.',
  },
  {
    name: 'Team collaboration',
    desc: 'Invite teammates, assign roles, and review AI output together with a full audit trail.',
  },
  {
    name: 'Analytics & insights',
    desc: 'Understand what performs, which agents drive ROI, and where to double down.',
  },
]

/* Per-word slide-up reveal with brand-accent "ghost" layer behind.
   Mirrors the stringtune `.-s-word` + `p:before` pattern — see global.css for
   the class contract. Splits `text` on whitespace; each word gets its own
   inline-block mask (overflow: hidden) so translateY(100%) clips the inner
   span out of view. When `active` flips true, words slide up to 0 with a
   per-word stagger, revealing white text over the indigo ghost. */
function RevealText({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ')
  return (
    <span
      className={`clarity-reveal${active ? ' is-active' : ''}`}
      data-text={text}
    >
      {words.map((word, idx) => (
        <Fragment key={idx}>
          <span className="clarity-word-mask">
            <span
              className="clarity-word-inner"
              style={{ ['--word-index' as string]: idx } as CSSProperties}
            >
              {word}
            </span>
          </span>
          {idx < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  )
}

function FeaturesSection() {
  // Scroll-pinned section, recreated from the "Code with Clarity" layout on
  // string-tune.fiddle.digital. A tall outer section (≈4.5× viewport) wraps a
  // sticky 100vh stage; `--progress` (0→1) is driven by how far the section
  // has scrolled past the top of the viewport, and that progress:
  //   • drives the accent bar at the top (scaleX, clamped like the original)
  //   • picks which feature title is shown (floor(progress * featuresList.length))
  // The title transition itself (per-char blur + scale + opacity stagger) is
  // the same `.clarity-char` / `.clarity-label.is-active` contract defined in
  // global.css — swapping which label has `.is-active` re-triggers the cascade.
  //
  // NOTE: the stringtune original also parallax-translates the stage upward
  // (`translate: 0 calc(-40vh * var(--progress))`). We deliberately DO NOT do
  // that here — at our shorter 450vh track that drift is large enough to make
  // the stage appear to leave the viewport before all 4 features have played.
  // Keeping the stage locked in place makes the pin-for-4-features feel solid.
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = el.offsetHeight - vh // the scrollable range while pinned
      const scrolled = -rect.top
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0
      setProgress(p)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Map progress [0..1) to index [0..featuresList.length-1]. Using a slight
  // inset (0.999) so the final bucket isn't skipped at the very end.
  //
  // At progress === 0 the section hasn't been scrolled into yet — we force
  // shownIdx to -1 so NO card is revealed. This matters for the first card
  // specifically: without the gate, card 0 would be `.is-active` from page
  // load, so its word-reveal cascade would run off-screen before the user
  // ever scrolled to the section and they'd arrive to find it already white.
  const shownIdx = progress > 0
    ? Math.min(featuresList.length - 1, Math.floor(progress * 0.999 * featuresList.length))
    : -1
  const shownName = shownIdx >= 0 ? featuresList[shownIdx].name : ''

  // Progress bar matches `.c-clarity .progress:before` — scaleX of
  // min(progress * 1.25, 1) so it tops out 20% before the section ends.
  const barScale = Math.min(progress * 1.25, 1)

  return (
    <section
      id="features"
      className="feat-section"
      ref={sectionRef}
      style={{
        background: 'var(--bg-base)',
        position: 'relative',
        // 4.5× viewport of scroll track gives each feature ≈ 112vh of dwell
        // once the sticky stage is subtracted — enough for the per-char
        // cascade to finish before the next bucket kicks in.
        height: '450vh',
      }}
    >
      {/* Accent progress bar — sticky at the top of the section. */}
      <div
        aria-hidden
        style={{
          position: 'sticky',
          top: 0,
          height: 3,
          width: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            background: 'var(--brand-accent)',
            transform: `scaleX(${barScale})`,
            transformOrigin: '0 50%',
            transition: 'transform 120ms linear',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Pinned stage — stays in view while the outer section scrolls through.
          The sticky element itself has NO transform; the heading/cards react
          via progress-driven class swaps instead so the stage never visibly
          leaves the viewport while the 4 features cascade. Also lift it ~3px
          so it doesn't sit under the progress bar. */}
      <div
        className="feat-stage"
        style={{
          position: 'sticky',
          top: 0,
          marginTop: '-3px',
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 72px',
          boxSizing: 'border-box',
          gap: '60px',
        }}
      >
        {/* Header — LEFT-aligned across the full 1296 grid width */}
        <div
          className="feat-header"
          style={{
            width: '100%',
            maxWidth: '1296px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'flex-start',
            textAlign: 'left',
          }}
        >
          <h2
            className="feat-title"
            style={{
              fontSize: '44px',
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: '-0.3%',
              margin: 0,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>One platform. </span>
            <span style={{ color: 'var(--text-secondary)' }}>Every function.</span>
          </h2>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Everything you need to run your marketing, support, and operations — without growing your headcount.
          </p>
        </div>

        {/* Big rotating label — 48/56 Regular, centred. All four names are stacked
            absolutely; only the active one gets `.is-active`, which drives the
            per-char blur/scale/opacity transition defined in global.css. */}
        <div
          className="feat-rotating"
          aria-live="polite"
          style={{
            width: '100%',
            maxWidth: '1296px',
            height: '56px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {featuresList.map((f, i) => (
            <span
              key={f.name}
              className={`clarity-label${i === shownIdx ? ' is-active' : ''}`}
              aria-hidden={i === shownIdx ? undefined : true}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 400,
                lineHeight: '56px',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {Array.from(f.name).map((ch, idx) => (
                <span
                  key={idx}
                  className="clarity-char"
                  style={{ ['--char-index' as string]: idx } as React.CSSProperties}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          ))}
          {/* Accessible fallback so screen readers can still read the current label */}
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{shownName}</span>
        </div>

        {/* Feature stepper — numbered indicators, mobile only */}
        <div className="feat-stepper mobile-only" style={{ display: 'none', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
          {featuresList.map((_, i) => (
            <span
              key={i}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: i === shownIdx ? 'var(--brand-accent)' : 'var(--text-tertiary)',
                transition: 'color 320ms ease',
              }}
            >
              ({i + 1})
            </span>
          ))}
        </div>

        {/* Mobile-only animated description — uses the same RevealText
            word-slide-up animation as desktop. All descriptions are stacked
            absolutely (never display:none) so CSS transitions always fire.
            Only the active one gets `.is-active` which triggers the word
            slide-up; inactive words stay at translateY(100%) behind their
            masks. The ghost ::before is hidden on inactive via CSS. */}
        <div
          className="feat-desc-mobile mobile-only"
          style={{
            display: 'none',
            width: '100%',
            position: 'relative',
            minHeight: '96px',
          }}
        >
          {featuresList.map((f, i) => (
            <div
              key={f.name}
              className={`feat-desc-item${i === shownIdx ? ' feat-desc-item-active' : ''}`}
              style={{
                position: 'absolute',
                inset: 0,
                fontSize: '15px',
                fontWeight: 400,
                lineHeight: '22px',
                color: 'var(--text-primary)',
              }}
            >
              <RevealText text={f.desc} active={i === shownIdx} />
            </div>
          ))}
        </div>

        {/* Row of 4 feature cards — 309×188 each, body text only (Figma 1033:6338).
            Per Figma the card frames have NO fill and NO stroke — they're
            transparent containers for the body text, which is 16/24 Sora Regular
            sitting in a 24px padded box with 12px radius. The scroll-driven
            color shift (tertiary → white) comes entirely from the RevealText
            ghost layer, so cards themselves stay visually static. */}
        <div
          className="feat-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            width: '100%',
            maxWidth: '1296px',
          }}
        >
          {featuresList.map((f, i) => {
            // Progressive reveal — matches the stringtune reference recording:
            // as soon as a card's bucket is reached (or passed), its body text
            // stays revealed. Only cards AFTER the current scroll index keep
            // showing the gray ghost layer. Scrolling back up un-reveals in
            // reverse (per the faster leave transition in global.css).
            const revealed = i <= shownIdx
            return (
              <div
                key={f.name}
                className={i === shownIdx ? 'feat-card-active' : ''}
                style={{
                  height: '188px',
                  borderRadius: '12px',
                  background: 'transparent',
                  padding: '24px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  <RevealText text={f.desc} active={revealed} />
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Feature card (Figma feat-card 1033:6340 et al.)
   309×464, radius 12, bg --bg-surface, stroke 1px --border-strong, padding 24.
   Title Sora Bold 16/24 top · illustration middle · desc Sora Regular 13/18 bottom. */
function FeatureCard({
  title,
  desc,
  illustration,
}: {
  title: string
  desc: string
  illustration: React.ReactNode
}) {
  return (
    <div
      style={{
        height: '464px',
        borderRadius: '12px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 700,
          lineHeight: '24px',
          margin: 0,
          color: 'var(--text-primary)',
          textAlign: 'center',
        }}
      >
        {title}
      </h3>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {illustration}
      </div>
      <p
        style={{
          fontSize: '13px',
          lineHeight: '18px',
          margin: 0,
          color: 'var(--text-primary)',
          textAlign: 'center',
        }}
      >
        {desc}
      </p>
    </div>
  )
}

/* Multi-model routing — central chip with colored model tiles connected by dotted traces */
function MultiModelIllustration() {
  const dot = '#6B6B6B' // --text-tertiary
  return (
    <svg width="263" height="145" viewBox="0 0 263 145" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dotted connectors from chip to each tile */}
      <path d="M 131 78 C 90 78 90 42 60 42" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 131 78 C 90 78 90 68 60 68" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 131 78 C 90 78 90 96 60 96" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 131 78 C 90 78 90 115 60 115" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 131 78 L 191 65" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 131 78 C 170 78 180 95 200 95" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 191 65 C 220 65 220 28 244 28" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 191 65 L 244 59" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      <path d="M 191 65 C 220 65 220 91 244 91" stroke={dot} strokeWidth="0.7" strokeDasharray="1.5 3" fill="none" />
      {/* Left-side tiles */}
      <rect x="42" y="33" width="18" height="18" rx="3" fill="#F472B6" />
      <rect x="42" y="59" width="18" height="18" rx="3" fill="var(--agent-nova)" />
      <rect x="2" y="85" width="18" height="18" rx="3" fill="var(--brand-accent-dark)" />
      <rect x="50" y="106" width="18" height="18" rx="3" fill="#8B5CF6" />
      {/* Center orange (Spark) tile */}
      <rect x="182" y="56" width="18" height="18" rx="3" fill="var(--agent-spark)" />
      {/* Right column stacked brand-accent-light tiles */}
      <rect x="244" y="19" width="18" height="18" rx="3" fill="var(--brand-accent-light)" />
      <rect x="244" y="50" width="18" height="18" rx="3" fill="var(--brand-accent-light)" />
      <rect x="244" y="82" width="18" height="18" rx="3" fill="var(--brand-accent-light)" />
      {/* Yellow bottom-right + purple bottom */}
      <rect x="213" y="106" width="18" height="18" rx="3" fill="var(--agent-bolt)" />
      {/* Central CPU chip */}
      <g>
        <rect x="115" y="78" width="32" height="32" rx="3" fill="var(--brand-accent)" stroke="var(--border-strong)" strokeWidth="0.5" />
        <rect x="121" y="84" width="20" height="20" rx="2" fill="var(--bg-base)" />
        {/* Chip pins */}
        <rect x="118" y="75" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="125" y="75" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="132" y="75" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="139" y="75" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="118" y="110" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="125" y="110" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="132" y="110" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="139" y="110" width="2" height="4" fill="var(--text-tertiary)" />
        <rect x="111" y="82" width="4" height="2" fill="var(--text-tertiary)" />
        <rect x="111" y="89" width="4" height="2" fill="var(--text-tertiary)" />
        <rect x="111" y="96" width="4" height="2" fill="var(--text-tertiary)" />
        <rect x="111" y="103" width="4" height="2" fill="var(--text-tertiary)" />
        <rect x="147" y="82" width="4" height="2" fill="var(--text-tertiary)" />
        <rect x="147" y="89" width="4" height="2" fill="var(--text-tertiary)" />
        <rect x="147" y="96" width="4" height="2" fill="var(--text-tertiary)" />
        <rect x="147" y="103" width="4" height="2" fill="var(--text-tertiary)" />
      </g>
    </svg>
  )
}

/* WhatsApp-native — phone frame showing a chat list with agent avatars */
function WhatsAppIllustration() {
  const agents = [
    { name: 'cleo', time: '16:14', color: 'var(--agent-cleo)', pinned: true },
    { name: 'bolt', time: '19:45', color: 'var(--agent-bolt)', preview: 'Preview', unread: 1 },
    { name: 'nova', time: '19:42', color: 'var(--agent-nova)', read: true },
    { name: 'spark', time: '18:23', color: 'var(--agent-spark)' },
  ]
  return (
    <div
      style={{
        width: '170px',
        height: '238px',
        background: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: '#0A0A0A',
        fontFamily: 'Sora, sans-serif',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Status bar */}
      <div
        style={{
          height: '18px',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '7px',
          fontWeight: 600,
        }}
      >
        <span>23:59</span>
        <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          <span style={{ width: '7px', height: '5px', background: '#0A0A0A', borderRadius: '1px' }} />
          <svg width="7" height="5" viewBox="0 0 7 5"><path d="M0 5 L3.5 0 L7 5 Z" fill="#0A0A0A" /></svg>
          <span style={{ fontSize: '6px' }}>100</span>
        </span>
      </div>
      {/* Toolbar */}
      <div style={{ padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', letterSpacing: '1px' }}>···</span>
        <span style={{ display: 'flex', gap: '5px' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <span
            style={{
              width: '12px',
              height: '12px',
              background: '#22C55E',
              borderRadius: '50%',
              color: '#fff',
              fontSize: '10px',
              lineHeight: '12px',
              textAlign: 'center',
            }}
          >
            +
          </span>
        </span>
      </div>
      {/* Title */}
      <div style={{ padding: '4px 8px 2px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Chats</div>
        <div style={{ display: 'flex', gap: '3px', fontSize: '6px' }}>
          {['All', 'Unread', 'Favourites', 'Groups', '+'].map((t, i) => (
            <span
              key={t}
              style={{
                padding: '2px 5px',
                borderRadius: '999px',
                background: i === 0 ? '#0A0A0A' : '#E5E5E5',
                color: i === 0 ? '#fff' : '#525252',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      {/* Archived row */}
      <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '7px', borderBottom: '0.5px solid #E5E5E5' }}>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2">
          <rect x="3" y="3" width="18" height="5" rx="1" />
          <path d="M5 8v11a2 2 0 002 2h10a2 2 0 002-2V8" />
        </svg>
        <span style={{ color: '#525252' }}>Archived</span>
      </div>
      {/* Chat rows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {agents.map((a) => (
          <div
            key={a.name}
            style={{
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: '0.5px solid #F5F5F5',
            }}
          >
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: a.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '8px', fontWeight: 600 }}>{a.name}</div>
              {a.preview && (
                <div style={{ fontSize: '6px', color: '#737373' }}>{a.preview}</div>
              )}
              {a.read && (
                <svg width="8" height="5" viewBox="0 0 24 12" fill="none" stroke="#3B82F6" strokeWidth="3">
                  <path d="M2 7 L7 11 L15 2" />
                  <path d="M9 7 L14 11 L22 2" />
                </svg>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: '6px', color: a.unread ? '#22C55E' : '#737373' }}>{a.time}</span>
              {a.pinned && (
                <svg width="6" height="6" viewBox="0 0 24 24" fill="#737373">
                  <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7z" />
                </svg>
              )}
              {a.unread && (
                <span
                  style={{
                    background: '#22C55E',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '6px',
                    padding: '0 4px',
                    minWidth: '8px',
                    textAlign: 'center',
                  }}
                >
                  @
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Team collaboration — brain-in-a-vault with circuit traces */
function TeamIllustration() {
  return (
    <svg width="170" height="235" viewBox="0 0 170 235" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vault/archway body */}
      <path
        d="M 25 60 C 25 25 50 5 85 5 C 120 5 145 25 145 60 L 145 180 L 25 180 Z"
        fill="#FFFFFF"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      {/* Base plate */}
      <rect x="50" y="210" width="70" height="15" rx="2" fill="#1A1A1A" />
      <rect x="35" y="225" width="100" height="6" rx="1" fill="#1A1A1A" />
      {/* Brain (indigo) */}
      <path
        d="M 55 70 C 55 45 72 35 85 38 C 98 35 115 45 115 70 C 120 78 115 95 105 100 L 65 100 C 55 95 50 78 55 70 Z"
        fill="var(--brand-accent)"
      />
      {/* Brain wrinkles */}
      <path d="M 68 55 C 72 60 78 58 82 62" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <path d="M 86 50 C 90 55 95 52 100 58" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <path d="M 60 72 C 68 78 75 72 85 78" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <path d="M 90 78 C 100 82 108 78 112 72" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <path d="M 70 88 C 80 92 90 88 100 92" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      {/* Circuit chip base */}
      <rect x="55" y="145" width="60" height="20" rx="2" fill="#1A1A1A" />
      <rect x="58" y="148" width="54" height="14" rx="1" fill="#FFFFFF" />
      {/* Circuit traces from chip to brain */}
      {[62, 72, 82, 92, 102].map((x, i) => (
        <g key={i}>
          <path d={`M ${x} 145 L ${x} 125 L ${x + ((i - 2) * 3)} 110`} stroke="var(--brand-accent)" strokeWidth="1.2" fill="none" />
          <circle cx={x + ((i - 2) * 3)} cy="108" r="2.5" fill="var(--brand-accent)" />
        </g>
      ))}
    </svg>
  )
}

/* Analytics & insights — browser with bar chart + magnifying glass */
function AnalyticsIllustration() {
  return (
    <svg width="262" height="158" viewBox="0 0 262 158" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Browser window */}
      <rect x="60" y="10" width="195" height="130" rx="6" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
      {/* Browser top bar */}
      <rect x="60" y="10" width="195" height="14" rx="6" fill="#F5F5F5" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="68" cy="17" r="2" fill="#1A1A1A" />
      {/* Chart area */}
      <path d="M 75 110 L 250 110" stroke="#1A1A1A" strokeWidth="1" />
      {/* Area/wave chart (blue gradient) */}
      <path
        d="M 75 90 L 100 75 L 125 85 L 150 60 L 175 72 L 200 55 L 225 65 L 250 50 L 250 110 L 75 110 Z"
        fill="var(--brand-accent-light)"
        opacity="0.45"
      />
      <path
        d="M 75 90 L 100 75 L 125 85 L 150 60 L 175 72 L 200 55 L 225 65 L 250 50"
        stroke="var(--brand-accent)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Horizontal reference lines */}
      <path d="M 120 40 L 245 40" stroke="#B6B6B6" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M 160 120 L 245 120" stroke="#B6B6B6" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M 140 130 L 245 130" stroke="#B6B6B6" strokeWidth="0.5" strokeDasharray="2 2" />
      {/* Pie chart inside magnifier */}
      <g>
        {/* Magnifier lens (circle) */}
        <circle cx="115" cy="60" r="42" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
        {/* Pie slices */}
        <path d="M 115 60 L 115 25 A 35 35 0 0 1 147 50 Z" fill="var(--agent-spark)" />
        <path d="M 115 60 L 147 50 A 35 35 0 0 1 135 90 Z" fill="#FBBF24" />
        <path d="M 115 60 L 135 90 A 35 35 0 1 1 115 25 Z" fill="var(--brand-accent)" />
        {/* Handle */}
        <rect
          x="50"
          y="95"
          width="55"
          height="10"
          rx="3"
          fill="var(--agent-spark)"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          transform="rotate(-45 77 100)"
        />
      </g>
    </svg>
  )
}

/* ── Just-message-it Card (Figma prob-card 1479:44957 + messages-interaction 1607:58963)
   700×317 brand-accent-light pill with an embedded chat panel on the right.

   Figma component set reactions (SMART_ANIMATE, 400ms, EASE_IN_AND_OUT):
     Default (62)  MOUSE_ENTER → user-focus (60)
     user-focus    AFTER_TIMEOUT 0.8s → agent-focus (61) | MOUSE_LEAVE → Default
     agent-focus   AFTER_TIMEOUT 0.8s → default (59)     | MOUSE_LEAVE → Default
     default (59)  AFTER_TIMEOUT 0.8s → user-focus (60)  | MOUSE_LEAVE → Default

   Layer positions decoded from variant children:
     Default (62/59): user bubble compact top-right (120×36), Spark compact bottom-left (52×41)
     user-focus (60): user bubble enlarged 167×50 centred (y=41.5), Spark pushed down (y=144, off-frame)
     agent-focus (61): user bubble off-screen top (y=-46), Spark enlarged 93×60 centred with 16×16 icon */
function JustMessageCard() {
  const [hover, setHover] = useState(false)
  // 0 = default, 1 = user-focus, 2 = agent-focus.
  const [step, setStep] = useState(0)
  const ease = 'cubic-bezier(0.42, 0, 0.58, 1)'
  const trans = `transform 400ms ${ease}, opacity 400ms ${ease}, width 400ms ${ease}, height 400ms ${ease}, font-size 400ms ${ease}`

  useEffect(() => {
    if (!hover) { setStep(0); return }
    // On enter, jump to user-focus (Default → 60 per Figma)
    setStep(1)
    // Then cycle: user-focus → agent-focus → default → user-focus …
    const id = window.setInterval(() => setStep((s) => (s === 1 ? 2 : s === 2 ? 0 : 1)), 800)
    return () => window.clearInterval(id)
  }, [hover])

  // User-bubble transforms — matched to Figma "messages - interaction"
  // (1607:58963). Origin is top-right, so scale anchors the right edge;
  // translateX must stay 0 to keep the bubble right-aligned with the panel
  // (Figma: right padding = 13px in every variant).
  // Default → Variant 1: bubble width 120.66 → 167.40 (≈ 1.39×); top y
  // 20.7 → 41.46 (Δ +30 inside the panel). Variant 2 pushes user-msg above
  // the panel (Figma user-msg y = -45.96 from panel top, ≈ -67 from default
  // top inside the bubble's transform space).
  const userTransform =
    step === 1 ? 'translate(0, 30px) scale(1.39)' :            // enlarged, right-anchored
    step === 2 ? 'translate(0, -67px) scale(1)' :              // pushed off-screen top
    'translate(0, 0) scale(1)'                                  // default compact

  // Agent-section transforms — Figma "messages - interaction" (1607:58963).
  // Origin is bottom-left; translateX stays 0 so left edge sits at panel
  // padding (Figma: left padding = 13px in every variant). Default → Variant 2:
  // bubble width 52 → 93 (≈ 1.79×); bottom moves UP by ≈ 18 (default bottom
  // = 116 from panel top; variant 2 bottom = 98). Variant 1 pushes agent-msg
  // below the panel (Figma agent-msg y = 144 from panel top, panel = 137).
  const agentTransform =
    step === 1 ? 'translate(0, 70px) scale(1)' :               // pushed off-screen bottom
    step === 2 ? 'translate(0, -18px) scale(1.79)' :           // enlarged, left-anchored
    'translate(0, 0) scale(1)'                                  // default compact

  return (
    <div
      className="infra-card infra-card-pill"
      style={{
        flex: 1,
        height: '317px',
        borderRadius: '150px',
        background: 'var(--brand-accent-light)',
        border: '1px solid var(--border-strong)',
        padding: '50px 70px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* Content column */}
      <div className="infra-card-text" style={{ width: '270px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 className="infra-card-title"
          style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
            letterSpacing: '-0.3%',
            margin: 0,
            color: 'var(--text-inverse)',
          }}
        >
          Just message it.
        </h3>
        <p className="infra-card-desc" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-inverse)', margin: 0 }}>
          No dashboards to learn, no onboarding calls. Send your agent a message on WhatsApp —
          in plain language — and the work gets done. It really is that simple.
        </p>
      </div>

      {/* Messages panel */}
      <div
        className="infra-card-illus"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '270px',
          height: '137px',
          flexShrink: 0,
          background: 'var(--bg-base)',
          borderRadius: '12px',
          padding: '11px 13px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* User message — absolute positioned, scales & translates per variant */}
        <div
          style={{
            position: 'absolute',
            top: '11px',
            right: '13px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '3px',
            maxWidth: '165px',
            transformOrigin: 'top right',
            transform: userTransform,
            transition: trans,
          }}
        >
          <div
            style={{
              background: 'var(--bg-overlay)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '7px 10px',
              fontSize: '8px',
              lineHeight: '11px',
              fontWeight: 400,
            }}
          >
            Create 3 social media post variants for our new product launch. Focus on engagement and brand voice.
          </div>
          <span style={{ fontSize: '6px', color: 'var(--text-tertiary)' }}>You · 2 min ago</span>
        </div>

        {/* Agent section — absolute positioned, scales & translates per variant */}
        <div
          style={{
            position: 'absolute',
            left: '13px',
            bottom: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            transformOrigin: 'bottom left',
            transform: agentTransform,
            transition: trans,
          }}
        >
          {/* Agent header: Spark icon + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: 'var(--agent-spark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="7" height="7" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d={ICON_BOLT} />
              </svg>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-primary)' }}>Spark</span>
          </div>
          {/* Typing bubble — Figma message-bubble 1607:58699
              3 variants cycle via AFTER_TIMEOUT(1ms) + SMART_ANIMATE(400ms), so each
              dot grows to ~4.17px in turn and shrinks back to ~3.24px. Total loop ≈ 1.2s. */}
          <div
            style={{
              alignSelf: 'flex-start',
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '5px 7px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span className="jm-dot" style={{ background: 'var(--text-tertiary)', animationDelay: '0ms' }} />
            <span className="jm-dot" style={{ background: 'var(--text-tertiary)', animationDelay: '400ms' }} />
            <span className="jm-dot" style={{ background: 'var(--text-tertiary)', animationDelay: '800ms' }} />
          </div>
          <span style={{ fontSize: '6px', color: 'var(--text-tertiary)' }}>Spark · Generating...</span>
        </div>
      </div>
    </div>
  )
}

/* ── Know-what's-working Card (Figma 1479:45101 / 1479:44940)
   3 variants: Default → 1 → 2 (AFTER_TIMEOUT 0.8s) ↔ 1 (MOUSE_LEAVE → Default).
   Default = monochrome illustrations. On hover, illustrations colour-shift to
   brand-accent and subtly oscillate between the two "active" states every 800ms,
   matching the Figma SMART_ANIMATE / EASE_IN_AND_OUT / 600ms transition. */
function KnowCard() {
  const [hover, setHover] = useState(false)
  const [pulse, setPulse] = useState(false)
  const ease = 'cubic-bezier(0.42, 0, 0.58, 1)'

  // While hovered, toggle between two "active" sub-states every 800ms.
  useEffect(() => {
    if (!hover) { setPulse(false); return }
    const id = window.setInterval(() => setPulse((p) => !p), 800)
    return () => window.clearInterval(id)
  }, [hover])

  const active = hover
  const barFill = active ? 'var(--brand-accent)' : '#2A2A2A'
  const topBarFill = active ? 'var(--brand-accent)' : '#2A2A2A'
  const listFill = active ? 'var(--brand-accent)' : '#3A3A3A'
  const shadowStroke = active ? 'var(--brand-accent)' : '#4F4F4F'
  const fillTrans = `fill 600ms ${ease}, stroke 600ms ${ease}`
  const shiftTrans = `transform 600ms ${ease}`

  return (
    <div
      className="infra-card infra-card-rect"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        height: '317px',
        borderRadius: '24px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        padding: '50px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Content */}
      <div className="infra-card-text" style={{ width: '249px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 className="infra-card-title"
          style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
            letterSpacing: '-0.3%',
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          Know what's working.
        </h3>
        <p className="infra-card-desc" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-primary)', margin: 0 }}>
          Atlas tracks every agent's output, surfaces what performs, and tells you where to double down —
          before you have to ask. No spreadsheets, no guesswork.
        </p>
      </div>

      {/* Illustrations wrapper — absolutely positioned on desktop, flows on mobile */}
      <div className="infra-card-illus infra-know-illus" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/* Browser + chart illustration (top-right) */}
      <svg
        width="97"
        height="81"
        viewBox="0 0 97 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '78px',
          left: '300px',
          transition: shiftTrans,
          transform: active && pulse ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {/* Browser body */}
        <rect x="0" y="0" width="97" height="81" rx="6" fill="#FFFFFF" stroke="#D4D4D4" strokeWidth="0.5" />
        {/* Top bar */}
        <rect x="0" y="0" width="97" height="19" rx="6" fill={topBarFill} style={{ transition: fillTrans }} />
        <rect x="0" y="13" width="97" height="6" fill={topBarFill} style={{ transition: fillTrans }} />
        {/* Traffic light circle */}
        <circle cx="9" cy="9.5" r="3.5" fill="#FFFFFF" />
        {/* Chart header line */}
        <rect x="30" y="32" width="33" height="1" fill="#000000" />
        {/* Chart separator */}
        <rect x="0" y="19" width="97" height="0.8" fill="#000000" opacity="0.2" />
        {/* Bars */}
        <rect x="11" y="46" width="7" height="28" rx="0.5" fill={barFill} style={{ transition: fillTrans }} />
        <rect x="22" y="54" width="7" height="20" rx="0.5" fill={barFill} style={{ transition: fillTrans }} />
        <rect x="33" y="58" width="7" height="16" rx="0.5" fill={barFill} style={{ transition: fillTrans }} />
        <rect x="44" y="50" width="7" height="24" rx="0.5" fill={barFill} style={{ transition: fillTrans }} />
        <rect x="55" y="56" width="7" height="18" rx="0.5" fill={barFill} style={{ transition: fillTrans }} />
        <rect x="66" y="52" width="7" height="22" rx="0.5" fill={barFill} style={{ transition: fillTrans }} />
        <rect x="77" y="42" width="7" height="32" rx="0.5" fill={barFill} style={{ transition: fillTrans }} />
      </svg>

      {/* List card illustration (bottom-right) */}
      <div
        style={{
          position: 'absolute',
          top: '186px',
          left: '323px',
          width: '108px',
          height: '55px',
        }}
      >
        {/* Shadow card (offset down-right) */}
        <svg
          width="108"
          height="55"
          viewBox="0 0 108 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0 }}
        >
          <rect
            x="7.5"
            y="7.5"
            width="100"
            height="47"
            rx="6"
            fill="none"
            stroke={shadowStroke}
            strokeWidth="1"
            strokeDasharray={active ? '2 2' : '0 0'}
            style={{ transition: fillTrans }}
          />
        </svg>
        {/* Main card */}
        <svg
          width="108"
          height="55"
          viewBox="0 0 108 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            inset: 0,
            transition: shiftTrans,
            transform: active && pulse ? 'translate(-2px, -2px)' : 'translate(0, 0)',
          }}
        >
          <rect
            x="0"
            y="0"
            width="100"
            height="47"
            rx="6"
            fill={listFill}
            style={{ transition: fillTrans }}
          />
          {/* List rows */}
          <rect x="13" y="12" width="8" height="8" rx="1.5" fill="#FFFFFF" />
          <rect x="29" y="13" width="24" height="1.2" fill="#FFFFFF" />
          <rect x="29" y="19" width="13" height="1.2" fill="#FFFFFF" />
          <rect x="13" y="28" width="8" height="8" rx="1.5" fill="#FFFFFF" />
          <rect x="29" y="29" width="24" height="1.2" fill="#FFFFFF" />
          <rect x="29" y="35" width="17" height="1.2" fill="#FFFFFF" />
        </svg>
      </div>
      </div>{/* end infra-card-illus wrapper */}
    </div>
  )
}

/* ── Work-while-you-sleep Card (Figma prob-card 3 - Interaction 1707:66623)
   455×317 rect card with text on the left and an orbit illustration on the right.
   Orbit = 165×205: dashed 165px circle with an "atom" icon pinned to the top of the
   ring and a "</>" icon pinned to the bottom.

   Variants (SMART_ANIMATE, EASE_IN_AND_OUT):
     Default  → orbit stroke + icon circles are WHITE, icon glyphs are #3A3A3A
     hover    → orbit stroke = brand-accent, icon circles = brand-accent-dark,
                icon glyphs flip to WHITE
   The orbit also rotates slowly on hover so it reads as "always working". */
function WorkWhileCard() {
  const [hover, setHover] = useState(false)
  const ease = 'cubic-bezier(0.42, 0, 0.58, 1)'
  const orbitStroke = hover ? 'var(--brand-accent)' : '#FFFFFF'
  const iconBg = hover ? 'var(--brand-accent-dark)' : '#FFFFFF'
  const iconFg = hover ? '#FFFFFF' : '#3A3A3A'
  const colorTrans = `stroke 320ms ${ease}, fill 320ms ${ease}, background 320ms ${ease}`

  return (
    <div
      className="infra-card infra-card-rect"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '455px',
        height: '317px',
        borderRadius: '24px',
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-strong)',
        // Figma absolute insets: left 32, right 26, top 61. Content (216w) +
        // gap (16) + orbit (165w) = 397 — exactly fills the 397px inner width
        // after the 32/26 horizontal insets. Using padding:50 overflowed.
        padding: '61px 26px 50px 32px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '16px',
        cursor: 'pointer',
      }}
    >
      {/* Left — text column (216 wide per Figma 'content' frame).
          Figma 1707:66569: content frame top = 49px from card top (vertically
          centered in the 317-tall card). Card padding-top is 61px to anchor
          the orbit; the text column pulls itself up 12px with marginTop so its
          top edge lands at 49 — matching the Figma interaction exactly. */}
      <div className="infra-card-text" style={{ width: '216px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '-12px' }}>
        <h3 className="infra-card-title"
          style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
            letterSpacing: '-0.3%',
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          Work while you sleep.
        </h3>
        <p className="infra-card-desc" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-primary)', margin: 0 }}>
          5 specialized agents handle your content, design, support, and automation — 24 hours a day, every day. The work never stops because your team never clocks out.
        </p>
      </div>

      {/* Right — orbit illustration (165×205). The dashed ring rotates slowly
          on hover while the two icon circles stay anchored to their
          top/bottom positions (counter-rotation keeps them upright). */}
      <div
        className="infra-card-illus"
        style={{
          width: '165px',
          height: '205px',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Dashed orbit ring — 165×165, offset y=21 */}
        <svg
          width="165"
          height="165"
          viewBox="0 0 165 165"
          fill="none"
          style={{
            position: 'absolute',
            top: '21px',
            left: 0,
            animation: hover ? 'wwys-orbit-spin 12s linear infinite' : 'none',
            transformOrigin: 'center',
          }}
        >
          <circle
            cx="82.5"
            cy="82.5"
            r="82"
            stroke={orbitStroke}
            strokeWidth="1"
            strokeDasharray="9 9"
            style={{ transition: colorTrans }}
          />
        </svg>

        {/* Atom icon — 42×42 at top of ring (x=58, y=0 per Figma) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '58px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: colorTrans,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 43 43" fill="none">
            {/* Atom orbital paths + central nucleus — all recoloured via iconFg */}
            <path d="M25.9229 9.1749C27.8949 10.0162 27.9936 15.8749 24.9816 22.9376C21.9696 30.0003 17.6722 33.9842 15.6989 33.1429C13.7262 32.3029 13.6273 26.4429 16.6402 19.3802C19.6522 12.3176 23.9496 8.33357 25.9229 9.1749ZM15.2042 34.3043C16.7309 34.9549 18.7309 34.1056 20.8363 31.9136C22.7963 29.8682 24.6802 26.8576 26.1416 23.4323C27.6016 20.0083 28.4709 16.5643 28.5896 13.7349C28.7149 10.6976 27.9442 8.66691 26.4162 8.01491C24.8896 7.36291 22.8896 8.21227 20.7856 10.4056C18.8243 12.4496 16.9402 15.4616 15.4789 18.8856C14.0189 22.3096 13.1502 25.7536 13.032 28.5842C12.9054 31.6202 13.6768 33.6509 15.2042 34.3043Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M15.8663 11.5019C16.2089 11.6486 16.5689 11.8232 16.9423 12.0246C19.3036 13.2992 21.8943 15.4886 24.2356 18.1899C29.2663 23.9899 30.9663 29.5979 29.3449 31.0033C28.5276 31.7126 26.8263 31.4539 24.6769 30.2952C22.3156 29.0206 19.7263 26.8299 17.3836 24.1299C15.0423 21.4286 13.2419 18.5553 12.3147 16.0366C11.4709 13.7459 11.4569 12.0259 12.2747 11.3152C12.9501 10.7299 14.2289 10.8046 15.8663 11.5019ZM25.2343 31.9646C27.3756 32.8766 29.1036 32.8819 30.1716 31.9552C31.4249 30.8672 31.5383 28.6979 30.4876 25.8459C29.5089 23.1886 27.6276 20.1753 25.1889 17.3633C22.7489 14.5499 20.0343 12.2592 17.5409 10.9152C14.8676 9.47257 12.7028 9.27525 11.448 10.3633C10.1939 11.4513 10.0809 13.6206 11.1313 16.4726C12.1105 19.1313 13.9929 22.1432 16.4316 24.9566C18.8703 27.7686 21.5863 30.0593 24.0783 31.4046C24.4756 31.6179 24.8623 31.8059 25.2343 31.9646Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M31.2026 18.0429C32.8386 18.7415 33.7786 19.6122 33.8226 20.5056C33.9293 22.6482 28.7053 25.3029 21.0373 25.6882C17.4679 25.8669 14.0946 25.5135 11.5401 24.6909C9.21608 23.9429 7.85262 22.8935 7.79795 21.8109C7.74368 20.7309 8.99581 19.5496 11.2333 18.5736C13.6926 17.4989 17.0133 16.8082 20.5826 16.6309C24.1519 16.4509 27.5253 16.8056 30.0799 17.6282C30.4839 17.7576 30.8586 17.8962 31.2026 18.0429ZM9.94941 25.4442C10.3223 25.6029 10.7239 25.7522 11.1537 25.8909C13.8494 26.7575 17.3826 27.1335 21.0999 26.9469C24.8186 26.7602 28.2959 26.0336 30.8919 24.9002C33.6773 23.6842 35.1653 22.1015 35.0826 20.4429C34.9986 18.7842 33.3599 17.3589 30.4666 16.4269C27.7706 15.5602 24.2373 15.1842 20.52 15.3709C16.8013 15.5576 13.3245 16.2842 10.7286 17.4189C7.94315 18.6349 6.45514 20.2162 6.53848 21.8749C6.60928 23.2882 7.80888 24.5309 9.94941 25.4442Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M17.9267 19.9281C17.248 21.5214 17.988 23.3615 19.5787 24.0401C21.1707 24.7188 23.0107 23.9788 23.6907 22.3868C24.3694 20.7961 23.6294 18.9548 22.0374 18.2761C20.4467 17.5974 18.6054 18.3375 17.9267 19.9281Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M26.3237 10.2617C25.9251 11.1977 26.3598 12.279 27.2944 12.6776C28.2304 13.0776 29.3118 12.6417 29.7104 11.707C30.1091 10.7723 29.6744 9.69098 28.7397 9.29232C27.8051 8.89232 26.7237 9.32699 26.3237 10.2617Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M6.44772 19.2896C6.04919 20.2256 6.48359 21.307 7.41906 21.7043C8.35399 22.1043 9.43519 21.6696 9.83466 20.7349C10.2325 19.7989 9.79866 18.7176 8.86332 18.3189C7.92786 17.9189 6.84666 18.3549 6.44772 19.2896Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M28.5027 26.4417C28.104 27.3763 28.5373 28.4577 29.4733 28.8577C30.408 29.255 31.4893 28.8204 31.8893 27.8857C32.288 26.951 31.8533 25.8684 30.9173 25.471C29.9826 25.071 28.9013 25.5057 28.5027 26.4417Z" fill={iconFg} style={{ transition: colorTrans }} />
          </svg>
        </div>

        {/* </> code icon — 42×42 at bottom of ring (x=64, y=163 per Figma) */}
        <div
          style={{
            position: 'absolute',
            top: '163px',
            left: '64px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: colorTrans,
          }}
        >
          <svg width="22" height="13" viewBox="0 0 27 16" fill="none">
            <path d="M8.65997 4.60952V6.13333L0 8.87619V7.40952L8.65997 4.60952ZM0 8.34286L8.65997 11.0857V12.5714L0 9.77143V8.34286ZM1.38401 7.82857V9.39048H0.790865V7.82857H1.38401Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M10.5945 16L14.6279 0H16.4074L12.3739 16H10.5945Z" fill={iconFg} style={{ transition: colorTrans }} />
            <path d="M18.34 12.5714V11.0476L27 8.30476V9.77143L18.34 12.5714ZM27 8.8381L18.34 6.09524V4.60952L27 7.40952V8.8381ZM25.616 9.35238V7.79048H26.2091V9.35238H25.616Z" fill={iconFg} style={{ transition: colorTrans }} />
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ── Prob Card (Figma 1479:44943) with chip illustration (Figma 1436:42259)
   Default: chip with traces extending outward.
   On hover: traces retract into the chip body (600ms ease-in-out smart animate). */
function ProbCard() {
  const [hover, setHover] = useState(false)
  const traceEase = 'cubic-bezier(0.42, 0, 0.58, 1)' // EASE_IN_AND_OUT

  // Chip centered at (117, 93) within 234×186 viewBox. Traces emanate outward
  // from the chip edges; on hover each side's group collapses toward center
  // so the traces appear to retract into the chip body.
  const traceStyle = (dx: number, dy: number): CSSProperties => ({
    transform: hover ? `translate(${dx}px, ${dy}px)` : 'translate(0, 0)',
    opacity: hover ? 0 : 1,
    transition: `transform 600ms ${traceEase}, opacity 600ms ${traceEase}`,
  })

  return (
    <div
      className="infra-card infra-card-pill"
      style={{
        width: '700px',
        height: '317px',
        borderRadius: '150px',
        background: 'var(--brand-accent-dark)',
        border: '1px solid var(--border-strong)',
        padding: '50px 70px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* Content column */}
      <div className="infra-card-text" style={{ width: '306px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 className="infra-card-title"
          style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
            letterSpacing: '-0.3%',
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          Best model for Every task.
        </h3>
        <p className="infra-card-desc" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-primary)', margin: 0 }}>
          RunStack picks between Claude, GPT-4o, and Gemini for every single task — automatically.
          You get the best output, not whoever you remembered to switch to.
        </p>
      </div>

      {/* Chip illustration */}
      <div
        className="infra-card-illus"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ width: '234px', height: '186px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="234" height="186" viewBox="0 0 234 186" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Traces — TOP (retract downward into chip) */}
          <g style={traceStyle(0, 40)}>
            <path d="M 89 60 L 89 20" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 105 60 L 105 10" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 117 60 L 117 4" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 129 60 L 129 10" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 145 60 L 145 20" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <rect x="87" y="17" width="4" height="4" fill="#FFFFFF" />
            <rect x="103" y="7" width="4" height="4" fill="#FFFFFF" />
            <rect x="115" y="1" width="4" height="4" fill="#FFFFFF" />
            <rect x="127" y="7" width="4" height="4" fill="#FFFFFF" />
            <rect x="143" y="17" width="4" height="4" fill="#FFFFFF" />
          </g>

          {/* Traces — BOTTOM (retract upward) */}
          <g style={traceStyle(0, -40)}>
            <path d="M 89 126 L 89 166" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 105 126 L 105 176" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 117 126 L 117 182" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 129 126 L 129 176" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 145 126 L 145 166" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <rect x="87" y="165" width="4" height="4" fill="#FFFFFF" />
            <rect x="103" y="175" width="4" height="4" fill="#FFFFFF" />
            <rect x="115" y="181" width="4" height="4" fill="#FFFFFF" />
            <rect x="127" y="175" width="4" height="4" fill="#FFFFFF" />
            <rect x="143" y="165" width="4" height="4" fill="#FFFFFF" />
          </g>

          {/* Traces — LEFT (retract rightward) */}
          <g style={traceStyle(55, 0)}>
            <path d="M 84 73 L 40 73" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 84 85 L 24 85" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 84 93 L 12 93" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 84 101 L 24 101" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 84 113 L 40 113" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <rect x="36" y="71" width="4" height="4" fill="#FFFFFF" />
            <rect x="20" y="83" width="4" height="4" fill="#FFFFFF" />
            <rect x="8" y="91" width="4" height="4" fill="#FFFFFF" />
            <rect x="20" y="99" width="4" height="4" fill="#FFFFFF" />
            <rect x="36" y="111" width="4" height="4" fill="#FFFFFF" />
          </g>

          {/* Traces — RIGHT (retract leftward) */}
          <g style={traceStyle(-55, 0)}>
            <path d="M 150 73 L 194 73" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 150 85 L 210 85" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 150 93 L 222 93" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 150 101 L 210 101" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <path d="M 150 113 L 194 113" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="2 3" />
            <rect x="194" y="71" width="4" height="4" fill="#FFFFFF" />
            <rect x="210" y="83" width="4" height="4" fill="#FFFFFF" />
            <rect x="222" y="91" width="4" height="4" fill="#FFFFFF" />
            <rect x="210" y="99" width="4" height="4" fill="#FFFFFF" />
            <rect x="194" y="111" width="4" height="4" fill="#FFFFFF" />
          </g>

          {/* Chip body — static */}
          <rect x="84" y="60" width="66" height="66" rx="8" fill="var(--brand-accent)" stroke="#FFFFFF" strokeWidth="0.7" />
          <rect x="94" y="70" width="46" height="46" rx="4" fill="var(--brand-accent-dark)" stroke="#FFFFFF" strokeWidth="0.7" />
        </svg>
      </div>
    </div>
  )
}

/* ── Page ── */

const rotatingWords = ['automates tasks', 'handles support', 'reads analytics', 'writes copy']

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    setIsMobile(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  const stepRowRefs = useRef<(HTMLDivElement | null)[]>([])
  // -1 = no step reached yet (pre-scroll). Clamped to 0 in the stepper for
  // initial render so step 01 lights up from the start.
  const [activeStep, setActiveStep] = useState(-1)
  const [activeAgent, setActiveAgent] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [centeredCard, setCenteredCard] = useState(0)

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const onScroll = () => {
      const cards = el.querySelectorAll('.agents-carousel-card')
      const wrapRect = el.getBoundingClientRect()
      const wrapCenter = wrapRect.left + wrapRect.width / 2
      let closest = 0
      let minDist = Infinity
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.left + rect.width / 2
        const dist = Math.abs(wrapCenter - cardCenter)
        if (dist < minDist) { minDist = dist; closest = i }
      })
      setCenteredCard(closest)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [])
  // Scroll-driven reveal for the agents tree. We track the tree container's
  // viewport top + viewport height — each tree element computes its own
  // 0→1 reveal based on where IT sits within the viewport, so every element
  // (logo, arrow, card) fades in exactly as it scrolls into view rather than
  // being gated on a single global progress value (which made bottom-row
  // elements stay invisible even after they were on screen).
  const [treeViewport, setTreeViewport] = useState<{ top: number; vh: number }>(() => ({
    top: typeof window === 'undefined' ? 1000 : window.innerHeight,
    vh: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))
  const agentsSectionRef = useRef<HTMLElement | null>(null)
  const treeRef = useRef<HTMLDivElement | null>(null)

  // Sample the tree's current top + viewport height. Pure helper so we can
  // call it synchronously on mount and every frame from rAF.
  const sampleTreeViewport = () => {
    const el = treeRef.current
    if (!el) return null
    return { top: el.getBoundingClientRect().top, vh: window.innerHeight }
  }

  // Seed treeViewport synchronously after layout (before paint) so users who
  // load the page with the agents section already in view don't see a
  // one-frame flash of invisible tree elements.
  useLayoutEffect(() => {
    const v = sampleTreeViewport()
    if (v) setTreeViewport(v)
  }, [])

  // Continuously sample tree position with rAF. Lenis's smooth-scroll damping
  // makes scroll events fire out of sync with the rendered scroll position —
  // sampling every paint keeps the cascade tight to what the user sees. The
  // 0.5px guard avoids re-rendering when nothing meaningful has changed.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const v = sampleTreeViewport()
      if (v) {
        setTreeViewport((prev) => {
          if (Math.abs(prev.top - v.top) > 0.5 || prev.vh !== v.vh) return v
          return prev
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      setWordIndex((prev) => (prev === rotatingWords.length - 1 ? 0 : prev + 1))
    }, 2000)
    return () => clearTimeout(id)
  }, [wordIndex])

  // Active step = whichever sticky card is currently pinned at the top of the stack.
  // Each card has position: sticky with top ~156 + i*22. As the user scrolls, the
  // next card slides up to its sticky offset and visually rests on top of the
  // previous one — every card that has reached its pin gets counted, so activeStep
  // climbs 0→1→2 as the stack builds.
  useEffect(() => {
    const els = stepRowRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (els.length === 0) return

    const computeActive = () => {
      let active = -1
      els.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        const stickyTop = 156 + i * 22
        // 24px tolerance so the highlight flips just before the card fully locks.
        if (rect.top <= stickyTop + 24) active = i
      })
      setActiveStep((prev) => (prev === active ? prev : active))
    }

    let raf = 0
    const tick = () => {
      computeActive()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', computeActive, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', computeActive)
    }
  }, [])

  // ═══ Smooth scrolling (pixels.studio-style inertia via Lenis) ═══
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // ═══ Text reveal on scroll (pixels.studio-style) ═══
  useEffect(() => {
    const root = document.querySelector('[data-reveal-root]')
    if (!root) return
    const targets = root.querySelectorAll<HTMLElement>('h1, h2, h3, p')
    targets.forEach((el) => el.classList.add('reveal-on-scroll'))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])


  return (
    <div data-reveal-root style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: font, minHeight: '100vh' }}>

      {/* ═══ NAV ═══ */}
      <div
        className="nav-outer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: isScrolled ? '12px 16px 0' : '0',
          transition: 'padding 300ms ease',
          borderBottom: isScrolled ? '1px solid transparent' : '1px solid var(--border-subtle)',
          background: isScrolled ? 'transparent' : 'var(--bg-base)',
        }}
      >
        <nav
          className="nav-bar"
          style={{
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isScrolled ? '0 24px' : '0 72px',
            margin: '0 auto',
            maxWidth: isScrolled ? '1024px' : '100%',
            background: isScrolled ? 'rgba(17, 17, 17, 0.7)' : 'transparent',
            border: isScrolled ? '1px solid var(--border-default)' : '1px solid transparent',
            borderRadius: isScrolled ? 'var(--radius-xl)' : '0',
            backdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'none',
            transition: 'all 300ms ease',
          }}
        >
          {/* Logo — Figma "Property 1=Logo, Property 2=Brand" (1362:33597), 129×15px
              Icon (Frame 38): Fevicon 27×15px, brand-accent
              Wordmark (Frame 36): 96×15px at x:33 — Run(37×15 at x:0) + Stack(55×15 at x:41), white */}
          <svg width="129" height="15" viewBox="0 0 129 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            {/* Fevicon icon — 27×15, brand-accent */}
            <path d="M8.33622 8.28859L13.5 3.16555L18.6637 8.28859L20.25 6.71141L13.5 0L6.74997 6.71141L8.33622 8.28859Z" fill="var(--brand-accent)"/>
            <path d="M15.0863 15L20.25 9.87696L25.4138 15L27 13.4228L20.25 6.71141L13.5 13.4228L15.0863 15Z" fill="var(--brand-accent)"/>
            <path d="M1.58625 15L6.75 9.87696L11.9138 15L13.5 13.4228L6.74997 6.71141L0 13.4228L1.58625 15Z" fill="var(--brand-accent)"/>
            {/* "Run" — 37×15, white, at x:33 */}
            <g transform="translate(33, 0)">
              <path d="M0 14.6609V0H2.85006V14.6609H0ZM8.9516 14.6609L4.45573 8.31782H7.647L12.2834 14.6609H8.9516ZM2.00709 9.79388V7.5H5.74027C6.26211 7.5 6.71036 7.39362 7.08501 7.18085C7.47305 6.96808 7.77411 6.66888 7.9882 6.28324C8.20229 5.89761 8.30933 5.45878 8.30933 4.96675C8.30933 4.46144 8.20229 4.01596 7.9882 3.63032C7.77411 3.24468 7.47305 2.94548 7.08501 2.73271C6.71036 2.51995 6.26211 2.41356 5.74027 2.41356H2.00709V0H5.4392C6.61669 0 7.63362 0.172872 8.48997 0.518616C9.35971 0.864361 10.0287 1.38963 10.4971 2.09441C10.9654 2.7992 11.1995 3.68351 11.1995 4.74734V5.06649C11.1995 6.14362 10.9587 7.02793 10.477 7.71941C10.0087 8.4109 9.34633 8.92952 8.48997 9.27527C7.63362 9.62101 6.61669 9.79388 5.4392 9.79388H2.00709Z" fill="white"/>
              <path d="M17.8791 15C16.6213 15 15.6445 14.5878 14.9487 13.7633C14.2663 12.9388 13.9251 11.7154 13.9251 10.0931V3.80984H16.7149V10.3324C16.7149 10.9973 16.9023 11.5293 17.2769 11.9282C17.6516 12.3138 18.16 12.5066 18.8023 12.5066C19.4446 12.5066 19.9664 12.3005 20.3678 11.8883C20.7826 11.4761 20.99 10.9176 20.99 10.2128V3.80984H23.7799V14.6609H21.5721V10.0532H21.7929C21.7929 11.1436 21.6524 12.0545 21.3714 12.7859C21.0904 13.5173 20.6689 14.0691 20.1069 14.4415C19.5449 14.8138 18.8425 15 17.9995 15H17.8791Z" fill="white"/>
              <path d="M26.9846 14.6609V3.82979H29.1924V8.47739H28.9917C28.9917 7.37367 29.1389 6.45612 29.4333 5.72473C29.7277 4.98005 30.1625 4.42154 30.7379 4.0492C31.3266 3.67686 32.0559 3.49069 32.9256 3.49069H33.046C34.344 3.49069 35.3274 3.90957 35.9965 4.74734C36.6655 5.57181 37 6.80851 37 8.45745V14.6609H34.2101V8.21809C34.2101 7.55319 34.0161 7.01463 33.6281 6.60239C33.2534 6.19016 32.7316 5.98404 32.0626 5.98404C31.3802 5.98404 30.8249 6.19681 30.3967 6.62234C29.9819 7.03457 29.7745 7.59308 29.7745 8.29787V14.6609H26.9846Z" fill="white"/>
            </g>
            {/* "Stack" — 55×15, white, at x:74 (33+41) */}
            <g transform="translate(74, 0)">
              <path d="M5.62104 15C4.40281 15 3.37659 14.8107 2.54238 14.4321C1.70816 14.0405 1.07257 13.5052 0.635594 12.8264C0.211865 12.1345 0 11.3577 0 10.4961H1.50954C1.50954 11.0444 1.64195 11.5601 1.90678 12.0431C2.18486 12.5131 2.62183 12.8982 3.2177 13.1984C3.82681 13.4856 4.62792 13.6292 5.62104 13.6292C6.5347 13.6292 7.28947 13.4987 7.88534 13.2376C8.49445 12.9765 8.94466 12.624 9.23598 12.1802C9.54053 11.7363 9.69281 11.2402 9.69281 10.6919C9.69281 10 9.41474 9.42559 8.85859 8.96867C8.31569 8.49869 7.49472 8.21802 6.39567 8.12663L4.72723 7.96997C3.48253 7.86553 2.48941 7.48694 1.74788 6.8342C1.0196 6.16841 0.655456 5.29373 0.655456 4.21018C0.655456 3.38773 0.85408 2.66319 1.25133 2.03655C1.64857 1.40992 2.21134 0.913838 2.93962 0.548303C3.68115 0.182768 4.56833 0 5.60117 0C6.64726 0 7.54106 0.189295 8.28259 0.567885C9.03736 0.93342 9.61336 1.44256 10.0106 2.0953C10.4079 2.74804 10.6065 3.50522 10.6065 4.36684H9.09694C9.09694 3.84465 8.97777 3.35509 8.73942 2.89817C8.50107 2.44125 8.12369 2.07572 7.60727 1.80157C7.09085 1.51436 6.42215 1.37076 5.60117 1.37076C4.81992 1.37076 4.17109 1.50131 3.65467 1.7624C3.15149 2.0235 2.7741 2.36945 2.52251 2.80026C2.28417 3.23107 2.16499 3.70104 2.16499 4.21018C2.16499 4.84987 2.39672 5.39164 2.86017 5.83551C3.32363 6.27937 3.99233 6.53394 4.86627 6.59922L6.5347 6.75587C7.51458 6.8342 8.34879 7.04961 9.03736 7.40209C9.73916 7.74151 10.2754 8.1919 10.6462 8.75326C11.017 9.30157 11.2023 9.94778 11.2023 10.6919C11.2023 11.5274 10.9706 12.2715 10.5072 12.9243C10.057 13.577 9.41474 14.0862 8.58052 14.4517C7.7463 14.8172 6.75981 15 5.62104 15Z" fill="white"/>
              <path d="M18.2985 14.7846C17.5702 14.7846 16.9412 14.6802 16.4116 14.4713C15.8819 14.2624 15.4714 13.9099 15.1801 13.4138C14.8888 12.9047 14.7431 12.2258 14.7431 11.3773V1.03786H16.1732V11.5927C16.1732 12.1932 16.3387 12.6567 16.6698 12.983C17.0008 13.2963 17.4709 13.453 18.08 13.453H19.9669V14.7846H18.2985ZM12.8562 5.42428V4.30809H19.9669V5.42428H12.8562Z" fill="white"/>
              <path d="M29.2018 14.6671V11.5535H28.9634V7.87206C28.9634 7.10183 28.7582 6.51436 28.3477 6.10966C27.9372 5.69191 27.3016 5.48303 26.4409 5.48303C26.0437 5.48303 25.6398 5.48956 25.2293 5.50261C24.8321 5.51567 24.4481 5.53525 24.0773 5.56136C23.7198 5.57441 23.402 5.59399 23.1239 5.6201V4.32768C23.4152 4.30157 23.7132 4.27546 24.0177 4.24935C24.3223 4.22324 24.6335 4.21018 24.9513 4.21018C25.2823 4.19713 25.6001 4.1906 25.9047 4.1906C26.9772 4.1906 27.8379 4.32115 28.4868 4.58224C29.1488 4.84334 29.6321 5.25457 29.9367 5.81593C30.2413 6.36423 30.3935 7.0953 30.3935 8.00914V14.6671H29.2018ZM25.6464 14.9413C24.9049 14.9413 24.2495 14.8107 23.6801 14.5496C23.1107 14.2885 22.6671 13.9099 22.3493 13.4138C22.0447 12.9178 21.8925 12.3172 21.8925 11.6123C21.8925 10.9204 22.0514 10.3329 22.3692 9.84987C22.7002 9.36684 23.1703 9.0013 23.7794 8.75326C24.4017 8.49217 25.1499 8.36162 26.0238 8.36162H29.1025V9.47781H25.9245C25.0903 9.47781 24.4481 9.68016 23.9979 10.0849C23.5609 10.4765 23.3424 10.9922 23.3424 11.6319C23.3424 12.2846 23.5741 12.8068 24.0376 13.1984C24.501 13.577 25.13 13.7663 25.9245 13.7663C26.4145 13.7663 26.8845 13.6815 27.3347 13.5117C27.785 13.329 28.1623 13.0287 28.4669 12.611C28.7714 12.1802 28.937 11.5927 28.9634 10.8486L29.4004 11.4556C29.3475 12.2258 29.1621 12.8721 28.8443 13.3943C28.5265 13.9034 28.0961 14.2885 27.5532 14.5496C27.0103 14.8107 26.3747 14.9413 25.6464 14.9413Z" fill="white"/>
              <path d="M38.5438 15C37.6566 15 36.8819 14.8499 36.2199 14.5496C35.571 14.2363 35.0281 13.8185 34.5912 13.2963C34.1542 12.7611 33.8231 12.1736 33.598 11.5339C33.3862 10.8943 33.2802 10.248 33.2802 9.5953V9.32115C33.2802 8.65535 33.3862 8.00914 33.598 7.38251C33.8231 6.74282 34.1542 6.16841 34.5912 5.65927C35.0281 5.13708 35.571 4.72585 36.2199 4.42559C36.8819 4.11227 37.6433 3.95561 38.504 3.95561C39.378 3.95561 40.1526 4.11227 40.8279 4.42559C41.5165 4.7389 42.0726 5.18277 42.4964 5.75718C42.9201 6.33159 43.1717 7.01044 43.2511 7.79373H41.821C41.7019 7.07572 41.3576 6.48172 40.7882 6.01175C40.2321 5.52872 39.4707 5.28721 38.504 5.28721C37.6698 5.28721 36.9746 5.4765 36.4185 5.85509C35.8756 6.22063 35.4651 6.72324 35.187 7.36292C34.909 7.98956 34.7699 8.68799 34.7699 9.45822C34.7699 10.2154 34.909 10.9204 35.187 11.5731C35.4651 12.2128 35.8822 12.7285 36.4384 13.1201C36.9945 13.4987 37.6963 13.688 38.5438 13.688C39.1926 13.688 39.7554 13.577 40.2321 13.3551C40.722 13.1201 41.1126 12.8068 41.4039 12.4151C41.7085 12.0235 41.8872 11.5927 41.9402 11.1227H43.3703C43.3173 11.906 43.0657 12.5914 42.6155 13.1789C42.1786 13.7533 41.6092 14.2037 40.9074 14.53C40.2056 14.8433 39.4177 15 38.5438 15Z" fill="white"/>
              <path d="M53.2521 14.6671L49.0214 9.8107H47.3133L52.2987 4.30809H53.8877L49.4187 9.22324L49.518 8.42037L55 14.6671H53.2521ZM46.1017 14.6671V0.372063H47.5914V14.6671H46.1017Z" fill="white"/>
            </g>
          </svg>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {['Agents', 'Features', 'Pricing', 'Docs'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/login" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px', letterSpacing: '0.001em', color: 'var(--text-secondary)', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup"><Button size="sm">Start free</Button></Link>
          </div>
          <button
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div style={{
            background: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            margin: '8px 16px 0',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {['Agents', 'Features', 'Pricing', 'Docs'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 0' }}>{item}</a>
            ))}
            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 0' }}>Login</Link>
              <Link to="/signup"><Button size="sm" style={{ width: '100%' }}>Start free</Button></Link>
            </div>
          </div>
        )}
      </div>

      {/* spacer to offset fixed nav */}
      <div className="nav-spacer" style={{ height: '72px' }} />

      {/* ═══ HERO ═══
          Two-column layout from Figma "Hero" frame (1031:6156):
          Left col (x:72, y:188): badge + heading + subtitle + CTAs, 552px wide, gap 56px
          Right col (x:889, y:255): FlickeringGrid masked to logo, 412×230 */}
      <section className="hero-section" style={{ height: '700px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 72px' }}>

        {/* Hero background — same composition as the Final CTA but WITHOUT
            the floating chevron shapes (those read as duplicate brand logos
            against the masked hero logo). Keeps: FlickeringGrid backdrop,
            aurora sweep, headline glow, and floating dots. */}
        {(() => {
          // Expanded dot set — 16 specks scattered across the hero with varied
          // sizes (3-6px), durations (6.5-11s), and delays so no two ever sync.
          // Mix of upper, mid, and lower starts so dots are continuously visible
          // throughout the section instead of only rising from the bottom band.
          const dots = [
            { left: '6%',  top: '35%', size: 3, dur: '8s',   delay: '0.6s' },
            { left: '12%', top: '70%', size: 4, dur: '7s',   delay: '0s'   },
            { left: '16%', top: '52%', size: 4, dur: '9s',   delay: '2.4s' },
            { left: '22%', top: '88%', size: 3, dur: '9s',   delay: '1.2s' },
            { left: '28%', top: '40%', size: 5, dur: '10.5s',delay: '0.3s' },
            { left: '34%', top: '60%', size: 3, dur: '7.5s', delay: '1.8s' },
            { left: '38%', top: '78%', size: 5, dur: '8s',   delay: '0.4s' },
            { left: '46%', top: '46%', size: 4, dur: '9.5s', delay: '2.7s' },
            { left: '54%', top: '92%', size: 3, dur: '10s',  delay: '2.1s' },
            { left: '60%', top: '34%', size: 4, dur: '11s',  delay: '0.9s' },
            { left: '64%', top: '58%', size: 3, dur: '6.5s', delay: '1.5s' },
            { left: '68%', top: '74%', size: 4, dur: '8.5s', delay: '0.8s' },
            { left: '74%', top: '42%', size: 5, dur: '9s',   delay: '3.4s' },
            { left: '82%', top: '86%', size: 5, dur: '9.5s', delay: '3s'   },
            { left: '88%', top: '50%', size: 3, dur: '8s',   delay: '1.1s' },
            { left: '90%', top: '70%', size: 3, dur: '7.5s', delay: '1.6s' },
            { left: '95%', top: '36%', size: 4, dur: '10s',  delay: '2.5s' },
          ]
          return (
            <>
              {/* 1 — neutral FlickeringGrid backdrop */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.55 }}>
                <FlickeringGrid
                  squareSize={3}
                  gridGap={8}
                  flickerChance={0.25}
                  color="rgb(163, 163, 163)"
                  maxOpacity={0.18}
                />
              </div>
              {/* 2 — floating neutral dots */}
              {dots.map((d, i) => (
                <span
                  key={i}
                  className="final-dot"
                  style={{
                    position: 'absolute',
                    left: d.left,
                    top: d.top,
                    width: `${d.size}px`,
                    height: `${d.size}px`,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.65)',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.35)',
                    pointerEvents: 'none',
                    zIndex: 0,
                    animation: `final-dot-float ${d.dur} ease-in-out ${d.delay} infinite`,
                    willChange: 'transform, opacity',
                  }}
                />
              ))}

              {/* 3 — top + bottom fade overlays. Each rectangle is a vertical
                  gradient from bg-base (opaque at the edge) → transparent
                  toward the section's centre. Mutes the FlickeringGrid and
                  dots at the edges so the hero blends seamlessly into the
                  (transparent) navbar above and the next section below.
                  Sits above the background layers but below the logo (z-1)
                  and text (z-2), so neither gets obscured. */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '160px',
                  background:
                    'linear-gradient(to bottom, var(--bg-base) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0) 100%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '160px',
                  background:
                    'linear-gradient(to top, var(--bg-base) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0) 100%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            </>
          )
        })()}

        {/* Right column — masked logo (FlickeringGrid clipped to the brand
            logo silhouette). Restored after I mistakenly removed it earlier.
            Hover paints brand-accent in a localised radius around the cursor.
            The `hero-logo-float` class adds a gentle ±10px Y drift around the
            centered resting position; the keyframe uses calc(-50% ± 10px) so
            the float doesn't fight the existing translateY(-50%) centering. */}
        <div
          className="hero-logo-float hero-logo-mask"
          style={{
            position: 'absolute',
            right: '72px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '579.64px',
            height: '368px',
            zIndex: 1,
            WebkitMaskImage: 'url(/logo.png)',
            maskImage: 'url(/logo.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            animation: 'hero-logo-float 6s ease-in-out infinite',
            willChange: 'transform',
          }}
        >
          <FlickeringGrid
            squareSize={4}
            gridGap={6}
            flickerChance={0.3}
            color="rgb(163, 163, 163)"
            hoverColor="#6366F1"
            hoverRadius={110}
            hoverIntensity={1}
            maxOpacity={0.6}
          />
        </div>

        {/* Left column — text content */}
        <div className="hero-text-col" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '44px', width: '552px' }}>

          {/* Badge */}
          <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', height: '28px', padding: '0 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-strong)', fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', alignSelf: 'flex-start' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)', flexShrink: 0 }} />
            AI Workforce Platform — Now in Beta
          </span>

          {/* Heading + subtitle block — gap 32px (Figma Frame 36 itemSpacing: 32) */}
          <div className="hero-heading-block" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h1 style={{ margin: 0 }}>
              <span className="hero-title-line" style={{ display: 'block', fontSize: '48px', fontWeight: 200, lineHeight: '56px', letterSpacing: '-0.005em', color: 'var(--text-primary)' }}>
                Your AI team
              </span>
              <span className="hero-rotating-container" style={{ display: 'block', position: 'relative', overflow: 'hidden', height: '56px' }}>
                &nbsp;
                {rotatingWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      wordIndex === index
                        ? { y: 0, opacity: 1 }
                        : { y: wordIndex > index ? -150 : 150, opacity: 0 }
                    }
                    className="hero-rotating-word"
                    style={{
                      display: 'block',
                      fontSize: '48px',
                      fontWeight: 800,
                      lineHeight: '56px',
                      letterSpacing: '-0.005em',
                      color: 'var(--brand-accent)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '16px', lineHeight: '24px', color: 'var(--text-primary)', margin: '0', width: '552px' }}>
              Deploy specialized AI agents that write, design, automate, and communicate — 24/7.
            </p>
          </div>

          {/* CTA row — both buttons SM (32px) per Figma "Landing Page" Hero
              cta-row instances: Primary SM "Start free" + Secondary SM "see it in action". */}
          <div className="hero-cta-row" style={{ display: 'flex', gap: '12px' }}>
            <Link to="/signup"><Button size="sm">Start free</Button></Link>
            <Button variant="secondary" size="sm">see it in action</Button>
          </div>
        </div>
      </section>

      {/* ═══ INFRASTRUCTURE ═══
          Full-width section from Figma "Infrastructure" frame (1249:8738):
          - Heading + subtitle
          - 2×2 grid of cards: top row = 700px pill + 455px rect, bottom row = 455px rect + 700px pill
          - Pill cards (r=150) use brand accent fills, rect cards (r=16) use surface/hover fills */}
      <section className="infra-section" style={{ padding: '80px 72px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px', position: 'relative', overflow: 'hidden' }}>
        <DotGrid style={{ bottom: 0, left: 0, transform: 'rotate(180deg)' }} />
        <div className="infra-header" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '1296px' }}>
          <h2 className="infra-title" style={{ fontSize: '44px', fontWeight: 700, lineHeight: '55px', margin: 0, color: 'var(--text-primary)' }}>
            The infrastructure behind businesses that scale.
          </h2>
          <p className="infra-subtitle" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-primary)', margin: 0 }}>
            Runs your marketing, support, design, and automation — around the clock, without the overhead of a full team.
          </p>
        </div>
        <div className="infra-grid" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '33px', width: '100%', maxWidth: '1190px' }}>
          <div className="infra-row" style={{ display: 'flex', gap: '35px' }}>
            {/* Pill card — brand accent (prob-card, Figma 1479:44943) */}
            <ProbCard />

            {/* Rect card — surface (Figma prob-card -2 interaction 1479:45101 / 1479:44940) */}
            <KnowCard />
          </div>
          {/* Row 2 — Figma Frame 38: rect "Work while you sleep." (455, left) + pill "Just message it." (700, right) */}
          <div className="infra-row" style={{ display: 'flex', gap: '35px' }}>
            {/* Rect card — Figma prob-card 3 - Interaction 1707:66623 */}
            <WorkWhileCard />
            {/* Pill card — brand-accent-light with messages illustration (Figma 1479:44957 / 1607:58963) */}
            <JustMessageCard />
          </div>
        </div>
      </section>

      {/* ═══ AGENTS ═══
          Tree layout from Figma "Agents" frame (1592:56699):
          - Centered header: "Meet your new team" + subtitle
          - Central logo node connected by curved dotted lines to 5 agent cards
          - Two cards on the middle row (Cleo left, Pixel right) and three on the
            bottom row (Bolt, Spark, Nova)
          - Card interaction (from 1573:49814): default state shows small card with
            icon + name + role; clicking expands it in place to show description.
            Click again to collapse. */}
      <section
        ref={agentsSectionRef}
        id="agents"
        style={{
          padding: '80px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated dot grid per Figma node 1592:56699:
            - Dots are at FULL strength at the very top (merges with the
              Infrastructure section above via the -103px overhang).
            - A smooth gradient fades them DOWN through the whole section —
              dots are bright through the header/logo area, visible but
              dimmer around Cleo/Pixel, and near-invisible by the bottom row.
            - No hard cut-off anywhere; the fade is one continuous gradient
              from transparent at the top to solid --bg-base at the bottom.
            `top: -103px` + `bottom: 0` + `height: auto` stretches the grid
            across the entire section (plus overhang above) so the wave
            animation runs uninterrupted and the gradient spans top-to-bottom. */}
        <DotGrid
          style={{ top: '-103px', bottom: 0, left: 0, height: 'auto' }}
          fade={{ start: 0, end: 100 }}
        />

        {/* Centered header — per Figma, no eyebrow label on this variant */}
        <div className="agents-header" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '720px', textAlign: 'center' }}>
          <h2 className="agents-title" style={{ fontSize: '40px', fontWeight: 700, lineHeight: '48px', margin: 0, color: 'var(--text-primary)' }}>
            Meet your new team
          </h2>
          <p className="agents-subtitle" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-secondary)', margin: 0 }}>
            Six specialists, always on, always aligned with your brand and goals.
          </p>
        </div>

        {/* ── Mobile agents carousel (Figma 1933:10112 / 1933:8105) ── */}
        <div className="agents-mobile mobile-only" style={{ display: 'none', position: 'relative', zIndex: 1, flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%' }}>
          {/* Logo */}
          <div style={{ width: '175px', height: '175px', borderRadius: '40px', background: 'var(--bg-elevated)', border: '1px solid var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="87" height="49" viewBox="0 0 27 15" fill="none"><path d="M8.33622 8.28859L13.5 3.16555L18.6637 8.28859L20.25 6.71141L13.5 0L6.74997 6.71141L8.33622 8.28859Z" fill="var(--brand-accent)"/><path d="M15.0863 15L20.25 9.87696L25.4138 15L27 13.4228L20.25 6.71141L13.5 13.4228L15.0863 15Z" fill="var(--brand-accent)"/><path d="M1.58625 15L6.75 9.87696L11.9138 15L13.5 13.4228L6.74997 6.71141L0 13.4228L1.58625 15Z" fill="var(--brand-accent)"/></svg>
          </div>
          {/* Dotted line */}
          <div style={{ width: '1px', height: '120px', backgroundImage: 'repeating-linear-gradient(to bottom, var(--text-primary) 0 2px, transparent 2px 8px)', opacity: 0.5, marginTop: '-16px', marginBottom: '-16px' }} />
          {/* Arrow tip */}
          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid var(--text-primary)', opacity: 0.5, marginTop: '-20px' }} />
          {/* Carousel — horizontally scrollable, centered cards */}
          {/* Carousel with chevron nav */}
          <div style={{ position: 'relative', width: '100%' }}>
            {/* Left chevron */}
            <button
              onClick={() => { if (carouselRef.current) carouselRef.current.scrollBy({ left: -164, behavior: 'smooth' }) }}
              className="carousel-chevron carousel-chevron-left"
              aria-label="Scroll left"
              style={{
                position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            {/* Right chevron */}
            <button
              onClick={() => { if (carouselRef.current) carouselRef.current.scrollBy({ left: 164, behavior: 'smooth' }) }}
              className="carousel-chevron carousel-chevron-right"
              aria-label="Scroll right"
              style={{
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <div ref={carouselRef} className="agents-carousel-wrap" style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
              <div
                className="agents-carousel-track"
                style={{
                  display: 'inline-flex',
                  gap: '24px',
                  padding: '20px calc(50% - 75px)',
                  alignItems: 'center',
                }}
              >
                {agents.map((a, i) => {
                  const isActive = i === activeAgent
                  const isCentered = !isActive && i === centeredCard
                  return (
                    <div
                      key={a.name}
                      className="agents-carousel-card"
                      onClick={() => setActiveAgent(isActive ? -1 : i)}
                      style={{
                        width: isActive ? '220px' : '150px',
                        minWidth: isActive ? '220px' : '150px',
                        background: 'var(--bg-elevated)',
                        borderRadius: isActive ? '16px' : '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transform: isCentered ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all 400ms cubic-bezier(0.42, 0, 0.58, 1)',
                        flexShrink: 0,
                        scrollSnapAlign: 'center',
                        zIndex: isCentered ? 2 : isActive ? 3 : 1,
                      }}
                    >
                      {/* Accent bar */}
                      <div style={{ height: isActive ? '3px' : isCentered ? '3px' : '2px', background: a.color, transition: 'height 400ms ease' }} />
                      {/* Content */}
                      <div style={{
                        padding: isActive ? '16px 20px' : '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isActive ? '12px' : '0px',
                        transition: 'all 400ms ease',
                      }}>
                        {/* Icon + Name row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: isActive ? '50px' : '42px',
                            height: isActive ? '50px' : '42px',
                            minWidth: isActive ? '50px' : '42px',
                            borderRadius: isActive ? '14px' : '12px',
                            background: a.colorMuted,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 400ms ease',
                            flexShrink: 0,
                          }}>
                            <svg width={isActive ? '24' : '20'} height={isActive ? '24' : '20'} viewBox="0 0 24 24" fill={a.color}><path d={a.svg} /></svg>
                          </div>
                          <div>
                            <div style={{ fontSize: isActive ? '16px' : '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.2', whiteSpace: 'nowrap' }}>{a.name}</div>
                            <div style={{ fontSize: isActive ? '11px' : '10px', color: 'var(--text-tertiary)', lineHeight: '1.4', whiteSpace: 'nowrap' }}>{a.role}</div>
                          </div>
                        </div>
                        {/* Description — only visible when active */}
                        <div style={{
                          maxHeight: isActive ? '120px' : '0px',
                          opacity: isActive ? 1 : 0,
                          overflow: 'hidden',
                          transition: 'max-height 400ms ease, opacity 300ms ease',
                        }}>
                          <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)', marginBottom: '10px', marginTop: '4px' }} />
                          <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>{a.desc}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tree visualization stage — 1200×820 container holding logo + SVG
            connectors + 5 cards. Positions are tuned against the Figma frame. */}
        <div
          className="agents-tree desktop-only"
          ref={treeRef}
          style={{
            position: 'relative',
            width: '1260px',
            height: '940px',
            zIndex: 1,
          }}
        >
          {(() => {
            // ── Figma positions mapped 1:1 from node 1592:58596 (Group 29 —
            //    the tree graphic). Figma's Group 29 is 1223×826; our container
            //    is 1260×940. We apply a uniform scale of 1260/1223 = 1.030 to
            //    preserve the Figma tree's aspect ratios exactly, and use the
            //    vertical slack (940 − 826×1.030 = 90px) as top padding so the
            //    logo sits at the Figma-equivalent y-position within the frame.
            const TREE_Y_OFFSET = 45  // (940 − 851) / 2 — centers the 851-tall
                                       // scaled tree vertically within the 940
                                       // container (matches Figma's 23px
                                       // breathing room above the logo, scaled).

            // Logo — Figma Group 29 local (523, 0) size 175×175 → scaled 180×180
            const LOGO_W = 180
            const LOGO_H = 180
            const LOGO_X = 1260 / 2 - LOGO_W / 2  // 540
            const LOGO_Y = TREE_Y_OFFSET + 0      // 45
            const LOGO_CX = LOGO_X + LOGO_W / 2   // 630 (trunk anchor x)
            const LOGO_CY = LOGO_Y + LOGO_H       // 225 (trunk anchor y)

            // Default card size (collapsed state from 1573:49814)
            const CARD_W = 200
            const CARD_H = 93
            // Active card size (expanded state from 1573:49814)
            const ACTIVE_W = 394
            const ACTIVE_H = 210

            // Card slot positions — Figma 1592:58597-58601, scaled by 1.030
            // with TREE_Y_OFFSET applied. Centers are SYMMETRIC around the
            // logo's 630 x-axis so the trunk stays perfectly vertical and the
            // top/bottom row branches mirror each other (Figma top-row offset
            // ±415, bottom-row offset ±511; scaled to ±427 and ±447 here but
            // clamped at ±433 on the bottom row so expanded cards — 394 wide —
            // don't overflow the 1260 container on either side).
            // Vertical: top row at Figma local y=358 → 45+358*1.030 ≈ 414.
            //           bottom row at Figma local y=733 → 45+733*1.030 ≈ 800.
            const TOP_Y = 414
            const BOT_Y = 800
            const TOP_OFFSET = 427
            const BOT_OFFSET = 433
            const slots: Record<string, { x: number; y: number }> = {
              // Middle row — Cleo (left), Pixel (right)
              Cleo:  { x: LOGO_CX - TOP_OFFSET - CARD_W / 2, y: TOP_Y },  // 630-427-100 = 103
              Pixel: { x: LOGO_CX + TOP_OFFSET - CARD_W / 2, y: TOP_Y },  // 630+427-100 = 957
              // Bottom row — Bolt (left), Spark (center), Nova (right)
              Bolt:  { x: LOGO_CX - BOT_OFFSET - CARD_W / 2, y: BOT_Y },  // 630-433-100 = 97
              Spark: { x: LOGO_CX - CARD_W / 2,              y: BOT_Y },  // 630-100 = 530
              Nova:  { x: LOGO_CX + BOT_OFFSET - CARD_W / 2, y: BOT_Y },  // 630+433-100 = 963
            }

            const featureAgents = agents.slice(0, 5)

            // Per Figma (node 1592:58605 — "Group 27" connectors), the tree is:
            //   • Trunk (Line 2): vertical line (719, 369) → (719, 920) in
            //     Figma absolute — from logo bottom straight down to the top
            //     of the bottom-center card. Perfectly vertical.
            //   • Top-row branches (Line 10, Line 7): originate at the SAME
            //     point as the trunk (logo bottom), curving outward to each
            //     top-row card's top-center. Aspect dx/dy ≈ 2.28.
            //   • Bottom-row branches (Line 9, Line 3): fork off the trunk
            //     at y=625 (Figma local y=432 in Group 29, 52.3% down), just
            //     below the top-row cards' vertical center. Aspect dx/dy ≈
            //     1.70. Trunk continues through this fork without break.
            // Curve shape: CP1 sits 82.7% of the vertical delta below the
            // start, on the start's x-axis. CP2 sits 43.1% of the delta above
            // the end, on the end's x-axis. This is the exact control-point
            // placement measured from Figma's Line 7 and Line 3 hand-drawn
            // paths — it gives the clean "exit-vertical → bend → enter-
            // vertical" shape that defines this tree. Figma's arrow gap
            // between the path end and the card's top edge is 6px.
            const ARROW_GAP = 6

            // Fork Y positions on the trunk.
            //   FORK1_Y = logo bottom (top-row branches share the trunk's
            //   origin — Figma Line 10/Line 7 start at the same point as
            //   the trunk).
            //   FORK2_Y = Figma local y=432 in Group 29, scaled: 45+432*1.030
            //   ≈ 490. Sits ~80% into the top-row cards' vertical range but
            //   at x=630 (between Cleo and Pixel horizontally) so it reads
            //   visually as "just below the top-row cards".
            const FORK1_Y = LOGO_CY
            const FORK2_Y = 490

            // Figma-measured curve fractions (same for every branch).
            const CP1_FRAC = 0.827
            const CP2_FRAC = 0.431

            const curveFor = (name: string) => {
              const s = slots[name]
              const endX = s.x + CARD_W / 2
              const endY = s.y - ARROW_GAP

              // Spark = the trunk itself — straight drop from logo to card.
              if (name === 'Spark') {
                return `M ${LOGO_CX} ${LOGO_CY} L ${endX} ${endY}`
              }

              // Branches: bezier with CP1 directly below start and CP2
              // directly above end, mimicking Figma's path control points.
              const forkY = name === 'Cleo' || name === 'Pixel' ? FORK1_Y : FORK2_Y
              const dy = endY - forkY
              const cp1y = forkY + dy * CP1_FRAC
              const cp2y = endY - dy * CP2_FRAC
              return `M ${LOGO_CX} ${forkY} C ${LOGO_CX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`
            }

            // ── Scroll-driven reveal staging ────────────────────────────
            // Each tree element fades in as IT scrolls into view: the
            // helper below maps an element's vertical position (in tree
            // coords) to a 0→1 reveal progress. Element starts fading in
            // when it's at 88% of viewport height (just below mid-fold)
            // and is fully visible by 50% (vertical center). This makes
            // every element appear right when it enters the visible area,
            // regardless of viewport size or scroll speed.
            const reveal = (yInTree: number) => {
              const elTop = treeViewport.top + yInTree
              const start = treeViewport.vh * 0.88
              const end = treeViewport.vh * 0.5
              const raw = (start - elTop) / (start - end)
              return Math.max(0, Math.min(1, raw))
            }

            // Logo — anchored to its vertical center.
            const logoStage = reveal(LOGO_Y + LOGO_H / 2)

            // Arrows — anchored slightly above their target card so the
            // arrow finishes drawing in just before the card pops in,
            // landing the arrowhead on the card as it appears.
            const arrowStage: Record<string, number> = {
              Cleo:  reveal(slots.Cleo.y - 20),
              Pixel: reveal(slots.Pixel.y - 20),
              // Trunk — use the line's vertical midpoint so it reveals as
              // the eye scans down past the top-row cards.
              Spark: reveal((LOGO_CY + slots.Spark.y) / 2),
              Bolt:  reveal(slots.Bolt.y - 20),
              Nova:  reveal(slots.Nova.y - 20),
            }

            // Cards — anchored to their vertical center so they finish
            // appearing as they cross viewport center.
            const cardStage: Record<string, number> = {
              Cleo:  reveal(slots.Cleo.y + CARD_H / 2),
              Pixel: reveal(slots.Pixel.y + CARD_H / 2),
              Spark: reveal(slots.Spark.y + CARD_H / 2),
              Bolt:  reveal(slots.Bolt.y + CARD_H / 2),
              Nova:  reveal(slots.Nova.y + CARD_H / 2),
            }

            return (
              <>
                {/* Central logo node — rounded square with favicon mark inside.
                    Scroll-driven: fades + scales up in the first 0→0.18 of
                    tree progress. */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${LOGO_X}px`,
                    top: `${LOGO_Y}px`,
                    width: `${LOGO_W}px`,
                    height: `${LOGO_H}px`,
                    borderRadius: '40px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px -20px rgba(0,0,0,0.6)',
                    opacity: logoStage,
                    transform: `scale(${0.88 + 0.12 * logoStage})`,
                    willChange: 'opacity, transform',
                  }}
                >
                  <svg width="87" height="49" viewBox="0 0 27 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33622 8.28859L13.5 3.16555L18.6637 8.28859L20.25 6.71141L13.5 0L6.74997 6.71141L8.33622 8.28859Z" fill="var(--brand-accent)" />
                    <path d="M15.0863 15L20.25 9.87696L25.4138 15L27 13.4228L20.25 6.71141L13.5 13.4228L15.0863 15Z" fill="var(--brand-accent)" />
                    <path d="M1.58625 15L6.75 9.87696L11.9138 15L13.5 13.4228L6.74997 6.71141L0 13.4228L1.58625 15Z" fill="var(--brand-accent)" />
                  </svg>
                </div>

                {/* Dotted curved connectors — one SVG overlay, five paths.
                    Each path fades in on its own scroll-progress slice so
                    the branches appear in top-to-bottom order: top arrows
                    (Cleo/Pixel) → trunk (Spark) → bottom arrows (Bolt/Nova). */}
                <svg
                  viewBox="0 0 1260 940"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                >
                  <defs>
                    <marker
                      id="agent-arrow"
                      viewBox="0 0 10 10"
                      refX="5"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-primary)" />
                    </marker>
                  </defs>
                  {featureAgents.map((a) => {
                    const p = arrowStage[a.name] ?? 0
                    return (
                      <path
                        key={a.name}
                        d={curveFor(a.name)}
                        fill="none"
                        stroke="var(--text-primary)"
                        strokeWidth="1.5"
                        strokeDasharray="2 6"
                        strokeLinecap="round"
                        // Final steady-state opacity is 0.6 (matches Figma);
                        // multiply by stage progress for the scroll fade-in.
                        opacity={0.6 * p}
                        markerEnd={p > 0.6 ? 'url(#agent-arrow)' : undefined}
                      />
                    )
                  })}
                </svg>

                {/* Agent cards — positioned in slots, grow in place when active.
                    Every card expands SYMMETRICALLY around its arrow endpoint
                    (slot.x + CARD_W/2), so the arrow lands exactly on the
                    center of both the default and the expanded card. Slot
                    positions are spaced so the expanded width (480px) never
                    crosses the central trunk at x=630 or any other curve —
                    i.e. Cleo active ends at x=565, Bolt active ends at x=480,
                    leaving clean space for the tree connectors.
                    Vertical growth is always DOWNWARD — the top stays pinned
                    so the expansion never overlaps the arrow above. */}
                {featureAgents.map((a, i) => {
                  const slot = slots[a.name]
                  const isActive = i === activeAgent
                  const w = isActive ? ACTIVE_W : CARD_W
                  const h = isActive ? ACTIVE_H : CARD_H
                  // Horizontal: every card expands SYMMETRICALLY around its
                  // arrow endpoint (slot.x + CARD_W/2), so the arrow auto-
                  // centers on the card in both default and expanded state.
                  // For left-side cards (Cleo, Bolt) that means the expansion
                  // visually reaches as far LEFT as it does right, so the
                  // card's center ends up under the arrow.
                  const x = slot.x - (w - CARD_W) / 2
                  // Vertical: top pinned to the slot, expansion grows down.
                  const y = slot.y

                  // Scroll-driven reveal: each card has its own 0→1 local
                  // progress keyed by name. Card fades in while sliding up
                  // from a ~24px offset so the entrance reads as a soft lift.
                  const p = cardStage[a.name] ?? 0
                  const lift = (1 - p) * 24

                  return (
                    <div
                      key={a.name}
                      onClick={() => setActiveAgent(isActive ? null : i)}
                      style={{
                        position: 'absolute',
                        left: `${x}px`,
                        top: `${y}px`,
                        width: `${w}px`,
                        height: `${h}px`,
                        background: 'var(--bg-surface)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        opacity: p,
                        transform: `translateY(${lift}px)`,
                        zIndex: isActive ? 20 : 5,
                        boxShadow: isActive
                          ? '0 28px 60px -20px rgba(0,0,0,0.7)'
                          : '0 12px 28px -14px rgba(0,0,0,0.55)',
                        // No transition on transform/opacity — those are
                        // driven every frame by scroll. Width/height/left
                        // keep their transitions so expansion on click
                        // still animates smoothly.
                        transition:
                          `left 500ms cubic-bezier(0.4,0,0.2,1), width 500ms cubic-bezier(0.4,0,0.2,1), height 500ms cubic-bezier(0.4,0,0.2,1), box-shadow 400ms ease`,
                        willChange: 'opacity, transform',
                      }}
                    >
                      {/* Top accent line — agent's signature color */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: a.color }} />

                      {/* DEFAULT (collapsed) — Figma 1573:49812: 200×93, padding 20,
                          icon-wrapper 50×50 radius 10, name 18/24 bold, role 12/16 */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          padding: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          opacity: isActive ? 0 : 1,
                          transition: 'opacity 220ms ease',
                          pointerEvents: isActive ? 'none' : 'auto',
                        }}
                      >
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            background: a.colorMuted,
                            border: `1px solid color-mix(in srgb, ${a.color} 20%, transparent)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill={a.color}><path d={a.svg} /></svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px', color: 'var(--text-primary)' }}>{a.name}</div>
                          <div style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{a.role}</div>
                        </div>
                      </div>

                      {/* ACTIVE (expanded) — Figma 1573:49813: 394×210, padding 20,
                          icon-wrapper 40×40 radius 10 with 20% color stroke, name 18/24
                          bold, role 12/16, divider with 10/10 gap, body 13/18. */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          opacity: isActive ? 1 : 0,
                          transition: 'opacity 220ms ease 60ms',
                          pointerEvents: isActive ? 'auto' : 'none',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: a.colorMuted,
                            border: `1px solid color-mix(in srgb, ${a.color} 20%, transparent)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginBottom: '16px',
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={a.color}><path d={a.svg} /></svg>
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px', color: 'var(--text-primary)' }}>{a.name}</div>
                        <div style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-tertiary)' }}>{a.role}</div>
                        <div style={{ height: '1px', background: 'var(--border-subtle)', marginTop: '10px', marginBottom: '10px' }} />
                        <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-primary)', margin: 0 }}>{a.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </>
            )
          })()}
        </div>
      </section>


      {/* ═══ HOW IT WORKS ═══ (Figma HowItWorks 1690:66472 — two-column sticky-stack)
          Two-column layout: left column = title + stepper (sticky, pins while the
          right column scrolls). Right column = 3 cards that stack on top of each
          other as the user scrolls — each card has position: sticky with a
          progressively larger top offset (156 + i*22) so earlier cards stay pinned
          while later cards slide up and land just below them.

          Active step highlighting: computeActive() reads each card's rect.top
          against its sticky trigger — the card that has reached its pin gets
          `activeStep`, driving the stepper number color. */}
      <section
        className="hiw-section"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '80px 72px',
          boxSizing: 'border-box',
        }}
      >
        <div className="hiw-layout" style={{ display: 'flex', alignItems: 'flex-start', gap: '56px' }}>
          {/* Left column — title + stepper, sticky at top 156 so it pins while the
              right column scrolls through its cards. */}
          <div
            className="hiw-left"
            style={{
              width: '600px',
              flexShrink: 0,
              position: 'sticky',
              top: '156px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h2
              className="hiw-title"
              style={{
                fontSize: '44px',
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: '-0.3%',
                margin: 0,
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>Up and running</span>
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>in minutes</span>
            </h2>

            {/* Stepper — number lights up in brand-accent once the matching card
                pins. Pre-scroll activeStep is -1; we clamp to 0 so step 01 is lit
                on initial render. */}
            <div className="hiw-stepper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {steps.map((s, i) => {
                const clamped = activeStep < 0 ? 0 : activeStep
                const isActive = i === clamped
                return (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '43px',
                        height: '43px',
                        borderRadius: '999px',
                        border: '1px solid rgba(99, 102, 242, 0.3)',
                        backgroundColor: 'rgba(99, 102, 242, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: isActive ? 'var(--brand-accent)' : '#1E1B4B',
                        transition: 'color 320ms ease',
                      }}
                    >
                      {s.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        style={{
                          width: '17px',
                          height: '2px',
                          backgroundColor: '#1E1B4B',
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right column — 3 cards that stack as the user scrolls. Each card
              sits in its own absolute wrapper inside a tall container so they
              share a common scroll range. Each card's sticky top offset is
              156 + i*22, so they nest visually on top of one another. The
              marginTop staggers when each card starts its pin. */}
          <div
            className="hiw-cards"
            style={{
              width: '640px',
              flexShrink: 0,
              position: 'relative',
              height: 'calc(280vh + 156px)',
            }}
          >
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="hiw-card-wrap"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                <div
                  ref={(el) => {
                    stepRowRefs.current[i] = el
                  }}
                  className="hiw-card"
                  style={{
                    position: 'sticky',
                    top: `${156 + i * 22}px`,
                    marginTop: `calc(${i * 90}vh)`,
                    width: '640px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '16px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxSizing: 'border-box',
                    zIndex: i + 1,
                    pointerEvents: 'auto',
                    boxShadow: '0 -24px 40px -24px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      lineHeight: '28px',
                      letterSpacing: '-0.3%',
                      margin: 0,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                      lineHeight: '24px',
                      letterSpacing: '-0.1%',
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ FEATURES ═══ (Figma "Features" frame 1033:6333)
          Section: 1440×611, bg --bg-base, padding 80/72, vertical gap 60
          Header: left-aligned, 44 SemiBold "One platform. Every function." + 14/20 subhead
          Rotating label: 48/56 Regular, centred — shows the name of the currently
            active feature and animates through the list on an interval (or when a
            card is hovered).
          Row: 4 cards × 309×188, bg --bg-surface, radius 12, padding 24.
            Card = body text only (20/28 Regular, white, left-aligned). */}
      <FeaturesSection />


      {/* ═══ PRICING ═══
          Figma "Pricing" frame (1033:6371). Section padding 80/72, gap 60 between
          header and cards, dark base bg. Header: 44px SemiBold title + 14px secondary
          subtitle, 12px gap, 600px wide centered.
          Plans-row: 3 cards × 394px (= 1222px row), 20px gap, vertically centered.
          Pro card stands out via elevated bg + 1.5px brand-accent stroke (80% opacity)
          and a slightly stronger divider (#3a3a3a) — Starter/Enterprise use surface bg
          + 1px subtle border. Per request, the floating "Most popular" pill is kept
          in its current position (absolute, top:-12px, brand-accent ring on bg-base). */}
      <section id="pricing" className="pricing-section" style={{ padding: '80px 72px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px' }}>
        <div className="pricing-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '600px' }}>
          {/* Two-tone heading per Figma 1033:6374 — "Simple" is muted (text-secondary,
              #B6B6B6) and ", scalable pricing" is full white (text-primary). The
              fill is mixed at character level in Figma; we mirror it with a span. */}
          <h2 style={{ fontSize: '44px', fontWeight: 600, lineHeight: '56px', letterSpacing: '-0.003em', margin: 0, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Simple</span>, scalable pricing
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-secondary)', margin: 0, maxWidth: '520px' }}>
            Start free, scale as your team grows. No contracts, no hidden fees.
          </p>
        </div>
        <div className="pricing-cards" style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {pricingPlans.map(plan => (
            <div
              key={plan.tier}
              className={`pricing-card${plan.highlighted ? ' pricing-card-highlighted' : ''}`}
              style={{
                width: '394px',
                background: plan.highlighted ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                border: plan.highlighted
                  ? '1.5px solid rgba(99, 102, 241, 0.8)'
                  : '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '28px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Floating "Most popular" pill — kept exactly as before per request. */}
              {plan.highlighted && (
                <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 600, color: 'var(--brand-accent)', background: 'var(--bg-base)', padding: '2px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--brand-accent)' }}>
                  Most popular
                </span>
              )}

              {/* Tier eyebrow — 10/14 Bold, 6% letter-spacing, tertiary grey. */}
              <span style={{ fontSize: '10px', fontWeight: 700, lineHeight: '14px', letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>
                {plan.tier}
              </span>

              {/* 8px spacer (Figma rectangle) */}
              <div style={{ height: '8px', flexShrink: 0 }} />

              {/* Price row — 40px ExtraBold + 14px /mo period (text-secondary). */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800, lineHeight: '48px', letterSpacing: '-0.005em', color: 'var(--text-primary)' }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px', color: 'var(--text-secondary)' }}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Description — 13/18 Regular, secondary. Sits flush under price-row. */}
              <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-secondary)', margin: 0, width: '100%' }}>
                {plan.desc}
              </p>

              {/* 20px spacer */}
              <div style={{ height: '20px', flexShrink: 0 }} />

              {/* CTA — size="md" per Figma Pricing screen instances (Variant=Primary
                  / Ghost, Size=MD on plan-Starter / plan-Pro / plan-Enterprise).
                  Full width of inner card. Pro = primary, others = secondary. */}
              <Button variant={plan.ctaVariant} size="md" fullWidth>
                {plan.cta}
              </Button>

              {/* 20px spacer */}
              <div style={{ height: '20px', flexShrink: 0 }} />

              {/* Divider — Pro uses stronger #3a3a3a (--border-strong), others #1f1f1f. */}
              <div
                style={{
                  height: '1px',
                  width: '100%',
                  background: plan.highlighted ? 'var(--border-strong)' : 'var(--border-subtle)',
                  flexShrink: 0,
                }}
              />

              {/* 16px spacer */}
              <div style={{ height: '16px', flexShrink: 0 }} />

              {/* Features list — 24×24 white check icon + 13/18 Regular white text,
                  10px gap between icon & label, 12px between rows. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ flexShrink: 0 }}
                      aria-hidden="true"
                    >
                      <path
                        d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                        fill="var(--text-primary)"
                      />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-primary)' }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ═══ FINAL CTA — Figma "Final" frame 1806:9599 ═══
          1440 × 675, padding 96/72, bg-base. Background composition is three
          layered chevron outlines (Figma Group 1 vectors 1806:9601-3, each
          471×291, fill #1a1a1a) arranged so two chevrons sit at the bottom
          and one at the top — referencing the brand's "upward" energy.
          Centred Frame 63 holds the two-line headline ("Your team is ready."
          white + "Are you?" brand-accent), 16px gaps throughout, then the
          subtitle and primary CTA. Heading is 48/ExtraBold/-0.5% letter-spacing.
          Animation: each chevron drifts on Y axis at a different phase, plus
          a soft brand-accent glow breathes behind the text. */}
      <section
        className="final-section"
        style={{
          padding: '96px 72px',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-base)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '675px',
          boxSizing: 'border-box',
        }}
      >
        {/* Layered background composition — bottom→top:
              1. FlickeringGrid (ambient noise, brand-accent tinted)
              2. Aurora sweep (slow blurred indigo bar drifting L→R)
              3. Three brand-accent stroked chevrons (Figma geometry, recoloured),
                 each drifting on Y axis + slowly rotating ±2°, with drop-shadow glow
              4. Breathing radial glow behind the headline
              5. Floating accent dots (tiny indigo specks rising)
            All decorative layers use `pointer-events: none` so the CTA stays clickable. */}
        {(() => {
          // Figma frame is 1440 wide; we anchor the chevron group to a virtual
          // 1440-wide centred area. left = 50% - 720 + figmaX.
          // Brand Fevicon — three stacked chevrons (top + bottom-right + bottom-left)
          // exactly matching the navbar/footer logo geometry (27×15 viewBox).
          // Used as a single oversized "logo" floating behind the headline so the
          // background reads as the brand mark, not a generic shape.
          const fevPaths = [
            'M8.33622 8.28859L13.5 3.16555L18.6637 8.28859L20.25 6.71141L13.5 0L6.74997 6.71141L8.33622 8.28859Z',
            'M15.0863 15L20.25 9.87696L25.4138 15L27 13.4228L20.25 6.71141L13.5 13.4228L15.0863 15Z',
            'M1.58625 15L6.75 9.87696L11.9138 15L13.5 13.4228L6.74997 6.71141L0 13.4228L1.58625 15Z',
          ]
          // Single floating Fevicon, scaled to 480×267 (preserves 27:15 ratio).
          // Centred horizontally: figmaX = (1440 - 480) / 2 = 480.
          // Centred vertically in the 675-tall section: figmaY = (675 - 267) / 2 ≈ 204.
          const fevWidth = 480
          const fevHeight = Math.round((fevWidth * 15) / 27)
          const fevSpecs: Array<{ cls: string; anim: string; figmaX: number; figmaY: number; duration: string; delay: string }> = [
            { cls: 'final-chevron-a', anim: 'final-chevron-spin-a', figmaX: Math.round((1440 - fevWidth) / 2), figmaY: Math.round((675 - fevHeight) / 2), duration: '9s', delay: '0s' },
          ]
          // Floating accent-dot specs — randomised seed positions/durations
          // chosen by hand for an organic spread; each one rises -160px over
          // its lifetime then fades, yielding a constant gentle "drift up".
          const dots = [
            { left: '12%', top: '70%', size: 4, dur: '7s',  delay: '0s'   },
            { left: '22%', top: '88%', size: 3, dur: '9s',  delay: '1.2s' },
            { left: '38%', top: '78%', size: 5, dur: '8s',  delay: '0.4s' },
            { left: '54%', top: '92%', size: 3, dur: '10s', delay: '2.1s' },
            { left: '68%', top: '74%', size: 4, dur: '8.5s',delay: '0.8s' },
            { left: '82%', top: '86%', size: 5, dur: '9.5s',delay: '3s'   },
            { left: '90%', top: '70%', size: 3, dur: '7.5s',delay: '1.6s' },
          ]
          return (
            <>
              {/* 1 — FlickeringGrid backdrop. Neutral grayscale tint (no brand
                  colour) at low maxOpacity gives a subtle, alive texture
                  across the whole section. Base #B6B6B6 = --text-secondary. */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                  opacity: 0.55,
                }}
              >
                <FlickeringGrid
                  squareSize={3}
                  gridGap={8}
                  flickerChance={0.25}
                  color="rgb(163, 163, 163)"
                  maxOpacity={0.18}
                />
              </div>

              {/* 2 — Aurora sweep. A wide, heavily blurred neutral-white bar
                  that slowly drifts L→R behind the chevrons. Skewed -12° so
                  it reads as light cutting through space, not a flat block. */}
              <div
                className="final-aurora"
                style={{
                  position: 'absolute',
                  top: '-25%',
                  left: 0,
                  width: '60%',
                  height: '150%',
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 100%)',
                  filter: 'blur(80px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                  animation: 'final-aurora-sweep 18s ease-in-out infinite',
                  willChange: 'transform, opacity',
                }}
              />

              {/* 3 — Neutral floating Fevicon. Same geometry as the brand
                  navbar/footer logo (three stacked chevrons), recoloured to
                  elevated surface fill + soft strong-border stroke (no brand
                  colour). */}
              {fevSpecs.map((c) => (
                <svg
                  key={c.cls}
                  className={c.cls}
                  width={fevWidth}
                  height={fevHeight}
                  viewBox="0 0 27 15"
                  fill="none"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: `calc(50% - 720px + ${c.figmaX}px)`,
                    top: `${c.figmaY}px`,
                    pointerEvents: 'none',
                    zIndex: 0,
                    filter: 'drop-shadow(0 0 24px rgba(255, 255, 255, 0.06))',
                    animation: `${c.anim} ${c.duration} ease-in-out infinite`,
                    animationDelay: c.delay,
                    transformOrigin: 'center center',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* No strokes — each path's outline would draw a seam where
                      the chevrons meet, breaking the single-mark look. Fill
                      only, slightly above bg-base, so the 3 chevrons read as
                      one continuous brand Fevicon. */}
                  {fevPaths.map((d, i) => (
                    <path key={i} d={d} fill="var(--border-strong)" />
                  ))}
                </svg>
              ))}

              {/* 4 — Soft neutral glow behind the headline. White at very low
                  opacity gives the text a halo of "presence" without colour. */}
              <div
                className="final-glow"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '720px',
                  height: '720px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.04) 35%, rgba(255, 255, 255, 0) 70%)',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                  transform: 'translate(-50%, -50%)',
                  animation: 'final-glow-pulse 9s ease-in-out infinite',
                  willChange: 'transform, opacity',
                }}
              />

              {/* 5 — Floating neutral dots. Tiny white specks rising and fading;
                  same particle behaviour, neutral colour. */}
              {dots.map((d, i) => (
                <span
                  key={i}
                  className="final-dot"
                  style={{
                    position: 'absolute',
                    left: d.left,
                    top: d.top,
                    width: `${d.size}px`,
                    height: `${d.size}px`,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.65)',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.35)',
                    pointerEvents: 'none',
                    zIndex: 0,
                    animation: `final-dot-float ${d.dur} ease-in-out ${d.delay} infinite`,
                    willChange: 'transform, opacity',
                  }}
                />
              ))}

              {/* 6 — Top + bottom fade overlays. Vertical gradients from
                  bg-base (opaque at the section edge) → transparent toward
                  the centre. Mutes the FlickeringGrid / chevrons / dots at
                  the edges so the Final section blends seamlessly into the
                  Pricing section above and the footer below. Sit above the
                  background layers but below the headline content (z-1). */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '160px',
                  background:
                    'linear-gradient(to bottom, var(--bg-base) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0) 100%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '160px',
                  background:
                    'linear-gradient(to top, var(--bg-base) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0) 100%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            </>
          )
        })()}

        {/* Frame 63 — text content + CTA, 800 wide, gap 16 between every child. */}
        <div
          className="final-content"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '16px',
            width: '800px',
            maxWidth: '100%',
          }}
        >
          {/* Two-line heading — h2 is a flex container so "Your team is ready."
              and "Are you?" each render as block-level spans with the Figma
              16px gap and -0.5% letter-spacing. */}
          <h2
            className="final-heading"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: '56px',
              letterSpacing: '-0.005em',
              margin: 0,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Your team is ready.</span>
            <span style={{ color: 'var(--brand-accent)' }}>Are you?</span>
          </h2>

          {/* Subtitle — 16/24 Regular, secondary, 520 wide per Figma 1806:9607. */}
          <p
            style={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              color: 'var(--text-secondary)',
              margin: 0,
              maxWidth: '520px',
            }}
          >
            Start free today. No credit card, no onboarding call.
          </p>

          {/* Primary CTA — Figma label is "Start free" (not "Start free — no card needed"). */}
          <Link to="/signup">
            <Button>Start free</Button>
          </Link>
        </div>
      </section>


      {/* ═══ FOOTER — Figma "Footer" frame 1033:6503 ═══
          1440 × 72, padding 20/72, HORIZONTAL flex with SPACE_BETWEEN.
          Three children:
            1. Logo instance (1806:9592) — 129×15, identical to the navbar Logo
               (Fevicon icon + "Run" + "Stack" wordmarks).
            2. Copyright text (1033:6507) — "© 2026 CrafterTech. All rights
               reserved." — 12/16 Regular, white per Figma fill #ffffff.
            3. ft-links (1033:6508) — horizontal gap 24, three text links:
               Privacy / Terms / Docs — each 12/16 Regular white.
          Hover state on links shifts to brand-accent for affordance. */}
      <footer
        className="site-footer"
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 72px',
          boxSizing: 'border-box',
          background: 'var(--bg-base)',
        }}
      >
        {/* Logo — same 129×15 SVG used in navbar (Figma instance 1806:9592 →
            main component 1362:33597). Fevicon strokes use brand-accent;
            "Run" + "Stack" wordmarks are pure white. */}
        <svg
          width="129"
          height="15"
          viewBox="0 0 129 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
          aria-label="RunStack"
          role="img"
        >
          {/* Fevicon — three stacked chevrons, brand-accent */}
          <path d="M8.33622 8.28859L13.5 3.16555L18.6637 8.28859L20.25 6.71141L13.5 0L6.74997 6.71141L8.33622 8.28859Z" fill="var(--brand-accent)" />
          <path d="M15.0863 15L20.25 9.87696L25.4138 15L27 13.4228L20.25 6.71141L13.5 13.4228L15.0863 15Z" fill="var(--brand-accent)" />
          <path d="M1.58625 15L6.75 9.87696L11.9138 15L13.5 13.4228L6.74997 6.71141L0 13.4228L1.58625 15Z" fill="var(--brand-accent)" />
          {/* "Run" — 37×15, white, at x:33 */}
          <g transform="translate(33, 0)">
            <path d="M0 14.6609V0H2.85006V14.6609H0ZM8.9516 14.6609L4.45573 8.31782H7.647L12.2834 14.6609H8.9516ZM2.00709 9.79388V7.5H5.74027C6.26211 7.5 6.71036 7.39362 7.08501 7.18085C7.47305 6.96808 7.77411 6.66888 7.9882 6.28324C8.20229 5.89761 8.30933 5.45878 8.30933 4.96675C8.30933 4.46144 8.20229 4.01596 7.9882 3.63032C7.77411 3.24468 7.47305 2.94548 7.08501 2.73271C6.71036 2.51995 6.26211 2.41356 5.74027 2.41356H2.00709V0H5.4392C6.61669 0 7.63362 0.172872 8.48997 0.518616C9.35971 0.864361 10.0287 1.38963 10.4971 2.09441C10.9654 2.7992 11.1995 3.68351 11.1995 4.74734V5.06649C11.1995 6.14362 10.9587 7.02793 10.477 7.71941C10.0087 8.4109 9.34633 8.92952 8.48997 9.27527C7.63362 9.62101 6.61669 9.79388 5.4392 9.79388H2.00709Z" fill="white" />
            <path d="M17.8791 15C16.6213 15 15.6445 14.5878 14.9487 13.7633C14.2663 12.9388 13.9251 11.7154 13.9251 10.0931V3.80984H16.7149V10.3324C16.7149 10.9973 16.9023 11.5293 17.2769 11.9282C17.6516 12.3138 18.16 12.5066 18.8023 12.5066C19.4446 12.5066 19.9664 12.3005 20.3678 11.8883C20.7826 11.4761 20.99 10.9176 20.99 10.2128V3.80984H23.7799V14.6609H21.5721V10.0532H21.7929C21.7929 11.1436 21.6524 12.0545 21.3714 12.7859C21.0904 13.5173 20.6689 14.0691 20.1069 14.4415C19.5449 14.8138 18.8425 15 17.9995 15H17.8791Z" fill="white" />
            <path d="M26.9846 14.6609V3.82979H29.1924V8.47739H28.9917C28.9917 7.37367 29.1389 6.45612 29.4333 5.72473C29.7277 4.98005 30.1625 4.42154 30.7379 4.0492C31.3266 3.67686 32.0559 3.49069 32.9256 3.49069H33.046C34.344 3.49069 35.3274 3.90957 35.9965 4.74734C36.6655 5.57181 37 6.80851 37 8.45745V14.6609H34.2101V8.21809C34.2101 7.55319 34.0161 7.01463 33.6281 6.60239C33.2534 6.19016 32.7316 5.98404 32.0626 5.98404C31.3802 5.98404 30.8249 6.19681 30.3967 6.62234C29.9819 7.03457 29.7745 7.59308 29.7745 8.29787V14.6609H26.9846Z" fill="white" />
          </g>
          {/* "Stack" — 55×15, white, at x:74 */}
          <g transform="translate(74, 0)">
            <path d="M5.62104 15C4.40281 15 3.37659 14.8107 2.54238 14.4321C1.70816 14.0405 1.07257 13.5052 0.635594 12.8264C0.211865 12.1345 0 11.3577 0 10.4961H1.50954C1.50954 11.0444 1.64195 11.5601 1.90678 12.0431C2.18486 12.5131 2.62183 12.8982 3.2177 13.1984C3.82681 13.4856 4.62792 13.6292 5.62104 13.6292C6.5347 13.6292 7.28947 13.4987 7.88534 13.2376C8.49445 12.9765 8.94466 12.624 9.23598 12.1802C9.54053 11.7363 9.69281 11.2402 9.69281 10.6919C9.69281 10 9.41474 9.42559 8.85859 8.96867C8.31569 8.49869 7.49472 8.21802 6.39567 8.12663L4.72723 7.96997C3.48253 7.86553 2.48941 7.48694 1.74788 6.8342C1.0196 6.16841 0.655456 5.29373 0.655456 4.21018C0.655456 3.38773 0.85408 2.66319 1.25133 2.03655C1.64857 1.40992 2.21134 0.913838 2.93962 0.548303C3.68115 0.182768 4.56833 0 5.60117 0C6.64726 0 7.54106 0.189295 8.28259 0.567885C9.03736 0.93342 9.61336 1.44256 10.0106 2.0953C10.4079 2.74804 10.6065 3.50522 10.6065 4.36684H9.09694C9.09694 3.84465 8.97777 3.35509 8.73942 2.89817C8.50107 2.44125 8.12369 2.07572 7.60727 1.80157C7.09085 1.51436 6.42215 1.37076 5.60117 1.37076C4.81992 1.37076 4.17109 1.50131 3.65467 1.7624C3.15149 2.0235 2.7741 2.36945 2.52251 2.80026C2.28417 3.23107 2.16499 3.70104 2.16499 4.21018C2.16499 4.84987 2.39672 5.39164 2.86017 5.83551C3.32363 6.27937 3.99233 6.53394 4.86627 6.59922L6.5347 6.75587C7.51458 6.8342 8.34879 7.04961 9.03736 7.40209C9.73916 7.74151 10.2754 8.1919 10.6462 8.75326C11.017 9.30157 11.2023 9.94778 11.2023 10.6919C11.2023 11.5274 10.9706 12.2715 10.5072 12.9243C10.057 13.577 9.41474 14.0862 8.58052 14.4517C7.7463 14.8172 6.75981 15 5.62104 15Z" fill="white" />
            <path d="M18.2985 14.7846C17.5702 14.7846 16.9412 14.6802 16.4116 14.4713C15.8819 14.2624 15.4714 13.9099 15.1801 13.4138C14.8888 12.9047 14.7431 12.2258 14.7431 11.3773V1.03786H16.1732V11.5927C16.1732 12.1932 16.3387 12.6567 16.6698 12.983C17.0008 13.2963 17.4709 13.453 18.08 13.453H19.9669V14.7846H18.2985ZM12.8562 5.42428V4.30809H19.9669V5.42428H12.8562Z" fill="white" />
            <path d="M29.2018 14.6671V11.5535H28.9634V7.87206C28.9634 7.10183 28.7582 6.51436 28.3477 6.10966C27.9372 5.69191 27.3016 5.48303 26.4409 5.48303C26.0437 5.48303 25.6398 5.48956 25.2293 5.50261C24.8321 5.51567 24.4481 5.53525 24.0773 5.56136C23.7198 5.57441 23.402 5.59399 23.1239 5.6201V4.32768C23.4152 4.30157 23.7132 4.27546 24.0177 4.24935C24.3223 4.22324 24.6335 4.21018 24.9513 4.21018C25.2823 4.19713 25.6001 4.1906 25.9047 4.1906C26.9772 4.1906 27.8379 4.32115 28.4868 4.58224C29.1488 4.84334 29.6321 5.25457 29.9367 5.81593C30.2413 6.36423 30.3935 7.0953 30.3935 8.00914V14.6671H29.2018ZM25.6464 14.9413C24.9049 14.9413 24.2495 14.8107 23.6801 14.5496C23.1107 14.2885 22.6671 13.9099 22.3493 13.4138C22.0447 12.9178 21.8925 12.3172 21.8925 11.6123C21.8925 10.9204 22.0514 10.3329 22.3692 9.84987C22.7002 9.36684 23.1703 9.0013 23.7794 8.75326C24.4017 8.49217 25.1499 8.36162 26.0238 8.36162H29.1025V9.47781H25.9245C25.0903 9.47781 24.4481 9.68016 23.9979 10.0849C23.5609 10.4765 23.3424 10.9922 23.3424 11.6319C23.3424 12.2846 23.5741 12.8068 24.0376 13.1984C24.501 13.577 25.13 13.7663 25.9245 13.7663C26.4145 13.7663 26.8845 13.6815 27.3347 13.5117C27.785 13.329 28.1623 13.0287 28.4669 12.611C28.7714 12.1802 28.937 11.5927 28.9634 10.8486L29.4004 11.4556C29.3475 12.2258 29.1621 12.8721 28.8443 13.3943C28.5265 13.9034 28.0961 14.2885 27.5532 14.5496C27.0103 14.8107 26.3747 14.9413 25.6464 14.9413Z" fill="white" />
            <path d="M38.5438 15C37.6566 15 36.8819 14.8499 36.2199 14.5496C35.571 14.2363 35.0281 13.8185 34.5912 13.2963C34.1542 12.7611 33.8231 12.1736 33.598 11.5339C33.3862 10.8943 33.2802 10.248 33.2802 9.5953V9.32115C33.2802 8.65535 33.3862 8.00914 33.598 7.38251C33.8231 6.74282 34.1542 6.16841 34.5912 5.65927C35.0281 5.13708 35.571 4.72585 36.2199 4.42559C36.8819 4.11227 37.6433 3.95561 38.504 3.95561C39.378 3.95561 40.1526 4.11227 40.8279 4.42559C41.5165 4.7389 42.0726 5.18277 42.4964 5.75718C42.9201 6.33159 43.1717 7.01044 43.2511 7.79373H41.821C41.7019 7.07572 41.3576 6.48172 40.7882 6.01175C40.2321 5.52872 39.4707 5.28721 38.504 5.28721C37.6698 5.28721 36.9746 5.4765 36.4185 5.85509C35.8756 6.22063 35.4651 6.72324 35.187 7.36292C34.909 7.98956 34.7699 8.68799 34.7699 9.45822C34.7699 10.2154 34.909 10.9204 35.187 11.5731C35.4651 12.2128 35.8822 12.7285 36.4384 13.1201C36.9945 13.4987 37.6963 13.688 38.5438 13.688C39.1926 13.688 39.7554 13.577 40.2321 13.3551C40.722 13.1201 41.1126 12.8068 41.4039 12.4151C41.7085 12.0235 41.8872 11.5927 41.9402 11.1227H43.3703C43.3173 11.906 43.0657 12.5914 42.6155 13.1789C42.1786 13.7533 41.6092 14.2037 40.9074 14.53C40.2056 14.8433 39.4177 15 38.5438 15Z" fill="white" />
            <path d="M53.2521 14.6671L49.0214 9.8107H47.3133L52.2987 4.30809H53.8877L49.4187 9.22324L49.518 8.42037L55 14.6671H53.2521ZM46.1017 14.6671V0.372063H47.5914V14.6671H46.1017Z" fill="white" />
          </g>
        </svg>

        {/* Copyright — 12/16 Regular, white. Figma 1033:6507. */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '16px',
            color: 'var(--text-primary)',
          }}
        >
          © 2026 RunStack. All rights reserved.
        </span>

        {/* ft-links — Figma 1033:6508, horizontal gap 24, white labels with
            brand-accent on hover for affordance. */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Docs'].map(l => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '16px',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
