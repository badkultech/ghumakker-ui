"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import QueryResponseForm from "./QueryResponseForm";
import {
  useGetTripQueryCommentsQuery,
  useCreateTripQueryCommentMutation,
} from "@/lib/services/organizer/trip/queries";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useEffect, useRef } from "react";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
export default function QueryDetail({
  query,
  loggedInUserId,
  onBack,
  onReport,
}: any) {
  const organizationId = useOrganizationId();
  const { data: comments = [], isLoading } = useGetTripQueryCommentsQuery({
    organizationId: organizationId,
    tripPublicId: query.tripPublicId,
    queryId: query.id,
  });

  const [createComment] = useCreateTripQueryCommentMutation();

  const handleSendResponse = async (text: string) => {
    await createComment({
      organizationId: organizationId,
      tripPublicId: query.tripPublicId,
      queryId: query.id,
      comment: text,
    });
  };

  // Sort comments by date
  const sortedComments = [...comments].sort(
    (a, b) =>
      new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
  );

  // First message is the query question itself
  const initialMessage = {
    id: "question",
    comment: query.question,
    createdDate: query.createdDate,
    userId: query.askedByUserId, // or null
  };
  const fullChat = [initialMessage, ...sortedComments];
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedComments]);

  const formatDateDivider = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday =
      date.toDateString() === today.toDateString();

    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const needsDivider = (current: string, previous?: string) => {
    if (!previous) return true;

    const d1 = new Date(current).toDateString();
    const d2 = new Date(previous).toDateString();
    return d1 !== d2;
  };



  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="p-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Queries
        </Button>
      </div>

      {/* Chat UI */}
      <div className="bg-white rounded-2xl p-6 border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">{query.name}</h3>
            <p className="text-sm text-gray-500">Trip: {query.tripName}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-sm px-3 py-1 rounded-full ${comments.some((c) => c.userId === loggedInUserId)
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {comments.some((c) => c.userId === loggedInUserId)
                ? "Responded"
                : "Open"}
            </span>

            <span className="text-sm text-gray-400">{query.date}</span>

            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={onReport}
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[260px] overflow-y-auto pr-2 pb-4 border-t border-b border-gray-100">
          {isLoading ? (
            <p className="text-center text-sm mt-4 text-gray-400">Loading...</p>
          ) : (
            <div className="flex flex-col gap-5 mt-5">
              {/* First message: original question */}
              <div className="flex flex-col items-start w-full">
                {/* Date divider for the question */}
                <div className="text-center text-xs text-gray-400 my-2">
                  {formatDateDivider(query.createdDate)}
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[75%] px-4 py-3 rounded-2xl shadow-sm bg-gray-100 text-gray-800 rounded-tl-none">
                    {query.question && (
                      <div
                        className="text-sm leading-relaxed text-gray-700 break-words"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(query.question),
                        }}
                      />
                    )}
                    <p className="text-[11px] mt-1 text-gray-400">
                      {new Date(query.createdDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actual comments */}
              {sortedComments.map((msg, index) => {
                const isMine = msg.userId === loggedInUserId;

                const prev = sortedComments[index - 1]?.createdDate;
                const showDivider = needsDivider(msg.createdDate, prev);

                return (
                  <div key={msg.id} className="flex flex-col w-full">
                    {showDivider && (
                      <div className="text-center text-xs text-gray-400 my-2">
                        {formatDateDivider(msg.createdDate)}
                      </div>
                    )}

                    <div
                      className={`flex ${isMine ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${isMine
                          ? "bg-blue-50 text-gray-800 rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                          }`}
                      >
                        <div
                          className="text-sm leading-relaxed text-gray-700 break-words"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(msg.comment),
                          }}
                        />
                        <p
                          className={`text-[11px] mt-1 ${isMine
                            ? "text-right text-blue-400"
                            : "text-gray-400"
                            }`}
                        >
                          {new Date(msg.createdDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Auto scroll anchor */}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Response Box */}
        <div className="mt-6">
          <QueryResponseForm onSend={handleSendResponse} onCancel={onBack} />
        </div>
      </div>
    </div>
  );
}
