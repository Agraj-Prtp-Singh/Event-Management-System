import AccountSettings from "../components/AccountSettings";

export default function AdminSettings() {
  return (
    <AccountSettings
      settingsStorageKey="adminSettings"
      fallbackName="Admin User"
      dashboardName="admin"
    />
  );
}
