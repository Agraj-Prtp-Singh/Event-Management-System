import AccountSettings from "../components/AccountSettings";

export default function StudentSettings() {
  return (
    <AccountSettings
      settingsStorageKey="studentSettings"
      passwordStorageKey="studentPassword"
      fallbackName="Student User"
      dashboardName="student"
    />
  );
}
