import site from "@/data/site.json";

export interface NavLink {
  href: string;
  en: string;
  bn: string;
  sub_en: string;
  sub_bn: string;
}

export interface NavItem {
  id: string;
  href: string;
  en: string;
  bn: string;
  dropdown?: NavLink[];
}

/** Menu structure, built from the editable lists in data/site.json (nav = top level, menu = dropdown entries). */
export const NAV: NavItem[] = site.nav.map((item) => {
  const dropdown = site.menu.filter((m) => m.parent === item.id);
  return dropdown.length ? { ...item, dropdown } : { ...item };
});
