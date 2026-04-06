import { Bell, CircleUserRound } from "lucide-react";

// Dummy dynamic data
const events = [
  {
    id: 1,
    category: "Tech",
    title: "Tech Summit 2026",
    date: "March 28",
    location: "Kathmandu",
    color: "bg-blue-100 text-blue-600",
    buttonColor: "bg-blue-200",
  },
  {
    id: 2,
    category: "Design",
    title: "Design Workshop",
    date: "April 23",
    location: "Kathmandu",
    color: "bg-green-100 text-green-600",
    buttonColor: "bg-green-200",
  },
  {
    id: 3,
    category: "Business",
    title: "Startup Night",
    date: "April 18",
    location: "Lalitpur",
    color: "bg-yellow-100 text-yellow-700",
    buttonColor: "bg-yellow-200",
  },
];

function EventCard({ event }) {
  return (
    <div className="w-72 rounded-3xl shadow-md bg-white overflow-hidden transition hover:scale-105">
      {/* Top image */}
      <div className="h-36 bg-black rounded-b-3xl"></div>

      <div className="p-4 space-y-2">
        <span className={`px-3 py-1 text-sm rounded-full ${event.color}`}>
          {event.category}
        </span>

        <h2 className="font-semibold text-lg">{event.title}</h2>

        <p className="text-sm text-gray-600">
          {event.date} • {event.location}
        </p>

        <button
          className={`mt-2 px-4 py-1 rounded-full text-sm ${event.buttonColor}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="flex min-h-full flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-[2rem] bg-white px-8 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Events
        </h1>

        <div className="flex items-center gap-4 self-start rounded-2xl bg-slate-50 px-4 py-3 sm:self-auto">
          <button
            type="button"
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            aria-label="Notifications"
          >
          </button>

          <div className="h-10 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            <CircleUserRound size={32} className="text-slate-600" />
            <div className="leading-tight">
              <p className="text-lg font-semibold text-slate-900">
                Aragon Sama
              </p>
              <p className="text-sm text-slate-500">Admin User</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-8">
        <div className="flex flex-wrap gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
