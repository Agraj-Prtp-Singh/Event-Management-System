import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import OTPCard from "../components/OTPCard";

export default function OTPPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md">
          <OTPCard />
        </div>
      </div>

      <Footer />
    </div>
  );
}
