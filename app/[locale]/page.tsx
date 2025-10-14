
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

export default function Home({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  return (
    <section className="grid">
      <div className="card">
        <h1>{t(l, "app_title")}</h1>
        <p className="muted">{t(l, "home_intro")}</p>
        <ul className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
          <li><Link className="btn" href={`/${l}/dashboard`}>{t(l, "nav_dashboard")}</Link></li>
          <li><Link className="btn" href={`/${l}/pricing`}>{t(l, "nav_pricing")}</Link></li>
          <li><Link className="btn" href={`/${l}/market`}>{t(l, "nav_market")}</Link></li>
        </ul>
      </div>
    </section>
  );
}
