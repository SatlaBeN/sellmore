
"use client";
import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

type MarketProduct = { id: string; title: string; description: string; priceCents: number; whopSkuSlug?: string };

export default function Market({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  const [items, setItems] = useState<MarketProduct[]>([]);

  async function load() {
    const r = await fetch("/api/market/list");
    const j = await r.json();
    setItems(j.items as MarketProduct[]);
  }
  useEffect(() => { void load(); }, []);

  async function buy(p: MarketProduct) {
    const r = await fetch("/api/whop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: p.id })
    });
    const j = await r.json();
    window.location.href = j.url as string;
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>{t(l, "market_title")}</h2>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <div style={{ display: "grid", gap: 6 }}>
              <b>{p.title}</b>
              <small>{p.description}</small>
              <span>{p.priceCents / 100} {t(l, "price_currency")}</span>
              <button onClick={() => { void buy(p); }}>{t(l, "buy")}</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
