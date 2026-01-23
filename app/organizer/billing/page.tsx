"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";

export default function BillingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "₹999",
      period: "per month",
      features: [
        "Up to 25 trips",
        "Up to 5 team members",
        "Basic Analytics",
        "Email Support",
        "5GB Support",
      ],
    },
    {
      name: "Professional",
      price: "₹2,499",
      period: "per month",
      features: [
        "Up to 100 trips",
        "Up to 15 team members",
        "Advanced Analytics",
        "Priority Support",
        "50GB Support",
        "Custom Branding",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "₹4,999",
      period: "per month",
      features: [
        "Up to Unlimited trips",
        "Up to Unlimited team members",
        "Premium Analytics",
        "24/7 Support",
        "500GB Support",
        "White Label",
        "API Access",
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Billing" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Header */}
          <h1 className="text-2xl font-semibold">Subscription & Billing</h1>

          {/* Trial Card */}
          <div className="bg-primary text-primary-foreground p-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Free Trial Active</h2>
              <p className="text-sm text-primary-foreground/90">
                Your free trial will end in 14 days
              </p>
              <div className="mt-3 w-full sm:w-72">
                <Progress value={70} className="bg-white/20" />
              </div>
            </div>
            <Button className="bg-white text-primary hover:bg-gray-100 mt-4 sm:mt-0">
              Upgrade Now
            </Button>
          </div>

          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Free Trial</h3>
                  <p className="text-sm text-gray-600">
                    Expires on November 8, 2025
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 font-medium px-3 py-1"
                >
                  Active
                </Badge>
              </div>

              <div className="flex items-center gap-8 mt-5 text-sm text-gray-700">
                <div>
                  <p className="font-medium">Trips Created</p>
                  <p>8/10</p>
                </div>
                <div>
                  <p className="font-medium">Team Members</p>
                  <p>2/3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`rounded-xl ${plan.highlight
                  ? "border-2 border-primary shadow-md"
                  : "border border-gray-200"
                  }`}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {plan.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </p>
                    <p className="text-sm text-gray-500">{plan.period}</p>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary font-bold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-2 ${plan.highlight
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center text-sm text-gray-600 py-8">
              <div className="text-4xl mb-2">🧾</div>
              <p className="font-medium">No billing history available</p>
              <p className="text-gray-500 mt-1">
                You’re currently on a free trial
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
