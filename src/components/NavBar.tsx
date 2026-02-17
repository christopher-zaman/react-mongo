import { Link, NavLink } from "react-router-dom";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "text-sm hover:text-white",
          isActive ? "text-white" : "text-gray-300",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <span className="text-sm font-semibold">CZ</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Christopher Zaman</div>
            <div className="text-xs text-gray-400">React • MongoDB • Vercel</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 sm:flex">
          <NavItem to="/" label="Home" />
          <NavItem to="/projects" label="Projects" />
          <NavItem to="/demo" label="Live Demo" />
          <NavItem to="/contact" label="Contact" />
        </nav>

        <Link
          to="/demo"
          className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:opacity-90"
        >
          View demo
        </Link>
      </div>
    </header>
  );
}
