import type { Metadata } from "next";
import { ICON, ph, bilingual, photo } from "@/components/ui";
import Link from "next/link";
import { Fragment } from "react";
import data_notices from "@/data/notices.json";
import data_home from "@/data/home.json";
import data_events from "@/data/events.json";
import data_site from "@/data/site.json";
import data_activities from "@/data/activities.json";
import { textMap, slotMap, type EventItem, type NoticeItem } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_home.meta[0];
  // The root layout's title template does not apply to the home page itself, so add the site suffix here.
  return { title: `${title} — ${data_site.meta[0].title_suffix}`, description };
}

const txt = textMap(data_home.texts);
const eventTxt = textMap(data_events.texts);
const imgs = slotMap(data_home.images);
const [banglaBeforeName, banglaAfterName] = txt.t5.text.split("কাজী নজরুল ইসলাম");

function heroSection() {
  return (
    <section className="relative bg-green-950 text-cream-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #D7B36A 0, transparent 45%), radial-gradient(circle at 85% 70%, #D7B36A 0, transparent 40%)`,
        }}
      ></div>
      <div className="wrap grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center py-20 lg:py-0 lg:min-h-[640px] relative">
        <div className="max-w-xl">
          <span className="eyebrow text-gold-300">
            {bilingual(txt.t2.en, txt.t2.bn)}
          </span>
          <h1 className="font-display mt-6 text-[2.5rem] leading-[1.1] sm:text-5xl sm:leading-[1.08] font-medium">
            <span className="lang-en">
              {txt.t3.text}{" "}
              <em className="italic text-gold-300">{txt.t4.text}</em>
            </span>
            <span className="lang-bn">
              {banglaBeforeName}
              <em className="italic text-gold-300">কাজী নজরুল ইসলাম</em>
              {banglaAfterName}
            </span>
          </h1>
          <p className="mt-6 text-cream-100/80 text-[1.05rem] leading-relaxed lang-en">
            {txt.t1.en}
          </p>
          <p className="mt-6 text-cream-100/80 text-[1.05rem] leading-relaxed lang-bn">
            {txt.t1.bn}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/about/" className="btn btn-gold">
              {bilingual(txt.t6.en, txt.t6.bn)} {ICON.arrow}
            </Link>
            <Link href="/programs/" className="btn btn-outline">
              {bilingual(txt.t7.en, txt.t7.bn)}
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] w-full max-w-md mx-auto rounded-sm overflow-hidden border border-cream-100/20 bg-green-900/40">
            <img
              src={imgs.i1.src}
              alt={imgs.i1.alt}
              className="w-full h-full object-cover"
            />
            <div className="hidden">
              {ICON.image}
              <span className="ph-label !bg-green-950/60 !border-cream-100/25 !text-cream-100">
                <span className="lang-en">{txt.t10.en}</span>
                <span className="lang-bn">{txt.t10.bn}</span>
              </span>
            </div>
          </div>
          <div className="hidden sm:block absolute -bottom-6 -left-6 w-40 bg-cream-50 text-charcoal-900 rounded-sm shadow-xl p-4 motif-corner">
            <p className="quote-mark text-gold-500 mb-1">{ICON.quote}</p>
            <p className="text-xs italic leading-relaxed lang-en">
              {txt.t11.en}
            </p>
            <p className="text-xs italic leading-relaxed lang-bn">
              {txt.t11.bn}
            </p>
            <p className="text-[.65rem] mt-2 text-charcoal-500">
              — <span className="lang-en">{txt.t12.en}</span>
              <span className="lang-bn">{txt.t12.bn}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="motif-divider on-dark"></div>
    </section>
  );
}
function aboutPreview() {
  return (
    <section className="section-pad">
      <div className="wrap grid lg:grid-cols-2 gap-14 items-center">
        <div>
          {photo(imgs.i2, "Academy building — placeholder", "aspect-[16/11]")}
        </div>
        <div>
          <span className="eyebrow">{bilingual(txt.t14.en, txt.t14.bn)}</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 text-green-900 font-medium">
            {bilingual(txt.t15.en, txt.t15.bn)}
          </h2>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">
            {txt.t13.en}
          </p>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">
            {txt.t13.bn}
          </p>
          <Link href="/about/" className="btn btn-outline-dark mt-7">
            {bilingual(txt.t16.en, txt.t16.bn)} {ICON.arrow}
          </Link>
        </div>
      </div>
    </section>
  );
}
function noticesSection() {
  const notices: NoticeItem[] = data_notices.notices.slice(0, 3);
  return (
    <section className="section-pad bg-cream-100">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow">{bilingual(txt.t17.en, txt.t17.bn)}</span>
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t18.en, txt.t18.bn)}
            </h2>
          </div>
          <Link href="/notices/" className="btn btn-outline-dark btn-sm">
            {bilingual(txt.t19.en, txt.t19.bn)} {ICON.arrow}
          </Link>
        </div>
        <div className="grid gap-4">
          {notices.map((n, __i) => (
            <div
              key={__i}
              className="card flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5"
            >
              <span className="tag-pill tag-notice shrink-0 w-fit">
                {bilingual(txt.t20.en, txt.t20.bn)}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-charcoal-900 lang-en">
                  {n.en}
                </p>
                <p className="font-semibold text-charcoal-900 lang-bn">
                  {n.bn}
                </p>
                <p className="text-xs text-charcoal-500 mt-1">
                  {n.date} <span className="lang-en">{txt.t21.en}</span>
                  <span className="lang-bn">{txt.t21.bn}</span>
                </p>
              </div>
              <button className="btn btn-outline-dark btn-sm shrink-0">
                {ICON.download} {bilingual(txt.t22.en, txt.t22.bn)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function upcomingEventsSection() {
  const upcoming: EventItem[] = data_events.upcoming.slice(0, 4);
  return (
    <section className="section-pad">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(eventTxt.t7.en, eventTxt.t7.bn)}
            </h2>
          </div>
          <Link href="/events/" className="btn btn-outline-dark btn-sm">
            {bilingual(txt.t25.en, txt.t25.bn)} {ICON.arrow}
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcoming.map((event, __i) => (
            <div key={__i} className="card overflow-hidden flex flex-col">
              {photo({ src: event.photo }, event.en + " — placeholder", "aspect-[4/3]")}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-display text-lg text-green-900 leading-snug">
                  <span className="lang-en">{event.en}</span>
                  <span className="lang-bn">{event.bn}</span>
                </h3>
                <Link
                  href="/events/"
                  className="text-sm font-semibold text-green-900 inline-flex items-center gap-1 mt-1"
                >
                  {bilingual(txt.t28.en, txt.t28.bn)} {ICON.arrow}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function activitiesSection() {
  const acts = data_activities.acts.slice(0, 3);
  return (
    <section className="section-pad bg-cream-100">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow">{bilingual(txt.t29.en, txt.t29.bn)}</span>
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t30.en, txt.t30.bn)}
            </h2>
          </div>
          <Link href="/activities/" className="btn btn-outline-dark btn-sm">
            {bilingual(txt.t31.en, txt.t31.bn)} {ICON.arrow}
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {acts.map((a, __i) => (
            <div key={__i} className="card overflow-hidden">
              {photo(
                { src: a.photo },
                "Activity photo — placeholder",
                "aspect-[4/3]",
              )}
              <div className="p-5">
                <p className="text-xs text-charcoal-500 mb-1">{a.date}</p>
                <p className="text-sm font-semibold text-charcoal-900 leading-snug">
                  <span className="lang-en">{a.en}</span>
                  <span className="lang-bn">{a.bn}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function publicationsSection() {
  const pubs = data_home.pubs;
  return (
    <section className="section-pad">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow">{bilingual(txt.t32.en, txt.t32.bn)}</span>
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t33.en, txt.t33.bn)}
            </h2>
          </div>
          <Link href="/publications/" className="btn btn-outline-dark btn-sm">
            {bilingual(txt.t34.en, txt.t34.bn)} {ICON.arrow}
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pubs.map((p, __i) => (
            <div key={__i} className="flex flex-col">
              {photo({ src: p.photo }, "Cover — placeholder", "aspect-[3/4]")}
              <h3 className="font-display text-base text-green-900 mt-4 leading-snug">
                <span className="lang-en">{p.title_en}</span>
                <span className="lang-bn">{p.title_bn}</span>
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">{p.auth}</p>
              <Link
                href="/publications/"
                className="text-sm font-semibold text-green-900 inline-flex items-center gap-1 mt-2"
              >
                {bilingual(txt.t35.en, txt.t35.bn)} {ICON.arrow}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function nazrulCornerSection() {
  return (
    <section className="section-pad bg-green-950 text-cream-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 30%, #D7B36A 0, transparent 45%)`,
        }}
      ></div>
      <div className="wrap grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-center relative">
        <div className="relative mx-auto lg:mx-0 max-w-sm w-full">
          {photo(
            imgs.i4,
            "Portrait of Kazi Nazrul Islam — placeholder",
            "aspect-[3/4]",
            "!rounded-[6px] border border-gold-300/30",
          )}
        </div>
        <div>
          <span className="eyebrow text-gold-300">
            {bilingual(txt.t38.en, txt.t38.bn)}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 font-medium">
            {bilingual(txt.t39.en, txt.t39.bn)}
          </h2>
          <p className="mt-5 text-cream-100/80 leading-relaxed lang-en">
            {txt.t37.en}
          </p>
          <p className="mt-5 text-cream-100/80 leading-relaxed lang-bn">
            {txt.t37.bn}
          </p>
          <blockquote className="mt-6 border-l-2 border-gold-300 pl-5">
            <p className="italic font-display text-lg text-gold-300 lang-en">
              {txt.t40.en}
            </p>
            <p className="italic font-display text-lg text-gold-300 lang-bn">
              {txt.t40.bn}
            </p>
            <p className="text-xs text-cream-100/60 mt-2">
              <span className="lang-en">{txt.t41.en}</span>
              <span className="lang-bn">{txt.t41.bn}</span>
            </p>
          </blockquote>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/about-nazrul/" className="btn btn-gold">
              {bilingual(txt.t42.en, txt.t42.bn)}
            </Link>
            <Link href="/about-nazrul/#songs" className="btn btn-outline">
              {bilingual(txt.t43.en, txt.t43.bn)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
function heritageSection() {
  return (
    <section className="section-pad">
      <div className="wrap grid lg:grid-cols-2 gap-14 items-center">
        <div className="order-2 lg:order-1">
          <span className="eyebrow">{bilingual(txt.t45.en, txt.t45.bn)}</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 text-green-900 font-medium">
            {bilingual(txt.t46.en, txt.t46.bn)}
          </h2>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">
            {txt.t44.en}
          </p>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">
            {txt.t44.bn}
          </p>
          <Link href="/heritage/" className="btn btn-outline-dark mt-7">
            {bilingual(txt.t47.en, txt.t47.bn)} {ICON.arrow}
          </Link>
        </div>
        <div className="order-1 lg:order-2">
          {photo(
            imgs.i3,
            "Historical photograph — placeholder",
            "aspect-[16/11]",
          )}
        </div>
      </div>
    </section>
  );
}
function gallerySection() {
  const gallery = data_home.gallery;
  return (
    <section className="section-pad bg-cream-100">
      <div className="wrap">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="eyebrow justify-center">
            {bilingual(txt.t48.en, txt.t48.bn)}
          </span>
          <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
            {bilingual(txt.t49.en, txt.t49.bn)}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {gallery.map((g, __i) => (
            <Fragment key={__i}>
              {photo(
                { src: g.photo },
                g.label + " — placeholder",
                "aspect-square",
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
export default function HomePage() {
  return (
    <>
      <ExtraImages items={data_home.extras} after={0} />
      {heroSection()}
      <ExtraImages items={data_home.extras} after={1} />
      {aboutPreview()}
      <ExtraImages items={data_home.extras} after={2} />
      {noticesSection()}
      <ExtraImages items={data_home.extras} after={3} />
      {upcomingEventsSection()}
      <ExtraImages items={data_home.extras} after={4} />
      {activitiesSection()}
      <ExtraImages items={data_home.extras} after={5} />
      {publicationsSection()}
      <ExtraImages items={data_home.extras} after={6} />
      {nazrulCornerSection()}
      <ExtraImages items={data_home.extras} after={7} />
      {heritageSection()}
      <ExtraImages items={data_home.extras} after={8} />
      {gallerySection()}
      <ExtraImages items={data_home.extras} after={9} />
    </>
  );
}
