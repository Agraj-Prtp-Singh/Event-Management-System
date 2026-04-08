import React, { useState } from "react";
import { Pencil, Users, CheckCircle, Trash2, Save } from "lucide-react";

export default function AdminEventCards() {
  // Sample Data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "AI Event",
      details: "Mon Mar 30 2026 Kathmandu 37 spots left",
      verified: true,
    },
    {
      id: 2,
      title: "Tech Meetup",
      details: "Fri Apr 10 2026 Lalitpur 20 spots left",
      verified: false,
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", details: "" });

  // Delete Event
  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  // Start Editing
  const handleEdit = (event) => {
    setEditingId(event.id);
    setEditData({ title: event.title, details: event.details });
  };

  // Save Edit
  const handleSave = (id) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, ...editData } : event,
      ),
    );
    setEditingId(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Events</h1>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <span className="text-lg font-semibold">+</span>
          Create Event
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="group flex items-center justify-between bg-white/30 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-4 shadow-lg border border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Left Section */}
            <div className="flex items-center gap-3 sm:gap-4 w-full">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>

              <div className="w-full">
                {editingId === event.id ? (
                  <>
                    <input
                      className="w-full mb-1 px-2 py-1 rounded border text-sm"
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                    <input
                      className="w-full px-2 py-1 rounded border text-xs"
                      value={editData.details}
                      onChange={(e) =>
                        setEditData({ ...editData, details: e.target.value })
                      }
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                        {event.title}
                      </h2>

                      {event.verified && (
                        <CheckCircle className="text-green-500 w-5 h-5" />
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {event.details}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-5 text-gray-700">
              {editingId === event.id ? (
                <button
                  onClick={() => handleSave(event.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Save size={20} />
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(event)}
                  className="hover:text-black"
                >
                  <Pencil size={20} />
                </button>
              )}

              <button className="hover:text-black">
                <Users size={20} />
              </button>

              <button
                onClick={() => handleDelete(event.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
