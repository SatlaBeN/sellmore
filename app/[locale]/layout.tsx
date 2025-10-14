
import { rtlLocales, type Locale } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import Link from "next/link";

export default function LocaleLayout({ params, children }: { params: { locale: Locale }; children: React.ReactNode }) {
  const lang = params.locale;
  const dir = rtlLocales.includes(lang) ? "rtl" : "ltr";
  return (
    <html lang={lang} dir={dir}>
      <head />
      <body className="app-body">
        <div className="app-shell">
          <header className="app-header">
            <div className="brand">SellMore</div>
            <nav className="app-nav">
              <Link href={`/${lang}/dashboard`} className="nav-link">Dashboard</Link>
              <Link href={`/${lang}/pricing`} className="nav-link">Plans</Link>
              <Link href={`/${lang}/market`} className="nav-link">Marketplace</Link>
            </nav>
            <LocaleSwitcher locale={lang} />
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">© {new Date().getFullYear()} SellMore</footer>
        </div>
        <style jsx global>{`
          :root{--blue-1:#e6f0ff;--blue-2:#bfdbfe;--blue-3:#93c5fd;--blue-4:#60a5fa;--blue-5:#3b82f6;--blue-6:#2563eb;--text:#0b1220;--muted:#59708a;--white:#ffffff}
          html,body,#__next, .app-body{height:100%}
          body{margin:0;font-family:Inter,Assistant,system-ui,sans-serif;color:var(--text);background:linear-gradient(135deg,var(--white) 0%, var(--blue-1) 35%, var(--blue-2) 100%)}
          .app-shell{min-height:100%;display:flex;flex-direction:column}
          .app-header{display:flex;align-items:center;gap:16px;justify-content:space-between;backdrop-filter:saturate(180%) blur(8px);position:sticky;top:0;border-bottom:1px solid rgba(0,0,0,.05);background:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.6));padding:12px 20px}
          .brand{font-weight:800;letter-spacing:.2px;font-size:18px;background:linear-gradient(90deg,var(--blue-6),var(--blue-4));-webkit-background-clip:text;background-clip:text;color:transparent}
          .app-nav{display:flex;gap:12px}
          .nav-link{padding:8px 12px;border-radius:10px;text-decoration:none;color:#0b1220;border:1px solid transparent}
          .nav-link:hover{border-color:rgba(37,99,235,.25);background:rgba(59,130,246,.06)}
          .app-main{flex:1;display:grid;place-items:start;gap:24px;padding:32px;max-width:1100px;margin:0 auto;width:100%}
          .app-footer{padding:24px;color:var(--muted);font-size:14px}
          .card{background:radial-gradient(1200px 400px at 100% -200px, rgba(59,130,246,.15), transparent),linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.85));border:1px solid rgba(59,130,246,.25);box-shadow:0 10px 30px rgba(37,99,235,.12);border-radius:18px;padding:20px}
          .grid{display:grid;gap:16px}
          .grid-3{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
          .btn{appearance:none;border:0;border-radius:14px;padding:10px 14px;font-weight:600;cursor:pointer;transition:transform .05s ease, box-shadow .2s ease;box-shadow:0 6px 18px rgba(37,99,235,.25);background:linear-gradient(135deg,var(--blue-5),var(--blue-6));color:var(--white)}
          .btn:disabled{opacity:.6;cursor:not-allowed;box-shadow:none}
          .btn:active{transform:translateY(1px)}
          .muted{color:var(--muted)}
          input,textarea,select{border:1px solid rgba(15,23,42,.1);border-radius:12px;padding:10px 12px;background:rgba(255,255,255,.95);width:100%}
          ul{padding:0;margin:0;list-style:none}
        `}</style>
      </body>
    </html>
  );
}
