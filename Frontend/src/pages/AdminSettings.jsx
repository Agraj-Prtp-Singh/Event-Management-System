import AccountSettings from "../components/AccountSettings";
import AdminCategoryManager from "../components/AdminCategoryManager";

export default function AdminSettings() {
  return (
    <div className="w-full bg-[#F4F7FB] pb-12">
      <AccountSettings
        settingsStorageKey="adminSettings"
        fallbackName="Admin User"
        dashboardName="admin"
        hideLogout
      />

      <div className="w-full bg-[#F4F7FB] px-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <AdminCategoryManager />
        </div>
      </div>
    </div>
  );
}