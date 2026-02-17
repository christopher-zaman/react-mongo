import type { PropsWithChildren } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[-120px] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl sm:h-[420px] sm:w-[420px]" />
      <div className="absolute right-[-120px] top-[260px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl sm:right-[-140px] sm:h-[520px] sm:w-[520px]" />
    </div>

            </div>


      <NavBar />

      <main className="mx-auto max-w-6xl px-6">{children}</main>

      <Footer />
    </div>
  );
}
