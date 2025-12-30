import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSubscribe from "@/hooks/useSubscribe";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { requestNotificationPermission, subscribe } = useSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        { identifier, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        await requestNotificationPermission();
        if (Notification.permission === "granted") {
          await subscribe();
        } else {
          console.error("Notification permission denied. Cannot subscribe.");
        }
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email/Username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-[#4285f4] hover:bg-[#3367d6] text-white font-normal py-2.5 px-4 rounded-md focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;