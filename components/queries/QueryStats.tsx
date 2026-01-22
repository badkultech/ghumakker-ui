import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function QueryStats({ queries = [] }: { queries: any[] }) {

  // Compute statistics based on backend statuses
  const total = queries.length;
  const open = queries.filter((q) => String(q.status) === "OPEN").length;
  const responded = queries.filter((q) => String(q.status) === "RESPONDED").length;

  const stats = [
    { label: "Total Queries", value: total },
    { label: "Open Queries", value: open },
    { label: "Responded", value: responded },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="shadow-sm border rounded-xl bg-white hover:shadow-md transition"
        >
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <MessageSquare className="w-5 h-5 text-[#F97316]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
