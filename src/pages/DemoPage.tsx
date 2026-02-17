import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";

type ContactMethod = "email" | "phone" | "text";

type Submission = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  dob?: string;
  state?: string;
  contactMethod?: ContactMethod;
  topics?: string[];
  message: string;
  agree?: boolean;
  createdAt?: string;
};

const TOPIC_OPTIONS = ["intake", "billing", "tech", "other"] as const;
const STATE_OPTIONS = ["NY", "NJ", "CT", "FL", "CA", "TX", "Other"] as const;

function toDateInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function DemoPage() {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<string>("");
  const [dob, setDob] = useState("");
  const [stateUS, setStateUS] = useState<string>("NY");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [topics, setTopics] = useState<string[]>(["intake"]);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  // UI state
  const [status, setStatus] = useState<string>("");
  const [items, setItems] = useState<Submission[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Filters
  const [filterEmail, setFilterEmail] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterFrom, setFilterFrom] = useState(() =>
    toDateInputValue(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  );
  const [filterTo, setFilterTo] = useState(() => toDateInputValue(new Date()));

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filterEmail.trim()) params.set("email", filterEmail.trim());
    if (filterTopic.trim()) params.set("topic", filterTopic.trim());
    if (filterFrom) params.set("from", filterFrom);
    if (filterTo) params.set("to", filterTo);
    params.set("limit", "20");
    return params.toString();
  }, [filterEmail, filterTopic, filterFrom, filterTo]);

  async function refreshList() {
    setLoadingList(true);
    setStatus("");
    try {
      const res = await fetch(`/api/list?${queryString}`);
      const text = await res.text();

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`API returned non-JSON: ${text.slice(0, 140)}...`);
      }

      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      if (data?.ok) setItems(data.items || []);
    } catch (e: any) {
      setStatus(e?.message || "Failed to load list.");
    } finally {
      setLoadingList(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Submitting...");

    const payload = {
      name,
      email,
      phone,
      age: age ? Number(age) : undefined,
      dob: dob || undefined,
      state: stateUS,
      contactMethod,
      topics,
      message,
      agree,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`API returned non-JSON: ${text.slice(0, 140)}...`);
      }

      if (!res.ok) {
        setStatus(data?.error || "Something went wrong.");
        return;
      }

      setStatus(`Saved! ID: ${data.insertedId}`);

      // reset
      setName("");
      setEmail("");
      setPhone("");
      setAge("");
      setDob("");
      setStateUS("NY");
      setContactMethod("email");
      setTopics(["intake"]);
      setMessage("");
      setAgree(false);

      await refreshList();
    } catch (e: any) {
      setStatus(e?.message || "Submit failed.");
    }
  }

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleTopic(t: string) {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <Layout>
      <section className="py-14">
        <h1 className="text-3xl font-semibold">Live demo</h1>
        <p className="mt-2 max-w-2xl text-gray-300">
          Admin-style intake form → inserts into MongoDB Atlas → list supports basic filters.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* FORM */}
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-gray-900 p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New submission</h2>
              <span className="text-xs text-gray-400">POST /api/submit</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-300">Name *</label>
                <input
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Age</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">DOB</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">State</label>
                <select
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={stateUS}
                  onChange={(e) => setStateUS(e.target.value)}
                >
                  {STATE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Preferred contact method</label>
              <div className="mt-2 flex flex-wrap gap-3">
                {(["email", "phone", "text"] as const).map((m) => (
                  <label
                    key={m}
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 ring-1 ring-gray-700"
                  >
                    <input
                      type="radio"
                      name="contactMethod"
                      value={m}
                      checked={contactMethod === m}
                      onChange={() => setContactMethod(m)}
                    />
                    <span className="text-sm capitalize">{m}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Topics</label>
              <div className="mt-2 flex flex-wrap gap-3">
                {TOPIC_OPTIONS.map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 ring-1 ring-gray-700"
                  >
                    <input type="checkbox" checked={topics.includes(t)} onChange={() => toggleTopic(t)} />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Message *</label>
              <textarea
                className="mt-1 min-h-[96px] w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notes / request..."
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
              I confirm the info is accurate (required)
            </label>

            <button type="submit" className="rounded-lg bg-white px-4 py-2 font-medium text-gray-900 hover:opacity-90">
              Submit
            </button>

            {status && <p className="text-sm text-gray-300">{status}</p>}
          </form>

          {/* LIST */}
          <div className="space-y-4 rounded-2xl bg-gray-900 p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Extract submissions</h2>
              <span className="text-xs text-gray-400">GET /api/list</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-300">Filter by email</label>
                <input
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Filter by topic</label>
                <select
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                >
                  <option value="">(any)</option>
                  {TOPIC_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300">From</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">To</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refreshList}
                className="rounded-lg bg-gray-800 px-3 py-2 text-sm ring-1 ring-gray-700 hover:bg-gray-700"
              >
                {loadingList ? "Loading..." : "Refresh"}
              </button>
              <div className="break-all text-xs text-gray-400">
                Query: <span className="text-gray-300">?{queryString}</span>
              </div>
            </div>

            <div className="mt-2 space-y-3">
              {items.map((it) => (
                <div key={it._id} className="rounded-xl bg-gray-950/40 p-4 ring-1 ring-gray-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="mt-1 text-xs text-gray-400">
                        {it.email ? <span className="mr-2">{it.email}</span> : null}
                        {it.phone ? <span className="mr-2">{it.phone}</span> : null}
                        {it.state ? <span className="mr-2">{it.state}</span> : null}
                        {it.contactMethod ? <span className="mr-2">pref: {it.contactMethod}</span> : null}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{it.createdAt ? new Date(it.createdAt).toLocaleString() : null}</div>
                      <div className="mt-1">{it._id}</div>
                    </div>
                  </div>

                  {it.topics?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {it.topics.map((t) => (
                        <span key={t} className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-300 ring-1 ring-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-2 whitespace-pre-wrap text-gray-200">{it.message}</div>
                </div>
              ))}

              {items.length === 0 && <div className="text-gray-400">No submissions match your filters.</div>}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-gray-400">
          Tip: for production, prefer putting the DB name in your URI (…mongodb.net/<span className="text-gray-200">myapp</span>) and
          remove MONGODB_DB entirely.
        </div>
      </section>
    </Layout>
  );
}
