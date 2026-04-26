import { useEffect, useMemo, useState } from "react";
import AdminEventsHero from "./AdminEventsHero";
import AdminEventsStats from "./AdminEventsStats";
import AdminEventEditCard from "./AdminEventEditCard";
import {
  deleteAdminEvent,
  getAdminEvents,
  updateAdminEvent,
} from "../api/admin";

const emptyEditState = {
  title: "",
  startDate: "",
  location: "",
  category: "",
  capacity: "",
};

const formatDisplayDate = (value) => {
  if (!value) {
    return "Date not set";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const normalized = new Date(date.getTime() - offset * 60000);
  return normalized.toISOString().slice(0, 16);
};

const normalizeEvent = (event) => ({
  id: event._id || event.id,
  title: event.title || "Untitled Event",
  startDate: event.startDate || "",
  date: formatDisplayDate(event.startDate),
  location: event.location || "Location not set",
  category: event.category || "General",
  capacity: String(event.capacity ?? 0),
  created: formatDisplayDate(event.createdAt),
  raw: event,
});

export default function AdminEventCards() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    setError("");

    getAdminEvents({ limit: 100 })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setEvents(list.map(normalizeEvent));
      })
      .catch((err) => {
        setError(err.message || "Failed to load events.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const now = Date.now();
  const upcomingEvents = useMemo(
    () =>
      events.filter(
        (event) => event.startDate && new Date(event.startDate).getTime() >= now
      ).length,
    [events, now]
  );
  const pastEvents = useMemo(
    () =>
      events.filter(
        (event) => event.startDate && new Date(event.startDate).getTime() < now
      ).length,
    [events, now]
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await deleteAdminEvent(id);
      setEvents((currentEvents) => currentEvents.filter((event) => event.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setEditForm(emptyEditState);
      }
    } catch (err) {
      setError(err.message || "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStart = (event) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      startDate: formatDateTimeLocal(event.startDate),
      location: event.location,
      category: event.category,
      capacity: event.capacity,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm(emptyEditState);
  };

  const handleFieldChange = (field, value) => {
    setEditForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSave = async (id) => {
    setSaving(true);
    setError("");

    try {
      const updated = await updateAdminEvent(id, {
        title: editForm.title,
        startDate: editForm.startDate || undefined,
        location: editForm.location,
        category: editForm.category || undefined,
        capacity: editForm.capacity ? Number(editForm.capacity) : 0,
      });

      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === id ? normalizeEvent(updated) : event
        )
      );
      setEditingId(null);
      setEditForm(emptyEditState);
    } catch (err) {
      setError(err.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { label: "Total Events", value: events.length },
    { label: "Upcoming Events", value: upcomingEvents },
    { label: "Past Events", value: pastEvents },
  ];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminEventsHero />
        <AdminEventsStats cards={statCards} />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-[2rem] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="mb-6 flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Database Events
              </h2>
              <p className="text-sm text-slate-500">
                Review and edit live events stored in the backend.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {loading ? "Loading..." : `${events.length} managed events`}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-400">
              No events found in the database.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const isEditing = editingId === event.id;

                return (
                  <div
                    key={event.id}
                    className={deletingId === event.id || saving ? "opacity-70" : ""}
                  >
                    <AdminEventEditCard
                      event={event}
                      isEditing={isEditing}
                      editForm={editForm}
                      onEditStart={() => handleEditStart(event)}
                      onEditCancel={handleEditCancel}
                      onFieldChange={handleFieldChange}
                      onSave={() => handleSave(event.id)}
                      onDelete={() => handleDelete(event.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
