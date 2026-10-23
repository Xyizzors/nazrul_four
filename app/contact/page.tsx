import type { Metadata } from "next";
import { ICON, bilingual, innerHero, photo } from "@/components/ui";
import { DemoForm, FormNote } from "@/components/interactive";
import data_contact from "@/data/contact.json";
import { textMap, slotMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

const txt = textMap(data_contact.texts);
const imgs = slotMap(data_contact.images);

export function generateMetadata(): Metadata {
  const { title, description } = data_contact.meta[0];
  return { title, description };
}

export default function ContactPage() {
  return (
    <>
      <ExtraImages items={data_contact.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        showEyebrow: true,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_contact.extras} after={1} />

      <section className="section-pad">
        <div className="wrap grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
          <div>
            <h2 className="font-display text-2xl text-green-900 font-medium mb-6">
              {bilingual(txt.t4.en, txt.t4.bn)}
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-green-100 text-green-800 flex items-center justify-center shrink-0">
                  {ICON.pin}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-charcoal-500 font-semibold">
                    {bilingual(txt.t5.en, txt.t5.bn)}
                  </p>
                  <p className="text-sm text-charcoal-900 mt-1">
                    <span className="lang-en">{txt.t6.en}</span>
                    <span className="lang-bn">{txt.t6.bn}</span>
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-green-100 text-green-800 flex items-center justify-center shrink-0">
                  {ICON.phone}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-charcoal-500 font-semibold">
                    {bilingual(txt.t7.en, txt.t7.bn)}
                  </p>
                  <p className="text-sm text-charcoal-900 mt-1">
                    {txt.t8.text}
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-green-100 text-green-800 flex items-center justify-center shrink-0">
                  {ICON.mail}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-charcoal-500 font-semibold">
                    {bilingual(txt.t9.en, txt.t9.bn)}
                  </p>
                  <p className="text-sm text-charcoal-900 mt-1">
                    {txt.t10.text}
                  </p>
                </div>
              </li>
            </ul>

            <h3 className="font-display text-lg text-green-900 font-medium mt-10 mb-4">
              {bilingual(txt.t11.en, txt.t11.bn)}
            </h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-charcoal-900/10">
                <tr>
                  <td className="py-2 text-charcoal-700">
                    <span className="lang-en">{txt.t12.en}</span>
                    <span className="lang-bn">{txt.t12.bn}</span>
                  </td>
                  <td className="py-2 text-charcoal-900 text-right">
                    {txt.t13.text}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-charcoal-700">
                    <span className="lang-en">{txt.t14.en}</span>
                    <span className="lang-bn">{txt.t14.bn}</span>
                  </td>
                  <td className="py-2 text-charcoal-900 text-right">
                    <span className="lang-en">{txt.t15.en}</span>
                    <span className="lang-bn">{txt.t15.bn}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-10">
              {photo(imgs.i1, "Map — placeholder", "aspect-[16/10]")}
            </div>
          </div>

          <div className="card p-7 sm:p-9 motif-corner h-fit">
            <h2 className="font-display text-2xl text-green-900 font-medium mb-1">
              {bilingual(txt.t17.en, txt.t17.bn)}
            </h2>
            <p className="text-sm text-charcoal-500 mb-7 lang-en">
              {txt.t16.en}
            </p>
            <p className="text-sm text-charcoal-500 mb-7 lang-bn">
              {txt.t16.bn}
            </p>
            <DemoForm className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-charcoal-700 lang-en">
                    {txt.t19.en}
                  </label>
                  <label className="text-xs font-semibold text-charcoal-700 lang-bn">
                    {txt.t19.bn}
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-charcoal-900/20 rounded-sm px-3 py-2.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-700 lang-en">
                    {txt.t20.en}
                  </label>
                  <label className="text-xs font-semibold text-charcoal-700 lang-bn">
                    {txt.t20.bn}
                  </label>
                  <input
                    type="tel"
                    className="mt-1 w-full border border-charcoal-900/20 rounded-sm px-3 py-2.5 text-sm bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal-700 lang-en">
                  {txt.t21.en}
                </label>
                <label className="text-xs font-semibold text-charcoal-700 lang-bn">
                  {txt.t21.bn}
                </label>
                <input
                  type="email"
                  className="mt-1 w-full border border-charcoal-900/20 rounded-sm px-3 py-2.5 text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal-700 lang-en">
                  {txt.t22.en}
                </label>
                <label className="text-xs font-semibold text-charcoal-700 lang-bn">
                  {txt.t22.bn}
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border border-charcoal-900/20 rounded-sm px-3 py-2.5 text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal-700 lang-en">
                  {txt.t23.en}
                </label>
                <label className="text-xs font-semibold text-charcoal-700 lang-bn">
                  {txt.t23.bn}
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full border border-charcoal-900/20 rounded-sm px-3 py-2.5 text-sm bg-white"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary mt-1">
                {bilingual(txt.t24.en, txt.t24.bn)}
              </button>
              <FormNote className="text-sm text-green-800 bg-green-100 rounded-sm px-4 py-3 lang-en">
                {txt.t18.en}
              </FormNote>
              <FormNote className="text-sm text-green-800 bg-green-100 rounded-sm px-4 py-3 lang-bn">
                {txt.t18.bn}
              </FormNote>
            </DemoForm>
          </div>
        </div>
      </section>
      <ExtraImages items={data_contact.extras} after={2} />
    </>
  );
}
