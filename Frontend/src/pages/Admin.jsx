import AdminDashboard from "../components/AdminDashboardCard";
import AdminSidebar from "../components/AdminSidebar";
import Footer from "../components/Footer";

const Admin = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7FB]">
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AdminDashboard />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
