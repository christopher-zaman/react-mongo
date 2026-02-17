import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 shadow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.25),transparent_45%)]" />
          <div className="relative">
            <p className="text-sm text-gray-300">Portfolio • Full-stack starter</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              I build clean React apps and reliable data workflows.
            </h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              This site includes a live MongoDB demo (form → API → Atlas) plus a
              portfolio layout you can keep expanding.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:opacity-90"
              >
                Try the demo
              </Link>
              <Link
                to="/projects"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                See projects
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-xs text-gray-300">
              {["TypeScript", "Tailwind", "MongoDB Atlas", "Vercel Functions"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick sections */}
      <section className="py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Full-stack demo",
              desc: "MongoDB Atlas CRUD with filterable list.",
              to: "/demo",
              cta: "Open demo",
            },
            {
              title: "Projects",
              desc: "Cards + tags you can customize.",
              to: "/projects",
              cta: "View projects",
            },
            {
              title: "Contact",
              desc: "Simple contact section + links.",
              to: "/contact",
              cta: "Get in touch",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
            >
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{c.desc}</p>
              <Link
                to={c.to}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100"
              >
                {c.cta} <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
