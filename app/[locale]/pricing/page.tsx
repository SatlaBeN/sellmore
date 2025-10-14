
"use client";
import { t, type Locale } from "@/lib/i18n";
import { useState } from "react";

const tiers = [
  { key: "free", titleKey: "pricing_free", descKey: "pricing_free_desc" },
  { key: "mid", titleKey: "pricing_mid", descKey: "pricing_mid_desc" },
  { key: "pro", titleKey: "pricing_pro", descKey: "pricing_pro_desc" }
] as const;

export default function Pricing({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  const [loading, setLoading] = useState<string | null>(null);
  async function subscribe(tier: "free" | "mid" | "pro") {
    setLoading(tier);
    const r = await fetch("/api/whop/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier })
    });
    const { url } = await r.json();
    window.location.href = url;
  }
  return (
    <section className="grid">
      <h2>{t(l, "pricing_title")}</h2>
      <div className="grid grid-3">
        {tiers.map((tConf) => (
          <article key={tConf.key} className="card">
            <h3>{t(l, tConf.titleKey)}</h3>
            <p className="muted">{t(l, tConf.descKey)}</p>
            <button className="btn" onClick={() => subscribe(tConf.key)} disabled={loading === tConf.key}>{t(l, "choose")}</button>
          </article>
        ))}
      </div>
    </section>
  );
}
