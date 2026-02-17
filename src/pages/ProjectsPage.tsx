import Layout from "../components/Layout";

const PROJECTS = [
  {
    title: "React + Mongo Starter",
    desc: "Form → API → MongoDB Atlas with a filterable submissions list.",
    tags: ["React", "TypeScript", "MongoDB", "Vercel"],
    link: "/demo",
    linkLabel: "View live demo",
  },
  {
    title: "Reporting & Dashboards",
    desc: "KPI reporting and automation across analytics workflows.",
    tags: ["SQL", "Power BI", "Excel"],
    link: "/contact",
    linkLabel: "Ask about this",
  },
  {
    title: "Client Websites",
    desc: "SEO-focused sites with clean UX and performance improvements.",
    tags: ["SEO", "GA4", "Web"],
    link: "/contact",
    linkLabel: "Work together",
  },
];

export default function ProjectsPage() {
  return (
    <Layout>
      <section className="py-14">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="mt-2 max-w-2xl text-gray-300">
          A few highlights. Swap these out with your real projects and links.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <span className="text-gray-400">↗</span>
              </div>

              <p className="mt-2 text-sm text-gray-300">{p.desc}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-200"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <a
                href={p.link}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100"
              >
                {p.linkLabel} <span aria-hidden>→</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
