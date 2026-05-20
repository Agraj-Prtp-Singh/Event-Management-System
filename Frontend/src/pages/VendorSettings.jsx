import AccountSettings from "../components/AccountSettings";

export default function VendorSettings() {
  return (
    <AccountSettings
      settingsStorageKey="vendorSettings"
      fallbackName="Vendor User"
      dashboardName="vendor"
    />
  );
}
