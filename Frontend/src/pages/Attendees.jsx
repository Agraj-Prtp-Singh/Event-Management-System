import { useState, useEffect } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import { getAllAttendees, getPlannerStats } from "../api/planner";

const FALLBACK_STATS = [
  { value: "—", label: "Registered" },
  { value: "—", label: "Capacity" },
  { value: "—", label: "Fill rate" },
  { value: "—", label: "Remaining" },
];

const statusColors = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-500",
};

export default function Attendees() {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [allAttendees, setAllAttendees] = useState([]);
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loadingAttendees, setLoadingAttendees] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch attendees
    getAllAttendees()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.attendees ?? [];
        setAllAttendees(list);
      })
      .catch(() => {
        setError("Could not load attendees from server.");
      })
      .finally(() => setLoadingAttendees(false));

    // Fetch stats for the summary row
    getPlannerStats()
      .then((data) => {
        const registered = data.totalAttendees ?? 0;
        const capacity = data.totalCapacity ?? 0;
        const remaining = capacity - registered;
        const fillRate = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;
        setStats([
          { value: String(registered), label: "Registered" },
          { value: String(capacity), label: "Capacity" },
          { value: `${fillRate}%`, label: "Fill rate" },
          { value: String(Math.max(remaining, 0)), label: "Remaining" },
        ]);
      })
      .catch(() => {
        // silently keep fallback stats
      })
      .finally(() => setLoadingStats(false));
  }, []);

  const filtered = allAttendees.filter(
    (a) =>
      (a.name || a.fullName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const displayed = showAll ? filtered : filtered.slice(0, 3);

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Booked", "Status"];
    const rows = allAttendees.map((a) => [
      a.name || a.fullName || "",
      a.email || "",
      a.booked || a.createdAt || "",
      a.status || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendees.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-black/10 rounded-2xl shadow-sm flex flex-col items-center py-6 px-3"
                >
                  <div className="h-8 w-12 rounded-md bg-slate-100 animate-pulse mb-2" />
                  <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
                </div>
              ))
            : stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-black/10 rounded-2xl shadow-sm flex flex-col items-center py-6 px-3"
                >
                  <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                  <span className="text-xs text-gray-500 mt-1">{s.label}</span>
                </div>
              ))}
        </div>

        {/* Search + Export */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              placeholder="Search Attendees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportCSV}
            disabled={allAttendees.length === 0}
            className="flex items-center justify-center gap-2 bg-white border border-black/10 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 px-6 py-3 text-xs text-gray-400 font-medium border-b border-black/10 bg-gray-50">
            <span>Name</span>
            <span>Email</span>
            <span className="text-center">Booked</span>
            <span className="text-center">Status</span>
          </div>

          {loadingAttendees ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading attendees…</span>
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-12">
              {search ? `No attendees found matching "${search}"` : "No attendees yet."}
            </div>
          ) : (
            displayed.map((a, i) => (
              <div
                key={a._id || a.id || i}
                className="grid grid-cols-4 items-center px-6 py-4 border-b border-black/5 last:border-b-0 hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 text-sm truncate">
                  {a.name || a.fullName || "—"}
                </span>
                <span className="text-xs text-gray-500 truncate">{a.email || "—"}</span>
                <span className="text-xs text-gray-500 text-center">
                  {a.booked
                    ? a.booked
                    : a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : "—"}
                </span>
                <div className="flex justify-center">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      statusColors[a.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {a.status || "—"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show More */}
        {!loadingAttendees && filtered.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-sm text-blue-500 font-medium hover:underline cursor-pointer"
            >
              {showAll ? "Show less" : `More… (${filtered.length - 3} more)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}