import type { Metadata } from "next";
import Link from "next/link";
import { bilingual } from "@/components/ui";
import contact from "@/data/contact.json";
import site from "@/data/site.json";
import { textMap } from "@/lib/content";
import styles from "./frontpage.module.css";

export const metadata: Metadata = {
  title: site.meta[0].site_name,
  description: site.meta[0].description,
};

const academy = textMap(site.texts);
const details = textMap(contact.texts);

export default function Frontpage() {
  return (
    <div className={styles.page}>
      <section className={styles.identity} aria-labelledby="frontpage-title">
        <div className={styles.identityCopy}>
          <p className={styles.established}>
            {bilingual(academy.t22.en, academy.t22.bn)}
          </p>
          <h1 id="frontpage-title" className={styles.title}>
            {bilingual(academy.t21.en, academy.t21.bn)}
          </h1>
          <span className={styles.goldRule} aria-hidden="true" />
        </div>
        <div className={styles.markPanel}>
          <div className={styles.markFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/brand/logo.png" alt="Nazrul Academy logo" />
          </div>
        </div>
      </section>

      <div className={styles.homeAction}>
        <Link href="/" className={styles.homeButton}>
          <span className="lang-en">Head to Home</span>
          <span className="lang-bn">হোম পেজে যান</span>
        </Link>
      </div>

      <section className={styles.contacts} aria-labelledby="contact-heading">
        <h2 id="contact-heading" className={styles.visuallyHidden}>
          {bilingual(details.t4.en, details.t4.bn)}
        </h2>
        <div className={styles.contactGrid}>
          <ContactItem
            label={details.t5.en}
            labelBn={details.t5.bn}
            value={details.t6.en}
            valueBn={details.t6.bn}
          />
          <ContactItem
            label={details.t7.en}
            labelBn={details.t7.bn}
            value={details.t8.text}
            valueBn={details.t8.text}
          />
          <ContactItem
            label={details.t9.en}
            labelBn={details.t9.bn}
            value={details.t10.text}
            valueBn={details.t10.text}
          />
        </div>
      </section>
    </div>
  );
}

function ContactItem({
  label,
  labelBn,
  value,
  valueBn,
}: {
  label: string;
  labelBn: string;
  value: string;
  valueBn: string;
}) {
  return (
    <div className={styles.contactItem}>
      <h3>{bilingual(label, labelBn)}</h3>
      <p>{bilingual(value, valueBn)}</p>
    </div>
  );
}
