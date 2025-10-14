
"use client";
import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

type Product = { id: string; title: string; description: string; priceCents: number; active: boolean };

export default function VendorProducts({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  const [items, setItems] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(9900);

  async function load() {
    const r = await fetch("/api/vendor/products/list");
    const j = await r.json();
    setItems(j.items as Product[]);
  }
  useEffect(() => { void load(); }, []);

  async function add() {
    const r = await fetch("/api/vendor/products/create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priceCents: price })
    });
    if (r.ok) { setTitle(""); setDescription(""); setPrice(9900); void load(); }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>{t(l, "vendor_title")}</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <input placeholder={t(l, "vendor_title")} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <button onClick={add}>{t(l, "add")}</button>
      </div>
      <hr />
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            {p.title} | {p.priceCents / 100} {t(l, "price_currency")}
          </li>
        ))}
      </ul>
    </main>
  );
}
