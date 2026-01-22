"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSetupPasswordMutation } from "@/lib/services/setup-password";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAuthState, setCredentials } from "@/lib/slices/auth";
import { getDashboardPath } from "@/lib/utils";
import { showApiError } from "@/lib/utils/toastHelpers";
import { AppHeader } from "@/components/app-header";
import { jwtDecode } from "jwt-decode";
import { AuthTokenPayload } from "@/hooks/useDecodedToken";
import { GradientButton } from "@/components/gradient-button";

export default function AdminRegister() {
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";
  const tokenFromParams = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [setupPassword] = useSetupPasswordMutation();
  const { userData } = useSelector(selectAuthState);
  const [showInstructions, setShowInstructions] = useState(false);

  // populate email from query params
  useEffect(() => {
    if (emailFromParams) setEmail(emailFromParams);
  }, [emailFromParams]);

  // password rules
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$]/.test(password),
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    emailValid &&
    Object.values(rules).every(Boolean) &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload

    if (!isFormValid) return;

    try {
      setIsLoading(true);

      // call setup password mutation
      const result = await setupPassword({
        token: tokenFromParams,
        password,
      }).unwrap();

      console.log("raw mutation result:", result);

      // save tokens in localStorage & redux
      if (result.accessToken && result.refreshToken) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);

        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );
        // decode immediately instead of waiting for Redux
        const decodedData = jwtDecode<AuthTokenPayload>(result.accessToken);

        // redirect based on role
        const dashboardPath = getDashboardPath(decodedData?.userType);
        router.replace(dashboardPath);
      }
    } catch (err) {
      console.error("mutation failed:", err);
      // Use your custom toast for backend error messages
      showApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      {/* Header */}
      <AppHeader showAvatar={false} showLogo={true} />

      {/* Background */}
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center pt-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Register as Admin
          </h1>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Enter Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="w-full bg-gray-100 cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
            {email.length > 0 && !emailValid && (
              <p className="text-[#FF804C] text-sm mt-1">
                Enter valid email address
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowInstructions(true)}
                onBlur={() => setShowInstructions(false)}
                maxLength={20}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {showInstructions && <p className="text-[#FF804C] text-sm mt-1">For a strong password, includes:</p>}
            {/* Password Strength */}
            {showInstructions && (
              <div className="mt-4 space-y-1">
                <div className="flex items-center text-sm">
                  {rules.length ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600">8+ characters</span>
                </div>
                <div className="flex items-center text-sm">
                  {rules.uppercase ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600">1 uppercase letter</span>
                </div>
                <div className="flex items-center text-sm">
                  {rules.number ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600">1 number</span>
                </div>
                <div className="flex items-center text-sm">
                  {rules.special ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600">1 special symbol (!@#$)</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-[#FF804C] text-sm mt-1">
                Password didn't match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <GradientButton type="submit" disabled={!isFormValid || isLoading}>
            Create Admin Account
          </GradientButton>
        </form>
      </div>
    </div>
  );
}
