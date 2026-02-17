import { useState } from "react";
import Layout from "../components/Layout";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "youremail@example.com"; // change this

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <Layout>
      <section className="py-14">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-2 max-w-2xl text-gray-300">
          Add your real links here. The “Email” button opens a mail draft; the
          copy button helps on mobile/desktop.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold">Links</h2>

            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                <div className="text-xs text-gray-400">Email</div>
                <div className="mt-1 font-medium text-gray-100">{email}</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:opacity-90"
                    href={`mailto:${email}`}
                  >
                    Email me
                  </a>
                  <button
                    onClick={copyEmail}
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                    type="button"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <a
                className="block rounded-2xl bg-black/20 p-4 ring-1 ring-white/10 hover:bg-white/5"
                href="#"
              >
                <div className="text-xs text-gray-400">LinkedIn</div>
                <div className="mt-1 font-medium text-gray-100">
                  Add your LinkedIn URL
                </div>
              </a>

              <a
                className="block rounded-2xl bg-black/20 p-4 ring-1 ring-white/10 hover:bg-white/5"
                href="#"
              >
                <div className="text-xs text-gray-400">GitHub</div>
                <div className="mt-1 font-medium text-gray-100">
                  Add your GitHub URL
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold">Quick note</h2>
            <p className="mt-2 text-sm text-gray-300">
              This is just a frontend form (not wired). If you want, we can wire
              it to MongoDB too, or send via email service.
            </p>

            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300">Name</label>
                <input
                  className="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Message</label>
                <textarea
                  className="mt-1 min-h-[120px] w-full rounded-lg bg-gray-900 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  placeholder="Write a quick message..."
                />
              </div>

              <button
                type="button"
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:opacity-90"
              >
                Send (not wired)
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
