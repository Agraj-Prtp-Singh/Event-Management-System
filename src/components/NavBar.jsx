import { ArrowLeft } from "lucide-react";

export default function Navbar() {
  return (
    <div className="bg-[#0b0220] text-gray-300 flex justify-between items-center px-4 py-2 w-full h-16">
      {/* Logo */}
      <div className="">
        <img
          src="/logo.png"
          alt="after-hour-events"
          className="h-24 w-24 sm:h-30 sm:w-30 -ml-3 cursor-pointer"
        />
      </div>

      {/* Back */}
      <button className=" flex items-center text-l px-5 py-3 rounded-full hover:bg-[#19024d] transition-all cursor-pointer">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to home
      </button>
    </div>
  );
}
