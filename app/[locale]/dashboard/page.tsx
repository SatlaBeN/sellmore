
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

export default function Dashboard({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  return (
    <section className="grid">
      <div className="card">
        <h2>{t(l, "dashboard_title")}</h2>
        <ul className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
          <li><Link className="btn" href={`/${l}/vendor/products`}>{t(l, "vendor_title")}</Link></li>
          <li><Link className="btn" href={`/${l}/pricing`}>{t(l, "nav_pricing")}</Link></li>
          <li><Link className="btn" href={`/${l}/market`}>{t(l, "nav_market")}</Link></li>
        </ul>
      </div>
    </section>
  );
}
