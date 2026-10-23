/** Shared, client-safe definitions for the control panel. */
export type Value = string | number;
export type Item = Record<string, Value>;
export type PageData = Record<string, Item[]>;
export type Data = Record<string, PageData>;

export const GROUPS: Record<string, Record<string, string>> = {
  "Whole site": {
    site: "Menu, header & footer",
  },
  "Updated often": {
    notices: "Notices",
    events: "Events",
    programs: "Programs",
    "academic-news": "Academic News",
    activities: "Activities",
    home: "Home page (featured)",
  },
  "Updated sometimes": {
    "annual-newsletter": "Annual Newsletter",
    publications: "Publications",
    alumni: "Alumni",
    "our-branches": "Our Branches",
    "around-the-globe": "Around the Globe",
    "our-classrooms": "Our Classrooms",
    heritage: "Heritage",
    about: "About Us (history & galleries)",
    "founders-and-board": "Founders & Board",
    gallery: "Photo Gallery",
  },
  "Rarely changed": {
    admission: "Admission",
    "about-nazrul": "About Nazrul",
    contact: "Contact",
  },
};

export const LISTS: Record<string, string> = {
  upcoming: "Upcoming",
  past: "Past",
  news: "News",
  acts: "Activities",
  pubs: "Publications",
  newsletters: "Reports",
  board: "Executive council (current board)",
  founders: "Founder & Co-Founder",
  gallery1: "Gallery 1",
  gallery2: "Gallery 2",
  timeline: "Timeline",
  archiveCaptioned: "Archive images",
  poemTypes: "Poem types",
  proseWorks: "Prose works",
  songTypes: "Song types",
  albums: "Albums",
  items: "Featured programs & events",
  texts: "All page text",
  images: "Photos on this page",
  extras: "Add images anywhere",
  meta: "Browser title & description",
  sections: "Sections guide",
  gallery: "Photo grid",
  portraits: "Photographs (with captions)",
  eventPhotos: "Event photos",
  speakerPhotos: "Speaker & guest photos",
  nav: "Menu (top level)",
  menu: "Menu (dropdowns)",
  social: "Social media links",
};

/** Short instructions shown above special lists. */
export const LIST_HELP: Record<string, string> = {
  texts:
    "Every piece of text on this page, in the order it appears. English and বাংলা sit side by side. Use search to find a phrase.",
  images:
    "Every photo spot on this page. Upload or browse to replace a grey placeholder or an existing photo.",
  extras:
    "Add a new image anywhere: pick the section it should appear after (numbers are in “Sections guide”; 0 = very top of the page).",
  sections: "Reference only. These numbers are used by “Add images anywhere”.",
  meta: "The title shown in the browser tab and the description search engines show.",
  nav: "Top-level menu items.",
  menu: "Items inside the menu dropdowns. “parent” shows which menu each belongs to.",
};

/** Lists whose items are fixed by the page design: they can be edited but not added, removed or reordered. */
export const FIXED_LISTS = new Set([
  "texts",
  "images",
  "meta",
  "sections",
  "nav",
  "menu",
  "social",
]);

/** Starting point for lists that can be empty. */
export const TEMPLATES: Record<string, Item> = {
  extras: { after: 0, src: "", alt: "", caption_en: "", caption_bn: "" },
  eventPhotos: { photo: "", caption_en: "", caption_bn: "" },
  speakerPhotos: { photo: "", caption_en: "", caption_bn: "" },
};

const FIELD_LABELS: Record<string, string> = {
  after: "Show after section number (0 = very top)",
  src: "Image",
  alt: "Image description (for screen readers)",
  caption_en: "Caption (English)",
  caption_bn: "Caption (বাংলা)",
  photo: "Photo",
  text: "Text",
  title_suffix: "Title ending (e.g. “Nazrul Academy Prototype”)",
  site_name: "Site name",
  url: "Link address",
};

/** Fields that are shown as read-only hints rather than inputs. */
export const isHint = (key: string) => key === "id" || key.startsWith("_");

/** Lists where a new entry reads best at the top. */
export const NEWEST_FIRST = new Set([
  "notices",
  "news",
  "acts",
  "upcoming",
  "past",
  "newsletters",
]);

export const pretty = (s: string) =>
  s.replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

export const pageLabel = (page: string) => {
  for (const group of Object.values(GROUPS))
    if (group[page]) return group[page];
  return pretty(page);
};

export const isBangla = (key: string) => /(^|_)bn$/.test(key);
export const isImage = (key: string) =>
  /(^|_)(src|image|img|photo|cover|thumbnail)$/i.test(key);

export function fieldLabel(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  if (key === "en") return "Text (English)";
  if (key === "bn") return "Text (বাংলা)";
  if (key.endsWith("_en")) return `${pretty(key.slice(0, -3))} (English)`;
  if (key.endsWith("_bn")) return `${pretty(key.slice(0, -3))} (বাংলা)`;
  return pretty(key);
}

/** The text shown on a collapsed item: its first meaningful string field. */
export function summaryOf(item: Item): { key: string; text: string } {
  const keys = Object.keys(item);
  const editable = keys.find(
    (k) =>
      !isHint(k) &&
      typeof item[k] === "string" &&
      String(item[k]).trim() &&
      !isImage(k) &&
      k !== "date" &&
      k !== "year",
  );
  const key =
    editable ??
    keys.find((k) => k === "_title") ??
    keys.find((k) => isImage(k) && item[k]) ??
    keys.find((k) => !isHint(k)) ??
    keys[0];
  const value = String(item[key] ?? "").trim();
  return { key, text: (isImage(key) ? value.split("/").pop() : value) || "(empty)" };
}

/** An empty item with the same fields as `template`. */
export function blankLike(template: Item): Item {
  return Object.fromEntries(
    Object.entries(template).map(([k, v]) => [
      k,
      typeof v === "number" ? 0 : "",
    ]),
  );
}
