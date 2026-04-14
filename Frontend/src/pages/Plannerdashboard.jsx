import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";

const stats = [
  { value: "8", label: "Events" },
  { value: "312", label: "Attendees" },
  { value: "87%", label: "Fill rate" },
  { value: "3.2K", label: "Revenue" },
];

const events = [
  {
    name: "AI Event",
    location: "Kathmandu",
    spots: "37 spots left",
    date: "Mon Mar 30 2026",
    status: "Pending",
  },
];

export default function VendorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="max-w-5xl mx-auto space-y-7">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            // Fixed navigation to match App.jsx route
            onClick={() => navigate("/planner/events")}
            className="flex items-center gap-2 bg-white border-2 border-gray-900 rounded-full px-5 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Plus size={16} /> Create Event
          </button>
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

        {/* My Events Table */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">My Events</h2>
          <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-3 text-xs text-gray-400 font-medium border-b border-black/10 bg-gray-50">
              <span>Event name</span>
              <span className="text-center">Date</span>
              <span className="text-center">Status</span>
            </div>
            {events.map((ev, i) => (
              <div
                key={i}
                className="grid grid-cols-3 items-center px-6 py-4 border-b border-black/5 last:border-b-0 hover:bg-gray-50 transition"
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{ev.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{ev.location} • {ev.spots}</div>
                </div>
                <div className="text-center text-xs text-gray-500">{ev.date}</div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-3 py-1 font-medium">
                    {ev.status}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition cursor-pointer">
                      <Pencil size={13} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vendors section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Vendors</h2>
          <div className="bg-white border border-black/10 rounded-2xl shadow-sm p-8 text-center text-gray-400 text-sm">
            No vendors assigned yet.
          </div>
        </section>
      </div>
    </div>
  );
}