import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import OTPPage from "./pages/OTPPage";
import AskAI from "./components/AskAI";

function App() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen text-black overflow-hidden">
      <Router>
        <AskAI />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/otp" element={<OTPPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;