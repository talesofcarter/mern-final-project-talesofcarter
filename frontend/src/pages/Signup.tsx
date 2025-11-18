import { type JSX, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building,
} from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import api from "../services/api";
import { isAxiosError } from "axios";

interface SignupFormData {
  fullName: string;
  email: string;
  company: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

function Signup(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  const password = useWatch({
    control,
    name: "password",
  });

  const onSubmit = async (data: SignupFormData) => {
    setApiError(null);
    try {
      await api.post("/api/auth/signup", {
        fullName: data.fullName,
        company: data.company,
        email: data.email,
        password: data.password,
      });

      navigate("/login", {
        state: { success: "Account created! Please sign in." },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          setApiError(
            error.response.data?.message ||
              "Registration failed. Please try again."
          );
        } else if (error.request) {
          setApiError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setApiError("An unexpected request configuration error occurred.");
        }
      } else {
        console.error("Non-Axios Signup error:", error);
        setApiError("An unexpected error occurred.");
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

      <div className="relative bg-pine-green w-full max-w-2xl rounded-3xl my-8 animate-fadeInUp">
        <div className="bg-pine-green backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-300 tracking-wide">
                Get Started
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Create Your{" "}
              <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ProQure
              </span>{" "}
              Account
            </h1>
            <p className="text-emerald-100/60 text-sm">
              Start optimizing your procurement today
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-emerald-100/80 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60">
                    <User size={20} />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-emerald-100/80 mb-2"
                >
                  Company
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60">
                    <Building size={20} />
                  </div>
                  <input
                    id="company"
                    type="text"
                    {...register("company", {
                      required: "Company name is required",
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Acme Inc."
                  />
                </div>
                {errors.company && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.company.message}
                  </p>
                )}
              </div>
            </div>

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
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          "Must include uppercase, lowercase, and number",
                      },
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-emerald-400 transition-colors cursor-pointer"
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-emerald-100/80 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60">
                    <Lock size={20} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-emerald-400 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Display API Error Message */}
            {apiError && (
              <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{apiError}</p>
              </div>
            )}

            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("agreeToTerms", {
                    required: "You must agree to the terms and conditions",
                  })}
                  className="mt-1 w-4 h-4 rounded bg-white/5 border border-white/10 text-emerald-500 focus:ring-emerald-500/50 focus:ring-2"
                />
                <span className="text-sm text-emerald-100/60 group-hover:text-emerald-100/80 transition-colors">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="group w-full py-3 px-6 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                    strokeWidth={2.5}
                  />
                </>
              )}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 text-emerald-100/60">
                Or sign up with
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
              Already have an account?{" "}
              <Link to="/login">
                <button className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer">
                  Sign in
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
