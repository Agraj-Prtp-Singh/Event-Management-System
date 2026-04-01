import { useRef, useState } from "react";

export default function OTPCard() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    console.log("OTP:", code);

    if (code.length < 6) {
      alert("Enter full OTP");
      return;
    }

    // TODO: send to backend
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border text-center">
      <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>

      <p className="text-sm text-gray-500 mb-6">
        We sent a 6 digit code to{" "}
        <span className="text-blue-500">demo@gmail.com</span>
      </p>

      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center rounded-xl bg-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Verify code
      </button>

      <button className="w-full mt-3 bg-gray-200 py-2 rounded-lg text-sm hover:bg-gray-300">
        Didn’t receive the OTP? Resend code
      </button>

      <p className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline">
        Wrong email? Go back
      </p>
    </div>
  );
}
