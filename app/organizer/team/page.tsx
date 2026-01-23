"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Circle } from "lucide-react";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

export default function TeamMembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: "Rahul Sharma", email: "rahul@ghumakker.in", role: "Owner", status: "Active" },
    { id: 2, name: "Rahul Sharma", email: "rahul@ghumakker.in", role: "Editor", status: "Active" },
    { id: 3, name: "Rahul Sharma", email: "rahul@ghumakker.in", role: "Admin", status: "Active" },
    { id: 4, name: "Rahul Sharma", email: "rahul@ghumakker.in", role: "Viewer", status: "Active" },
  ]);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");

  const handleInvite = () => {
    if (!email.trim()) return;
    const newMember: TeamMember = {
      id: Date.now(),
      name: email.split("@")[0].replace(".", " "),
      email,
      role,
      status: "Active",
    };
    setMembers([...members, newMember]);
    setEmail("");
  };

  const handleDelete = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Team Members" onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Team Members</h1>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-md">
              <Plus className="w-4 h-4" /> Add Team Member
            </Button>
          </div>

          {/* Invite New Member */}
          <Card className="border rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Invite New Member</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-3">
              <Input
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={role} onValueChange={(v) => setRole(v)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                onClick={handleInvite}
              >
                Send Invite
              </Button>
            </CardContent>
            <p className="text-sm text-gray-500 px-6 pb-4">
              An invitation link will be sent to the email address
            </p>
          </Card>

          {/* Team Members List */}
          <Card className="border rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-none pb-3 gap-2"
                >
                  {/* Left - avatar and info */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>

                  {/* Right - role and actions */}
                  <div className="flex items-center gap-3">
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        setMembers((prev) =>
                          prev.map((m) =>
                            m.id === member.id ? { ...m, role: value } : m
                          )
                        )
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Circle className="w-2 h-2 fill-green-600" /> {member.status}
                    </div>

                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card className="border border-primary/20 bg-primary/5 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Role Permissions</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-y-2 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Admin:</span> Full access except team management
              </p>
              <p>
                <span className="font-semibold">Editor:</span> Create and edit trips, view leads/queries
              </p>
              <p>
                <span className="font-semibold">Viewer:</span> View-only access to all content
              </p>
              <p>
                <span className="font-semibold">Owner:</span> Complete control including billing
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
