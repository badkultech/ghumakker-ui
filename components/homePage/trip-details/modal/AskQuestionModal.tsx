"use client";

import { X, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import { useCreatePublicTripQueryMutation } from "@/lib/services/organizer/trip/queries";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { toast } from "@/hooks/use-toast";
import { useGetTravelerProfileQuery } from "@/lib/services/user";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useOrganizationId } from "@/hooks/useOrganizationId";


export default function AskQuestionModal({
  onClose,
  tripPublicId,
  tripName,
  duration,
  price,
  dates,
}: {
  onClose: () => void;
  tripPublicId: string;
  tripName?: string;
  duration?: string;
  price?: string;
  dates?: string;
}) {
  const { isLoggedIn, userData } = useAuthActions();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    query: "",
  });

  const organizationId = useOrganizationId();

  const [createQuery, { isLoading }] =
    useCreatePublicTripQueryMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { data: travelerProfile } = useGetTravelerProfileQuery(
    {
      organizationId: organizationId,
      userPublicId: userData?.userPublicId!,
    },
    {
      skip: !isLoggedIn || !userData?.userPublicId,
    }
  );

  useEffect(() => {
    if (!travelerProfile) return;

    setForm((prev) => ({
      ...prev,
      name:
        [travelerProfile.firstName, travelerProfile.lastName]
          .filter(Boolean)
          .join(" ") || prev.name,
      email: travelerProfile.email || prev.email,
      phone: travelerProfile.mobileNumber || prev.phone,
    }));
  }, [travelerProfile]);


  const handleSubmit = async () => {
    if (!form.query.trim()) return;

    try {
      await createQuery({
        tripPublicId,
        question: form.query,
        category: form.category.toUpperCase(),
      }).unwrap();
      toast({
        title: "Success",
        description: "Query submitted successfully",
        variant: "default",
      });

      onClose();
    } catch (err) {
      console.error("Failed to submit query", err);
      toast({
        title: "Error",
        description: "Failed to submit query",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col  ">

        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            Send Query to Organizer
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="overflow-y-auto no-scrollbar">
          {/* INFO BANNER */}
          <div className="mx-6 mt-4 flex gap-2 items-start bg-blue-50  text-sm p-3 rounded-lg ">
            <Info className="w-4 h-4 mt-0.5 text-blue-700" />
            <p>
              <span className="font-medium text-blue-700">Quick Response Guaranteed</span>
              <br />
              Our team typically responds within 2–4 hours during business hours
              (9 AM – 9 PM IST)
            </p>
          </div>

          {/* FORM */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name *</label>
              <Input
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address *</label>
              <Input
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <Input
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            {/* CATEGORY */}
            <div>
              <label className="text-sm font-medium">Query Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-2.5"
              >
                <option value="">Select a category</option>
                <option value="pricing">Pricing</option>
                <option value="itinerary">Itinerary</option>
                <option value="stay">Stay & Accommodation</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* QUERY */}
            <div>
              <label className="text-sm font-medium">Your Query *</label>
              <RichTextEditor
                value={form.query}
                onChange={(value: string) =>
                  setForm((prev) => ({
                    ...prev,
                    query: value,
                  }))
                }
                placeholder="Please describe your query in detail..."
              />
            </div>

            {/* TRIP DETAILS */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="font-semibold mb-2">Trip Details</p>

              <div className="flex justify-between text-gray-600">
                <span>Trip Name:</span>
                <span className="font-medium text-black">{tripName}</span>
              </div>

              <div className="flex justify-between text-gray-600 mt-1">
                <span>Duration:</span>
                <span className="font-medium text-black">{duration}</span>
              </div>

              <div className="flex justify-between text-gray-600 mt-1">
                <span>Dates:</span>
                <span className="font-medium text-black">{dates}</span>
              </div>

              <div className="flex justify-between text-gray-600 mt-1">
                <span>Price:</span>
                <span className="font-medium text-black">{price}</span>
              </div>
            </div>

            {/* FOOTER BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !form.query.trim()}
              className="w-full mt-2 bg-orange-500 text-white py-3 rounded-xl font-medium disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Query"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
