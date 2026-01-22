"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";
// ✅ import mutation
import { useJoinAsPartnerMutation } from "@/lib/services/prelaunch/partners";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";

export default function JoinAsPartner() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Field-level error states (inline)
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [joinAsPartner, { isLoading }] = useJoinAsPartnerMutation();

  // --- Handle phone input with validation ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    if (value.length > 10) value = value.slice(0, 10);
    setPhone(value);
    // clear phone error once valid
    if (value.length === 10) setPhoneError("");
    else if (value.length > 0) setPhoneError(""); // keep blank until submit, optional
  };

  // --- Handle email validation on change ---
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // clear inline error as user types (but keep light live validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("");
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // --- Name change handler clears name error while typing ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim().length > 0 && value.trim().length <= 50) setNameError("");
  };

  // --- On submit validation ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset errors
    setNameError("");
    setEmailError("");
    setPhoneError("");

    let hasError = false;

    // name validation
    if (!name.trim()) {
      setNameError("Please enter your name.");
      hasError = true;
    } else if (name.trim().length > 50) {
      setNameError("Name cannot exceed 50 characters.");
      hasError = true;
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      hasError = true;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    // phone validation
    if (!phone) {
      setPhoneError("Please enter your phone number.");
      hasError = true;
    } else if (phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits.");
      hasError = true;
    }

    if (hasError) {
      // do not proceed to API if any inline validation failed
      return;
    }

    try {
      const result = await joinAsPartner({
        organizerName: name.trim(),
        email: email.trim(),
        phone,
        "partnerType": "ORGANIZER",
      }).unwrap();

      showSuccess("🎉 Successfully registered as a partner!");
      console.log("Partner registered:", result);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setNameError("");
      setEmailError("");
      setPhoneError("");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      // Show server/API level error toast, and if the API returns field errors you can map them to inline errors here.
      showApiError(error?.data || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-200 via-pink-200 to-red-200"
      style={{
        backgroundImage: "url(/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <AppHeader showLogo={true} showAvatar={false} />

      <main
        className="mt-2 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-cover bg-center px-4 sm:px-6 lg:px-8 overflow-y-auto"
      >
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Join as Partner
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Expand your reach and connect with travelers worldwide
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {/* Organizer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizer Name
              </label>
              <Input
                type="text"
                placeholder="Enter name"
                className={`rounded-lg ${nameError ? "ring-1 ring-rose-400" : ""}`}
                maxLength={50}
                value={name}
                onChange={handleNameChange}
                aria-invalid={!!nameError}
                aria-describedby="name-error"
              />
              <div className="flex items-center justify-between mt-1">
                <p id="name-error" className="text-xs text-rose-600">
                  {nameError || "\u00A0"}
                </p>
                <p className="text-xs text-right text-gray-400">
                  {name.length}/50 Characters
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter email address"
                className={`rounded-lg ${emailError ? "ring-1 ring-rose-400" : ""}`}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
              <p id="email-error" className="text-xs text-rose-600 mt-1">
                {emailError || "\u00A0"}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone no.
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value="+91"
                  className="w-16 text-center rounded-lg bg-gray-100"
                  readOnly
                  aria-hidden
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit number"
                  className={`flex-1 rounded-lg ${phoneError ? "ring-1 ring-rose-400" : ""}`}
                  aria-invalid={!!phoneError}
                  aria-describedby="phone-error"
                />
              </div>
              <p id="phone-error" className="text-xs text-rose-600 mt-1">
                {phoneError || "\u00A0"}
              </p>
            </div>

            {/* Submit */}
            <GradientButton
              type="submit"
              disabled={isLoading}
              className={` cursor-pointer mt-4 w-full rounded-full text-white py-2 font-medium transition ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                }`}
            >
              {isLoading ? "Submitting..." : "Join as Partner"}
            </GradientButton>
          </form>
        </div>
      </main>
    </div>
  );
}
