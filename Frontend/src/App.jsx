import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OTPPage from "./pages/OTPPage";
import LandingPage from "./pages/LandingPage";
import AdminSidebar from "./components/AdminSidebar";
import StudentSidebar from "./components/StudentSidebar";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminEvents from "./pages/Admin.jsx";
import Footer from "./components/Footer";

import StudentDashboard from "./pages/Studentdashboard";
import BrowseStudentEvents from "./pages/BrowseStudentEvents";
import StudentBookings from "./pages/StudentBookings";
import StudentEventDetail from "./pages/StudentEventDetail";

// Admin layout uses AdminSidebar
function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-black">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

// Student layout uses StudentSidebar
function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-black">
      <StudentSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OTPPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <AdminDashboardPage />
          </AdminLayout>
        }
      />
      <Route
  path="/admin/events"
  element={<AdminEvents />}
/>

      {/* Student Routes — now use StudentLayout with StudentSidebar */}
      <Route
        path="/student-dashboard"
        element={
          <StudentLayout>
            <StudentDashboard />
          </StudentLayout>
        }
      />
      <Route
        path="/student/browse"
        element={
          <StudentLayout>
            <BrowseStudentEvents />
          </StudentLayout>
        }
      />
      <Route
        path="/student/bookings"
        element={
          <StudentLayout>
            <StudentBookings />
          </StudentLayout>
        }
      />
      <Route
        path="/student/event/:id"
        element={
          <StudentLayout>
            <StudentEventDetail />
          </StudentLayout>
        }
      />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/student" element={<Navigate to="/student-dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;