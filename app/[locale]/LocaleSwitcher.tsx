
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname || "/";
  const locales = ["en","he","ru","ar"];
  const options = useMemo(() => locales.map(l => ({ l, label: l.toUpperCase() })), []);
  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length === 0) { router.push(`/${next}`); return; }
    if (locales.includes(parts[0])) { parts[0] = next; } else { parts.unshift(next); }
    router.push("/" + parts.join("/"));
  }
  return (
    <select value={locale} onChange={onChange} aria-label="Language">
      {options.map(o => (<option key={o.l} value={o.l}>{o.label}</option>))}
    </select>
  );
}
