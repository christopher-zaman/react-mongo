import { useEffect, useState } from "react";

type Submission = {
  _id: string;
  name: string;
  message: string;
  createdAt?: string;
};

export default function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string>("");
  const [items, setItems] = useState<Submission[]>([]);

  async function refreshList() {
    const res = await fetch("/api/list");
    const data = await res.json();
    if (data?.ok) setItems(data.items);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data?.error || "Something went wrong.");
      return;
    }

    setStatus(`Saved! ID: ${data.insertedId}`);
    setName("");
    setMessage("");
    await refreshList();
  }

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold">MongoDB + Vercel API Starter</h1>
        <p className="mt-2 text-gray-300">
          Submit a message → it gets inserted into MongoDB Atlas → list shows latest 20.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-gray-900 p-6 shadow">
          <div>
            <label className="block text-sm text-gray-300">Name</label>
            <input
              className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Christopher"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Message</label>
            <input
              className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-gray-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hello MongoDB 👋"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-white px-4 py-2 font-medium text-gray-900 hover:opacity-90"
          >
            Submit
          </button>

          {status && <p className="text-sm text-gray-300">{status}</p>}
        </form>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest submissions</h2>
            <button
              onClick={refreshList}
              className="rounded-lg bg-gray-800 px-3 py-2 text-sm ring-1 ring-gray-700 hover:bg-gray-700"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {items.map((it) => (
              <div key={it._id} className="rounded-xl bg-gray-900 p-4 ring-1 ring-gray-800">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-400">{it._id}</div>
                </div>
                <div className="mt-1 text-gray-300">{it.message}</div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-gray-400">No submissions yet. Add one above.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
