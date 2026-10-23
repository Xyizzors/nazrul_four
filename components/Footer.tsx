import Link from "next/link";
import { CurrentYear } from "@/components/interactive";
import { ICON, bilingual } from "@/components/ui";
import data_site from "@/data/site.json";
import { textMap, slotMap } from "@/lib/content";

const social = Object.fromEntries(
  data_site.social.map((s) => [s.name, s.url]),
) as Record<"Facebook" | "YouTube" | "Instagram", string>;
const txt = textMap(data_site.texts);
const imgs = slotMap(data_site.images);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="motif-divider on-dark"></div>
      <div className="wrap section-pad !py-16">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={imgs.i1.src}
                alt={imgs.i1.alt}
                className="w-11 h-11 rounded-full object-contain bg-cream-50/90 p-0.5"
              />
              <div className="font-display text-lg text-cream-50">
                {bilingual(txt.t1.en, txt.t1.bn)}
              </div>
            </div>
            <p className="text-sm text-cream-100/75 leading-relaxed max-w-xs">
              {bilingual(txt.t2.en, txt.t2.bn)}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={social.Facebook}
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-cream-100/25 flex items-center justify-center hover:bg-cream-100/10"
              >
                {ICON.fb}
              </a>
              <a
                href={social.YouTube}
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-cream-100/25 flex items-center justify-center hover:bg-cream-100/10"
              >
                {ICON.yt}
              </a>
              <a
                href={social.Instagram}
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-cream-100/25 flex items-center justify-center hover:bg-cream-100/10"
              >
                {ICON.ig}
              </a>
            </div>
          </div>

          <div>
            <div className="footer-heading mb-4">
              {bilingual(txt.t3.en, txt.t3.bn)}
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about/" className="footer-link">
                  {bilingual(txt.t4.en, txt.t4.bn)}
                </Link>
              </li>
              <li>
                <Link href="/publications/" className="footer-link">
                  {bilingual(txt.t5.en, txt.t5.bn)}
                </Link>
              </li>
              <li>
                <Link href="/notices/" className="footer-link">
                  {bilingual(txt.t6.en, txt.t6.bn)}
                </Link>
              </li>
              <li>
                <Link href="/programs/#admission" className="footer-link">
                  {bilingual(txt.t7.en, txt.t7.bn)}
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="footer-link">
                  {bilingual(txt.t8.en, txt.t8.bn)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-heading mb-4">
              {bilingual(txt.t9.en, txt.t9.bn)}
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/heritage/" className="footer-link">
                  {bilingual(txt.t10.en, txt.t10.bn)}
                </Link>
              </li>
              <li>
                <Link href="/about-nazrul/" className="footer-link">
                  {bilingual(txt.t11.en, txt.t11.bn)}
                </Link>
              </li>
              <li>
                <Link href="/programs/" className="footer-link">
                  {bilingual(txt.t12.en, txt.t12.bn)}
                </Link>
              </li>
              <li>
                <Link href="/events/" className="footer-link">
                  {bilingual(txt.t13.en, txt.t13.bn)}
                </Link>
              </li>
              <li>
                <Link href="/activities/" className="footer-link">
                  {bilingual(txt.t14.en, txt.t14.bn)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-heading mb-4">
              {bilingual(txt.t15.en, txt.t15.bn)}
            </div>
            <ul className="space-y-3 text-sm text-cream-100/78">
              <li className="flex gap-2.5">
                <span className="mt-0.5 text-gold-300">{ICON.pin}</span>
                <span>{bilingual(txt.t16.en, txt.t16.bn)}</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 text-gold-300">{ICON.phone}</span>
                <span className="lang-en">{txt.t17.en}</span>
                <span className="lang-bn">{txt.t17.bn}</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 text-gold-300">{ICON.mail}</span>
                <span>{txt.t18.text}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream-100/15 mt-12 pt-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-cream-100/60">
          <p>
            {bilingual(txt.t19.en, txt.t19.bn)}
            <CurrentYear /> {bilingual(txt.t20.en, txt.t20.bn)}
          </p>
        </div>
      </div>
    </footer>
  );
}
