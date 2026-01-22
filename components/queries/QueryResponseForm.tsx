"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface QueryResponseFormProps {
  onSend?: (response: string) => void;
  onCancel?: () => void;
}

export default function QueryResponseForm({
  onSend,
  onCancel,
}: QueryResponseFormProps) {
  const [response, setResponse] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!response.trim()) return;

    setSending(true);
    setSuccess(false);

    // simulate an API delay (optional)
    await new Promise((r) => setTimeout(r, 500));

    onSend?.(response);
    setResponse("");
    setSending(false);
    setSuccess(true);

    // hide success message after 2 sec
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="border-t mt-6 pt-6">
      <h4 className="font-semibold text-gray-700 mb-2 text-base">
        What’s your response
      </h4>

      <Textarea
        placeholder="Type your response..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        className="min-h-[120px] mb-4 text-sm"
      />

      <div className="flex gap-3 items-center">
        <Button
          onClick={handleSend}
          disabled={sending}
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center px-5"
        >
          {sending ? "Sending..." : "Send Response"}
        </Button>

        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        {success && (
          <p className="text-sm text-green-600 ml-3">Response sent!</p>
        )}
      </div>
    </div>
  );
}
