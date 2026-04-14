import { useState } from "react";
import { Search, Download } from "lucide-react";

const stats = [
  { value: "124", label: "Registered" },
  { value: "150", label: "Capacity" },
  { value: "83%", label: "Fill rate" },
  { value: "26", label: "Remaining" },
];

const allAttendees = [
  { name: "Deepshikha", email: "deep@gmail.com", booked: "March 2", status: "Confirmed" },
  { name: "Rajan Shrestha", email: "rajan@gmail.com", booked: "March 5", status: "Confirmed" },
  { name: "Anita Karki", email: "anita@gmail.com", booked: "March 8", status: "Pending" },
  { name: "Bikram Thapa", email: "bikram@gmail.com", booked: "March 10", status: "Confirmed" },
  { name: "Sita Rai", email: "sita@gmail.com", booked: "March 12", status: "Cancelled" },
];

const statusColors = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-500",
};

export default function Attendees() {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = allAttendees.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );
  
  const displayed = showAll ? filtered : filtered.slice(0, 3);

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Booked", "Status"];
    const rows = allAttendees.map((a) => [a.name, a.email, a.booked, a.status]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendees.csv";
    a.click();
  };

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
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
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              placeholder="Search Attendees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-white border border-black/10 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition cursor-pointer whitespace-nowrap"
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

          {displayed.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-12">No attendees found.</div>
          ) : (
            displayed.map((a, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center px-6 py-4 border-b border-black/5 last:border-b-0 hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 text-sm truncate">{a.name}</span>
                <span className="text-xs text-gray-500 truncate">{a.email}</span>
                <span className="text-xs text-gray-500 text-center">{a.booked}</span>
                <div className="flex justify-center">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[a.status] || ""}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show More Button */}
        {filtered.length > 3 && (
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