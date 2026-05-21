import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Loader2, LogOut, Plus, Search, Trash2, X } from "lucide-react";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "../api/admin";
import { clearAuthSession } from "../utils/auth";

const initialForm = {
  name: "",
  description: "",
  color: "#4f46e5",
  isActive: true,
  sortOrder: 0,
};

function getCategoryId(category) {
  return category?._id || category?.id;
}

export default function AdminCategoryManager() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1,
  });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(editingId);

  const activeCount = useMemo(
    () => categories.filter((category) => category.isActive).length,
    [categories]
  );

  const inactiveCount = useMemo(
    () => categories.filter((category) => !category.isActive).length,
    [categories]
  );

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const params = { limit: 50 };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (activeFilter !== "all") {
        params.isActive = activeFilter === "active";
      }

      const result = await getAdminCategories(params);

      setCategories(result.items || []);
      setPagination(
        result.pagination || {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (loadError) {
      setError(loadError.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const handleEdit = (category) => {
    setEditingId(getCategoryId(category));
    setForm({
      name: category.name || "",
      description: category.description || "",
      color: category.color || "#4f46e5",
      isActive: Boolean(category.isActive),
      sortOrder: category.sortOrder || 0,
    });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        color: form.color,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (isEditing) {
        await updateAdminCategory(editingId, payload);
        setMessage("Category updated successfully.");
      } else {
        await createAdminCategory(payload);
        setMessage("Category created successfully.");
      }

      resetForm();
      await loadCategories();
    } catch (saveError) {
      setError(saveError.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const categoryId = getCategoryId(category);
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(categoryId);
      setMessage("");
      setError("");

      await deleteAdminCategory(categoryId);

      if (editingId === categoryId) {
        resetForm();
      }

      setMessage("Category deleted successfully.");
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    loadCategories();
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/", { replace: true });
  };

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="inline-flex rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#4E7BFF]">
            Category Settings
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Manage Event Categories
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Create, update, activate, deactivate, and delete categories used for
            organizing events.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="font-bold text-slate-900">
              {pagination.total || categories.length}
            </p>
            <p className="text-xs text-slate-500">Total</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-4 py-3">
            <p className="font-bold text-emerald-700">{activeCount}</p>
            <p className="text-xs text-emerald-700/70">Active</p>
          </div>

          <div className="rounded-2xl bg-rose-50 px-4 py-3">
            <p className="font-bold text-rose-700">{inactiveCount}</p>
            <p className="text-xs text-rose-700/70">Inactive</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.5rem] bg-slate-50 p-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Technology"
              className="input"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </span>
            <input
              type="text"
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              placeholder="Events related to technology"
              className="input"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Color
            </span>
            <input
              type="color"
              value={form.color}
              onChange={(event) => handleChange("color", event.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Order
            </span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => handleChange("sortOrder", event.target.value)}
              className="input"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  handleChange("isActive", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Active
            </label>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-700 transition hover:bg-slate-100"
                title="Cancel edit"
              >
                <X size={18} />
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4E7BFF] px-5 text-sm font-semibold text-white transition hover:bg-[#3D69EA] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      {(message || error) && (
        <div
          className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
            error
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2"
        >
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories"
            className="w-full bg-transparent text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>

        <select
          value={activeFilter}
          onChange={(event) => setActiveFilter(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
        >
          <option value="all">All categories</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[1.5rem] border border-slate-100">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Loading categories...
                  </span>
                </td>
              </tr>
            ) : categories.length ? (
              categories.map((category) => {
                const categoryId = getCategoryId(category);

                return (
                  <tr key={categoryId} className="border-t border-slate-100">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full border border-slate-200"
                          style={{
                            backgroundColor: category.color || "#4f46e5",
                          }}
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {category.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            /{category.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-500">
                      {category.description || "No description"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {category.sortOrder || 0}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                          title={`Edit ${category.name}`}
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === categoryId}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                          title={`Delete ${category.name}`}
                        >
                          {deletingId === categoryId ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <p className="mb-3 text-sm text-slate-500">
          End your session on this device when you are done.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </section>
  );
}