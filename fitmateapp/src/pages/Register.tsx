import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import type { RegisterRequest } from "../api-generated";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    userName: "",
    fullName: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.userName || !formData.password) {
      setError("Email, Username, and Password are required.");
      return;
    }

    try {
      await register(formData);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat();
        setError(messages.join(" "));
      } else {
        setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create your FitMate account
        </h2>

        {error && (
          <div
            className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              className="w-full p-3 bg-zinc-900 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName || ""}
              onChange={handleChange}
              required
              className="w-full p-3 bg-zinc-900 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Full Name (Optional)
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-900 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              required
              className="w-full p-3 bg-zinc-900 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-200"
        >
          Create Account
        </button>

        <div className="text-center mt-6">
          <p className="text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-500 hover:text-green-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
