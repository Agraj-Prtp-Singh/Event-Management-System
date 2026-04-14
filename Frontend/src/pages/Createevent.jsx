import { useState } from "react";
import { CalendarDays } from "lucide-react";

export default function CreateEvent() {
  const [openToVendors, setOpenToVendors] = useState(true);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    subCategory: "",
    ticketPrice: "",
  });

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBanner = (e) => {
    const file = e.target.files[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="max-w-3xl mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>

        {/* Event Title */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Event title *
          </label>
          <input
            className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            placeholder="Enter event title"
            value={form.title}
            onChange={handleChange("title")}
          />
        </div>

        {/* Banner Image */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Event banner image
          </label>
          <label className="cursor-pointer block">
            <div className={`w-full bg-white border-2 border-dashed border-black/10 rounded-xl flex items-center justify-center overflow-hidden transition hover:border-blue-400 ${bannerPreview ? "h-44" : "h-28"}`}>
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-400 py-6">
                  <CalendarDays size={28} className="mx-auto mb-1 text-gray-300" />
                  <p className="text-xs">Click to upload banner image</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleBanner} />
          </label>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Start Date *</label>
            <input
              type="datetime-local"
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none shadow-sm"
              value={form.startDate}
              onChange={handleChange("startDate")}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">End Date *</label>
            <input
              type="datetime-local"
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none shadow-sm"
              value={form.endDate}
              onChange={handleChange("endDate")}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Location/Venue *</label>
          <input
            className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none shadow-sm"
            placeholder="Enter venue or address"
            value={form.location}
            onChange={handleChange("location")}
          />
        </div>

        {/* Ticket Price + Open to Vendors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Ticket Price *</label>
            <input
              type="number"
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none shadow-sm"
              placeholder="0.00"
              value={form.ticketPrice}
              onChange={handleChange("ticketPrice")}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Open to vendors?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setOpenToVendors(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${openToVendors ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-500 border-black/10"}`}
              >
                Yes
              </button>
              <button
                onClick={() => setOpenToVendors(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${!openToVendors ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-500 border-black/10"}`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 pb-12">
          <button className="flex-1 py-3 rounded-xl border border-black/10 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm">
            Save as draft
          </button>
          <button className="flex-1 py-3 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition shadow-sm">
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}