import AccountSettings from "../components/AccountSettings";

export default function PlannerSettings() {
  return (
    <AccountSettings
      settingsStorageKey="plannerSettings"
      passwordStorageKey="plannerPassword"
      fallbackName="Event Planner"
      dashboardName="planner"
    />
  );
}
