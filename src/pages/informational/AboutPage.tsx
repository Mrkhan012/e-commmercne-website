import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Scissors,
  Leaf,
  Handshake,
  Gem,
  Ruler,
  Award,
  Milestone,
  Hammer,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Recycle,
  Feather,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { cn } from '@/utils/cn';

/* ─── Shared reveal wrapper ────────────────────────────────────────────────── */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const values = [
  {
    icon: Scissors,
    title: 'Cut with intent',
    body: 'Every pattern begins on the stand, not the screen. We draft, drape and recut until the line is right, then cut by hand in small runs so nothing is lost to rounding errors.',
  },
  {
    icon: Gem,
    title: 'Materials first',
    body: 'Full-grain Tuscan leather, GOTS cotton, RWS merino. We buy from eleven named mills and tanneries and publish every one of them. If a fabric cannot be traced, it does not enter the studio.',
  },
  {
    icon: Ruler,
    title: 'Made to last',
    body: 'Double-stitched seams, reinforced stress points, hardware rated for a decade of daily use. Our atelier repairs any NOIR & CO. piece at cost for as long as you own it.',
  },
  {
    icon: Leaf,
    title: 'Quietly responsible',
    body: 'Chrome-free tanning, solvent-free adhesives, plastic-free packaging and a 150% shipping offset. We are slow on purpose: small batches, no seasonal destruction of unsold stock.',
  },
  {
    icon: Handshake,
    title: 'Paid fairly',
    body: 'We manufacture with four partner ateliers we have visited and named. Wages exceed local living-wage benchmarks, hours are capped, and independent audits are published annually.',
  },
  {
    icon: Award,
    title: 'Considered design',
    body: 'We release two collections a year instead of twelve. Each piece earns its place by working with what you already own — fewer, better, longer.',
  },
];

const milestones = [
  {
    year: '2019',
    title: 'A studio on Greene Street',
    body: 'Founded by pattern cutter Amara Osei and industrial designer Julien Roux above a frame shop in SoHo. The first run was 40 coats, cut on a borrowed table.',
  },
  {
    year: '2020',
    title: 'The direct model',
    body: 'With wholesale frozen, we began selling straight to clients. The lesson shaped the brand forever: no middle layer, no markup theatre, no warehouse of unsold stock.',
  },
  {
    year: '2021',
    title: 'Leather atelier, North Carolina',
    body: 'A 6,000 sq ft atelier in Burlington began producing our bag line, working alongside LWG Gold-rated tanneries within a two-hour drive of the workshop floor.',
  },
  {
    year: '2022',
    title: 'Repair for life',
    body: 'We opened the repair bench in New York and committed to repairing every piece at cost, forever. Over 4,000 items have come back through it since.',
  },
  {
    year: '2023',
    title: 'Traceability, published',
    body: 'Every material in every product gained a named origin — mill, tannery, country. Our supply-chain disclosure became the most-read page on the site.',
  },
  {
    year: '2024',
    title: 'Europe, from Milan',
    body: 'A Milan showroom and EU fulfilment hub opened, cutting transatlantic delivery times in half and letting European clients order without import surprises.',
  },
  {
    year: '2025',
    title: 'The circular bench',
    body: 'Take-back and resale launched. Returned pieces are repaired, re-conditioned and re-homed — and anything beyond saving is separated and recycled into new linings.',
  },
  {
    year: '2026',
    title: 'Seven years in',
    body: 'Two collections a year, 62 countries served, and a client list of 140,000 people who own something we made. The work stays the same: cut it well, make it last.',
  },
];

const materials = [
  {
    icon: Feather,
    name: 'Full-grain leather',
    origin: 'Tanneries in Santa Croce sull’Arno, Tuscany',
    detail:
      'Vegetable-tanned over six weeks in oak and chestnut bark. Chrome-free, and it patinas rather than wears out.',
  },
  {
    icon: Scissors,
    name: 'GOTS organic cotton',
    origin: 'A certified mill in Izmir, Türkiye',
    detail:
      'Grown without synthetic pesticides and spun on the same floor it is woven on. Used for canvases, linings and dust bags.',
  },
  {
    icon: Gem,
    name: 'RWS merino wool',
    origin: 'A responsible-wool collective in Aotearoa',
    detail:
      'Traceable to farm, mulesing-free and fine enough for tailoring that holds a crease without itching.',
  },
  {
    icon: Recycle,
    name: 'Recycled hardware',
    origin: 'A family foundry in Birmingham, England',
    detail:
      'Brass and steel cast from 92% reclaimed metal, then hand-polished and plated to outlive the leather it sits on.',
  },
];

const studios = [
  {
    city: 'New York',
    role: 'Atelier, repair bench & flagship',
    address: '118 Greene Street, Floor 4, New York, NY 10012',
    note: 'Cutting, tailoring, repairs and client appointments. Visits by appointment, Tuesday to Saturday.',
  },
  {
    city: 'Burlington, NC',
    role: 'Leather goods workshop',
    address: '2410 Huffman Mill Road, Burlington, NC 27215',
    note: 'Where every bag, belt and small leather good is made. Factory tours run the first Friday of each month.',
  },
  {
    city: 'Milan',
    role: 'Showroom & EU fulfilment',
    address: 'Via della Spiga 21, 20121 Milano MI, Italy',
    note: 'European appointments and same-week delivery across the EU from our Milan hub.',
  },
  {
    city: 'Kyoto',
    role: 'Textile development',
    address: 'Nakagyō-ku, Kyoto, 604-8156, Japan',
    note: 'Our resident textile lead works with two mills here on indigo dyeing and seasonal cloth development.',
  },
];

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  useSeo({
    title: 'About',
    description:
      'NOIR & CO. was founded in 2019 on a simple premise: cut it well, make it last, and tell the truth about where it was made. Two collections a year, named suppliers, repairs for life.',
  });

  return (
    <div>
      {/* ─── Editorial hero ─── */}
      <header className="relative overflow-hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Est. 2019 — New York
              </p>
              <h1 className="mt-5 text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
                Cut it well.
                <br />
                <span className="font-editorial font-normal italic text-[var(--color-noir-gold)]">
                  Make it last.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                NOIR &amp; CO. is a small house with a narrow brief: fewer, better things, made by
                people we know, in places we name, sold without theatre. Seven years, four studios
                and two collections a year.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/shop">
                    Explore the collection
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Visit a studio</Link>
                </Button>
              </div>
            </div>

            {/* Stats rail — deliberate asymmetry against the headline column */}
            <div className="lg:col-span-5">
              <dl className="grid grid-cols-2 gap-px border border-[var(--border-color)] bg-[var(--border-color)]">
                {[
                  { k: '2019', v: 'Founded in SoHo' },
                  { k: '4', v: 'Studios worldwide' },
                  { k: '11', v: 'Named mills & tanneries' },
                  { k: '62', v: 'Countries served' },
                  { k: '4,000+', v: 'Pieces repaired' },
                  { k: '2', v: 'Collections a year' },
                ].map((stat) => (
                  <div key={stat.v} className="bg-[var(--bg-card)] p-5 sm:p-6">
                    <dt className="font-editorial text-3xl font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl">
                      {stat.k}
                    </dt>
                    <dd className="mt-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {stat.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        {/* Single subtle gradient wash, used once on this page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
        />
      </header>

      {/* ─── Our story ─── */}
      <section aria-labelledby="story-heading" className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Chapter one
                </p>
                <h2
                  id="story-heading"
                  className="mt-4 font-editorial text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] sm:text-5xl"
                >
                  Our story
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Two people, one cutting table and a stubborn belief about how clothes should be
                  made and sold.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <div className="space-y-6 text-base leading-[1.75] text-[var(--text-secondary)]">
                  <p>
                    NOIR &amp; CO. began in 2019 in a fourth-floor room above a frame shop on Greene
                    Street. Amara was a pattern cutter who had spent a decade watching good design
                    get quietly engineered out of collections to hit a price point. Julien was an
                    industrial designer who believed most products were designed for the showroom
                    rather than the decade that followed. They shared one conviction: if you make
                    something properly and price it honestly, people will keep it — and keeping it is
                    the only sustainability that has ever actually worked.
                  </p>
                  <p>
                    The first run was forty coats, cut by hand on a borrowed table and sold directly
                    to whoever walked up the stairs. There was no wholesale, no wholesale markup and
                    no plan to make a second collection until the first one was worn out. When
                    travel stopped in 2020 and the trade shows went quiet, that direct model stopped
                    being a choice and became the whole business. We learned to hold less stock, to
                    make only what had been asked for, and to answer our own email.
                  </p>
                  <p>
                    In 2021 the leather work moved to Burlington, North Carolina, into a workshop
                    within two hours of the tanneries that supplied it. In 2024 we opened in Milan so
                    European clients could order without import surprises. In between, we added the
                    thing we are proudest of: a repair bench in New York that fixes any NOIR &amp;
                    CO. piece, at cost, for as long as it is owned. More than four thousand items
                    have come back through it — restitched, re-lined, re-zipped and sent home again.
                  </p>
                  <p>
                    Today we release two collections a year rather than twelve, publish the name of
                    every mill and tannery we buy from, and measure success by how rarely our clients
                    need to replace anything. It is a slower way to run a clothing company. It is
                    also the only version of this we found interesting.
                  </p>
                </div>
              </Reveal>

              {/* Pull quote */}
              <Reveal delay={0.1}>
                <figure className="mt-12 border-l-2 border-[var(--color-noir-gold)] pl-6 sm:pl-8">
                  <blockquote className="font-editorial text-2xl font-normal italic leading-[1.35] text-[var(--text-primary)] sm:text-3xl">
                    “We are not trying to sell you more. We are trying to make the thing you already
                    bought last longer than the trend that sold it to you.”
                  </blockquote>
                  <figcaption className="mt-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Amara Osei — Co-founder &amp; Head of Design
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Values grid ─── */}
      <section
        aria-labelledby="values-heading"
        className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              What we hold to
            </p>
            <h2
              id="values-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Six principles, applied daily
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              These are not poster lines. Each one has changed something concrete about how we buy,
              make, price or repair.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.05}>
                <article className="group h-full bg-[var(--bg-card)] p-8 transition-colors hover:bg-[var(--bg-primary)]">
                  <span className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-color)] text-[var(--color-noir-gold)] transition-colors group-hover:border-[var(--color-noir-gold)]">
                    <value.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-heading text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {value.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section aria-labelledby="timeline-heading" className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              2019 — 2026
            </p>
            <h2
              id="timeline-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Seven years, eight turning points
            </h2>
          </Reveal>

          <ol className="mt-14 border-t border-[var(--border-color)]">
            {milestones.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.04}>
                <li className="grid grid-cols-1 gap-4 border-b border-[var(--border-color)] py-8 sm:grid-cols-12 sm:gap-8">
                  <div className="sm:col-span-3 lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <Milestone
                        className="h-4 w-4 shrink-0 text-[var(--color-noir-gold)]"
                        aria-hidden="true"
                      />
                      <span className="font-editorial text-3xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                        {item.year}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-9 lg:col-span-10">
                    <h3 className="font-heading text-base font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
                      {item.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Craft & materials ─── */}
      <section
        aria-labelledby="craft-heading"
        className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  The craft
                </p>
                <h2
                  id="craft-heading"
                  className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
                >
                  Materials with a name attached
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  We buy from eleven mills and tanneries and publish every one. If a material cannot
                  be traced back to a specific place and process, it does not enter the studio — no
                  exceptions, no “sourced responsibly” on a swing tag with nothing behind it.
                </p>

                <div className="mt-8 flex items-start gap-4 border border-[var(--color-noir-gold)] p-6">
                  <Hammer
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-noir-gold)]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                      How a piece is made
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      Drafted on the stand in New York, cut in runs of 60 to 200, assembled by a
                      named maker, then inspected twice before it is packed. Twenty-two pairs of
                      hands touch a coat; roughly forty minutes of hand-finishing go into a bag.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <ul className="grid grid-cols-1 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2">
                {materials.map((material, index) => (
                  <Reveal key={material.name} delay={index * 0.05}>
                    <li className="h-full bg-[var(--bg-card)] p-7">
                      <span className="inline-flex h-10 w-10 items-center justify-center border border-[var(--border-color)] text-[var(--color-noir-gold)]">
                        <material.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 font-heading text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                        {material.name}
                      </h3>
                      <p className="mt-1 font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                        {material.origin}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {material.detail}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Studio locations ─── */}
      <section aria-labelledby="studios-heading" className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Where we work
              </p>
              <h2
                id="studios-heading"
                className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
              >
                Four studios
              </h2>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors hover:text-[var(--color-noir-gold)]"
            >
              Book an appointment
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2">
            {studios.map((studio, index) => (
              <Reveal key={studio.city} delay={index * 0.05}>
                <article className="h-full bg-[var(--bg-card)] p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-editorial text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                      {studio.city}
                    </h3>
                    <MapPin
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--color-noir-gold)]"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {studio.role}
                  </p>
                  <address className="mt-4 text-sm not-italic leading-relaxed text-[var(--text-secondary)]">
                    {studio.address}
                  </address>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {studio.note}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        aria-labelledby="about-cta-heading"
        className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal
            className={cn(
              'flex flex-col gap-8 border border-[var(--border-color)] bg-[var(--bg-card)] p-8 sm:p-12',
              'lg:flex-row lg:items-center lg:justify-between'
            )}
          >
            <div className="max-w-xl">
              <h2
                id="about-cta-heading"
                className="font-heading text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl"
              >
                Come and see how it is made
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Studio visits run Tuesday to Saturday in New York and the first Friday of each month
                in Burlington. Write to us and we will find a time — there is no showroom, just the
                work itself.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link to="/shop">Shop the collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Arrange a visit</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
