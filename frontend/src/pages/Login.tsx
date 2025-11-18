import { type JSX, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import api from "../services/api";
import { isAxiosError } from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

function Login(): JSX.Element {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await api.post("/api/auth/login", data);

      if (response.data.success && response.data.token) {
        login(response.data.token);
        navigate("/ai");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        let message = "An unknown error occurred.";
        if (error instanceof Error) {
          message = error.message;
        }
        setError(message);
      }
    }
  };

  return (
    <div className="relative bg-[#3b5b5c] min-h-screen w-full overflow-hidden flex items-center justify-center p-4 py-40">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative w-full max-w-md h-screen flex items-center justify-center animate-fadeInUp">
        <div className="bg-pine-green backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-300 tracking-wide">
                Welcome Back
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Login to{" "}
              <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ProQure
              </span>
            </h1>
            <p className="text-emerald-100/60 text-sm">
              Access your procurement dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-emerald-100/80 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-emerald-100/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Show API Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/5 border border-white/10 text-emerald-500 focus:ring-emerald-500/50 focus:ring-2"
                />
                <span className="text-sm text-emerald-100/60 group-hover:text-emerald-100/80 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full py-3 px-6 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
              {!isSubmitting && (
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 text-emerald-100/60">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
              <FaGoogle className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
              <FaGithub className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-emerald-100/60">
              Don't have an account?{" "}
              <Link to="/signup">
                <button className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer">
                  Sign up
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
