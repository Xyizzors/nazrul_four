import type { Metadata } from "next";
import { ICON, bilingual, innerHero, photo } from "@/components/ui";
import Link from "next/link";
import data_about_nazrul from "@/data/about-nazrul.json";
import { textMap, slotMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";
import ImageZoom from "@/components/ImageZoom";

export function generateMetadata(): Metadata {
  const { title, description } = data_about_nazrul.meta[0];
  return { title, description };
}

const txt = textMap(data_about_nazrul.texts);
const imgs = slotMap(data_about_nazrul.images);

export default function AboutNazrulPage() {
  const quotes = data_about_nazrul.quotes;
  const works = data_about_nazrul.works;

  return (
    <>
      <ExtraImages items={data_about_nazrul.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_about_nazrul.extras} after={1} />

      <section id="biography" data-zoom className="section-pad">
        <div className="wrap grid lg:grid-cols-2 gap-14 items-start">
          <div className="flex flex-col gap-8">
            <figure>
              {photo(imgs.i1, "Portrait of Kazi Nazrul Islam — placeholder", "aspect-[3/4]")}
              <figcaption className="mt-3 text-sm text-charcoal-500 text-center">
                <span className="lang-en">{txt.t15.en}</span>
                <span className="lang-bn">{txt.t15.bn}</span>
              </figcaption>
            </figure>
            <figure>
              {photo(imgs.i2, "Portrait of Kazi Nazrul Islam — placeholder", "aspect-[3/4]")}
              <figcaption className="mt-3 text-sm text-charcoal-500 text-center">
                <span className="lang-en">{txt.t16.en}</span>
                <span className="lang-bn">{txt.t16.bn}</span>
              </figcaption>
            </figure>
            <figure>
              {photo(imgs.i4, "Poet Talim Hossain feeding the poet", "aspect-[3/4]")}
              <figcaption className="mt-3 text-sm text-charcoal-500 text-center">
                <span className="lang-en">{txt.t18.en}</span>
                <span className="lang-bn">{txt.t18.bn}</span>
              </figcaption>
            </figure>
          </div>
          <div>
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t6.en, txt.t6.bn)}
            </h2>
            <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">
              {txt.t4.en}
            </p>
            <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">
              {txt.t4.bn}
            </p>
            <figure className="mt-10">
              {photo(imgs.i3, "Nazrul's Chrysler — placeholder", "aspect-[16/10]")}
              <figcaption className="mt-3 text-sm text-charcoal-500">
                <span className="lang-en">{txt.t17.en}</span>
                <span className="lang-bn">{txt.t17.bn}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <ExtraImages items={data_about_nazrul.extras} after={2} />

      <section className="section-pad bg-green-950 text-cream-50">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-14">
            
            <h2 className="font-display text-3xl mt-4 font-medium">
              {bilingual(txt.t8.en, txt.t8.bn)}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {quotes.map((q, __i) => (
              <blockquote key={__i} className="border-l-2 border-gold-300 pl-5">
                <p className="quote-mark text-gold-300 mb-2">{ICON.quote}</p>
                <p className="italic font-display text-lg leading-snug lang-en">
                  {q.en}
                </p>
                <p className="italic font-display text-lg leading-snug lang-bn">
                  {q.bn}
                </p>
                <p className="text-xs text-cream-100/60 mt-3">
                  <span className="lang-en">— {q.src_en}</span>
                  <span className="lang-bn">— {q.src_bn}</span>
                </p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_about_nazrul.extras} after={3} />

      <section id="songs" className="section-pad">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-14">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t11.en, txt.t11.bn)}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {works.map((w, __i) => (
              <div key={__i} className="card p-7 motif-corner">
                <h3 className="font-display text-xl text-green-900">
                  <span className="lang-en">{w.en}</span>
                  <span className="lang-bn">{w.bn}</span>
                </h3>
                <p className="mt-3 text-sm text-charcoal-700 leading-relaxed">
                  <span className="lang-en">{w.desc_en}</span>
                  <span className="lang-bn">{w.desc_bn}</span>
                </p>
                <Link
                  href="/publications/"
                  className="text-sm font-semibold text-green-900 inline-flex items-center gap-1 mt-4"
                >
                  {bilingual(txt.t12.en, txt.t12.bn)} {ICON.arrow}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-charcoal-500 mt-10 max-w-xl mx-auto text-center lang-en">
            {txt.t9.en}
          </p>
          <p className="text-xs text-charcoal-500 mt-10 max-w-xl mx-auto text-center lang-bn">
            {txt.t9.bn}
          </p>
        </div>
      </section>
      <ExtraImages items={data_about_nazrul.extras} after={4} />

      <section data-zoom className="section-pad bg-cream-100">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-10">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t14.en, txt.t14.bn)}
            </h2>
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {data_about_nazrul.portraits
              .filter((g) => g.photo)
              .map((g, __i) => (
                <figure key={__i} className="break-inside-avoid mb-6">
                  <img
                    src={g.photo}
                    alt={g.en || g.label}
                    loading="lazy"
                    className="w-full h-auto rounded-sm bg-cream-200"
                  />
                  {(g.en || g.bn) && (
                    <figcaption className="mt-2 text-sm text-charcoal-700 leading-relaxed">
                      {bilingual(g.en ?? "", g.bn ?? "")}
                    </figcaption>
                  )}
                </figure>
              ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_about_nazrul.extras} after={5} />
      <ImageZoom />
    </>
  );
}
