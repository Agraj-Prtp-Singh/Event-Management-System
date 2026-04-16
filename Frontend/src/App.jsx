import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import OTPPage from "./pages/OTPPage";
import LandingPage from "./pages/LandingPage";
import AdminSidebar from "./components/AdminSidebar";
import StudentSidebar from "./components/StudentSidebar";
import PlannerSidebar from "./components/PlannerSidebar";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminEvents from "./pages/Admin.jsx";
import Footer from "./components/Footer";
import Login from "./pages/LoginPage";
import AskAI from "./components/AskAI";

import StudentDashboard from "./pages/Studentdashboard";
import BrowseStudentEvents from "./pages/BrowseStudentEvents";
import StudentBookings from "./pages/StudentBookings";
import StudentEventDetail from "./pages/StudentEventDetail";

import VendorDashboard from "./pages/Plannerdashboard";
import CreateEvent from "./pages/Createevent";
import Attendees from "./pages/Attendees";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-black">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function PlannerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-black">
      <PlannerSidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
      <AskAI />
    </div>
  );
}

function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-black">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
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
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={<AdminLayout><AdminDashboardPage /></AdminLayout>}
      />
      <Route
        path="/admin/events"
        element={<AdminLayout><AdminEvents /></AdminLayout>}
      />

      {/* Student Routes */}
      <Route
        path="/student-dashboard"
        element={<StudentLayout><StudentDashboard /></StudentLayout>}
      />
      <Route
        path="/student/browse"
        element={<StudentLayout><BrowseStudentEvents /></StudentLayout>}
      />
      <Route
        path="/student/bookings"
        element={<StudentLayout><StudentBookings /></StudentLayout>}
      />
      <Route
        path="/student/event/:id"
        element={<StudentLayout><StudentEventDetail /></StudentLayout>}
      />

      {/* Planner Routes - Standardized to /planner */}
      <Route
        path="/planner/dashboard"
        element={<PlannerLayout><VendorDashboard /></PlannerLayout>}
      />
      <Route
        path="/planner/events"
        element={<PlannerLayout><CreateEvent /></PlannerLayout>}
      />
      <Route
        path="/planner/attendees"
        element={<PlannerLayout><Attendees /></PlannerLayout>}
      />

      {/* Redirects */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/student" element={<Navigate to="/student-dashboard" replace />} />
      <Route path="/vendor" element={<Navigate to="/planner/dashboard" replace />} />
      <Route path="/planner" element={<Navigate to="/planner/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;