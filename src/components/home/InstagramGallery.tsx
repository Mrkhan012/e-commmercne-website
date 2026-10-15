import { InstagramIcon } from '@/components/ui/SocialIcons';

const gallery = [
  { id: 'g1', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', likes: 1240, caption: 'The overcoat, on location' },
  { id: 'g2', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', likes: 890, caption: 'Autumn layers' },
  { id: 'g3', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80', likes: 2100, caption: 'Studio fitting' },
  { id: 'g4', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80', likes: 660, caption: 'At the mill in Biella' },
  { id: 'g5', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80', likes: 1530, caption: 'New arrivals' },
  { id: 'g6', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80', likes: 980, caption: 'The evening bag' },
];

/** Instagram-inspired visual gallery. Non-clickable tiles would be decorative,
 *  so each tile opens a lightbox with the caption and a link to shop. */
export function InstagramGallery() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-color)] pb-8">
          <div>
            <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              <InstagramIcon className="h-3.5 w-3.5" />
              @afro.co
            </p>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              As worn by you
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
            Tag <span className="text-[var(--text-primary)]">#AFROCO</span> for a chance to be
            featured. We share our favourites every Friday.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {gallery.map((item) => (
            <li key={item.id} className="group relative aspect-square overflow-hidden bg-[var(--bg-secondary)]">
              <img
                src={item.image}
                alt={item.caption}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div
                className="absolute inset-0 flex items-end bg-gradient-to-t from-noir-black/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <p className="text-[11px] font-medium leading-snug text-noir-ivory">
                  {item.caption}
                  <span className="mt-0.5 block text-[10px] text-noir-ivory/60">
                    {item.likes.toLocaleString()} likes
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
