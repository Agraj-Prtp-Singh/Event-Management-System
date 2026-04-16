import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  QrCode,
  ChevronRight,
  Loader2,
  XCircle,
} from "lucide-react";
import { getStudentBookings, cancelBooking } from "../api/student";

const FALLBACK_BOOKINGS = [
  {
    id: "BK-2026-001",
    title: "Tech Innovation Summit",
    month: "Mar",
    day: "28",
    time: "10:00 AM",
    location: "Main Hall, Block A",
    status: "Confirmed",
  },
  {
    id: "BK-2026-002",
    title: "Campus Music Fest",
    month: "Apr",
    day: "18",
    time: "6:00 PM",
    location: "Outdoor Stage",
    status: "Confirmed",
  },
  {
    id: "BK-2026-003",
    title: "AI & Future Workshop",
    month: "Apr",
    day: "25",
    time: "2:00 PM",
    location: "Lab 3B",
    status: "Pending",
  },
];

// Normalize booking from backend shape
function normalizeBooking(b) {
  const date = b.eventDate || b.startDate || b.date;
  const d = date ? new Date(date) : null;
  return {
    id: b._id || b.id || b.bookingId,
    title: b.eventTitle || b.title || b.event?.title || "Event",
    month: d
      ? d.toLocaleString("en-US", { month: "short" })
      : b.month || "—",
    day: d ? String(d.getDate()) : b.day || "—",
    time: b.time || (d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"),
    location: b.location || b.event?.location || "—",
    status: b.status || "Pending",
  };
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudentBookings()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.bookings ?? [];
        if (list.length > 0) {
          setBookings(list.map(normalizeBooking));
        } else {
          setBookings(FALLBACK_BOOKINGS);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setBookings(FALLBACK_BOOKINGS);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelingId(bookingId);
    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "Cancelled" } : b
        )
      );
    } catch (err) {
      setError(err.message || "Failed to cancel booking.");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 bg-[#F8FAFC]">
      <div className="w-full max-w-3xl space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          {!loading && (
            <span className="text-xs font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-500">
              {bookings.length} total
            </span>
          )}
        </div>

        {usingFallback && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-2.5">
            Showing sample bookings — connect to the backend to see your real bookings.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm">Loading bookings…</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No bookings yet.</p>
            <button
              onClick={() => navigate("/student/browse")}
              className="mt-4 text-blue-500 text-sm font-medium hover:underline cursor-pointer"
            >
              Browse events
            </button>
          </div>
        ) : (
          /* Booking Cards */
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-black/10 rounded-2xl shadow-sm px-4 md:px-6 py-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    {/* Date block */}
                    <div className="bg-[#0b0220] text-white rounded-xl px-2.5 md:px-3 py-2 text-center shrink-0 min-w-[46px] md:min-w-[52px]">
                      <p className="text-[9px] md:text-[10px] font-medium opacity-60 uppercase">
                        {booking.month}
                      </p>
                      <p className="text-lg md:text-xl font-bold leading-tight">
                        {booking.day}
                      </p>
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm md:text-base truncate">
                        {booking.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{booking.id}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1.5 text-gray-400 text-xs">
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock size={10} /> {booking.time}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={10} /> {booking.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-[10px] md:text-xs font-semibold px-2.5 md:px-3 py-1 rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Cancelled"
                          ? "bg-red-100 text-red-500"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>

                    {booking.status === "Confirmed" && (
                      <button
                        onClick={() => navigate(`/student/event/${booking.id}`)}
                        className="flex items-center gap-1.5 text-blue-500 text-xs font-medium hover:underline cursor-pointer"
                      >
                        <QrCode size={12} />
                        View QR <ChevronRight size={11} />
                      </button>
                    )}

                    {booking.status !== "Cancelled" && !usingFallback && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancelingId === booking.id}
                        className="flex items-center gap-1 text-red-400 text-xs font-medium hover:underline cursor-pointer disabled:opacity-50"
                      >
                        {cancelingId === booking.id ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <XCircle size={11} />
                        )}
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Browse more CTA */}
        <div className="pt-4">
          <button
            onClick={() => navigate("/student/browse")}
            className="border border-black/10 bg-white text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm shadow-sm"
          >
            Browse more events
          </button>
        </div>
      </div>
    </div>
  );
}