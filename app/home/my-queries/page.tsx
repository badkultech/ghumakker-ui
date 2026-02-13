"use client"

import { useState, useEffect } from "react"
import {
    ChevronDown,
    ChevronUp,
    MessageCircleQuestion,
    CheckCircle,
    Clock,
    MessageSquare,
    Flag,
    X,
    ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GradientCheckbox from "@/components/ui/GradientCheckbox"
import { MainHeader } from "@/components/search-results/MainHeader"
import { notificationsData, userMenuItems } from "../constants";
import { SidebarMenu } from "@/components/search-results/SidebarMenu"
import { useAuthActions } from "@/hooks/useAuthActions";
import { useOrganizationId } from "@/hooks/useOrganizationId"
import { useUserId } from "@/hooks/useUserId"
import { useGetUserQueriesQuery } from "@/lib/services/user"
import { useDisplayedUser } from "@/hooks/useDisplayedUser"
import { AuthModals } from "@/components/auth/auth/AuthModals"
import { Overlay } from "@/components/common/Overlay"
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop"
import ConversationModal from "@/components/modals/ConversationModal"

type QuestionStatus = "responded" | "pending"

interface Question {
    id: string
    tripPublicId: string
    tripName: string
    question: string
    status: QuestionStatus
    category?: string | null
    askedDate: string
    response?: {
        author: string
        respondedDate: string
        text: string
    }
    warningMessage?: string
}


export default function MyQueriesPage() {
    const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])
    const [showAskModal, setShowAskModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [reportingQuestionId, setReportingQuestionId] = useState<string | null>(null)
    const [newQuestion, setNewQuestion] = useState("")
    const [reportReasons, setReportReasons] = useState<string[]>([])
    const [reportDetails, setReportDetails] = useState("")
    const { isLoggedIn, handleLogout, router } = useAuthActions();

    useEffect(() => {
        if (!isLoggedIn) {
            setAuthStep("PHONE");
        }
    }, [isLoggedIn]);
    const [notifications, setNotifications] = useState(notificationsData);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const [searchTab, setSearchTab] =
        useState<"destination" | "moods">("destination");
    const [showConversationModal, setShowConversationModal] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState<Question | null>(null);

    const onLogout = () => {
        handleLogout(() => setSidebarOpen(false));
    };

    const organizationId = useOrganizationId();
    const userPublicId = useUserId();

    const user = useDisplayedUser();





    const {
        data: queries,
        isLoading,
        error,
    } = useGetUserQueriesQuery(
        { organizationId, userPublicId },
        {
            skip: !organizationId || !userPublicId,
            pollingInterval: 30000,
            skipPollingIfUnfocused: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    const mappedQuestions: Question[] =
        queries?.map((q) => {
            // Get the last response from the responses array
            const lastResponse = q.responses && q.responses.length > 0
                ? q.responses[q.responses.length - 1]
                : null;

            return {
                id: String(q.id),
                tripPublicId: q.tripPublicId,
                tripName: q.tripName,
                question: q.question,
                status: q.status === "RESPONDED" ? "responded" : "pending",
                category: q.category,
                askedDate: new Date(q.createdDate).toLocaleDateString("en-GB"),
                response: lastResponse
                    ? {
                        author: lastResponse.userName,
                        respondedDate: new Date(
                            lastResponse.createdDate
                        ).toLocaleDateString("en-GB"),
                        text: lastResponse.comment,
                    }
                    : undefined,
                warningMessage:
                    q.status !== "RESPONDED"
                        ? "Our team will get back to you soon!"
                        : undefined,
            };
        }) ?? [];


    const totalQueries = mappedQuestions?.length ?? 0;
    const respondedQueries =
        mappedQuestions?.filter((q) => q.status === "responded").length ?? 0;
    const pendingQueries =
        mappedQuestions?.filter((q) => q.status === "pending").length ?? 0;

    const toggleQuestion = (id: string) => {
        setExpandedQuestions((prev) => (prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]))
    }

    const handleReport = (questionId: string) => {
        setReportingQuestionId(questionId)
        setShowReportModal(true)
    }

    const handleSubmitReport = () => {
        console.log("Report submitted:", {
            questionId: reportingQuestionId,
            reasons: reportReasons,
            details: reportDetails,
        })
        setShowReportModal(false)
        setReportReasons([])
        setReportDetails("")
        setReportingQuestionId(null)
    }

    const reportOptions = [
        "Spam or irrelevant content",
        "Inappropriate or offensive language",
        "Misleading or false information",
        "Invalid contact information",
        "Other (please specify below)",
    ]

    const toggleReportReason = (reason: string) => {
        setReportReasons((prev) => (prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]))
    }


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading your queries...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Failed to load queries
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-white w-full">
                {/* Header */}
                <MainHeader logoText="My Queries" isLoggedIn={isLoggedIn}
                    notifications={notifications}
                    onUpdateNotifications={setNotifications}
                    onMenuOpen={() => setSidebarOpen(true)}
                    onLoginClick={() => setAuthStep("PHONE")}
                    variant="edge"
                />

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-bold">My Queries</h2>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-[#E4E4E4] rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="text-gray-600">
                                    <MessageSquare className="h-5 w-5 text-[#000000]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Queries</p>
                                    <p className="text-2xl font-bold">{totalQueries.toString().padStart(2, "0")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#E4E4E4]  rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="text-gray-600">
                                    <CheckCircle className="h-5 w-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Responded</p>
                                    <p className="text-2xl font-bold">{respondedQueries.toString().padStart(2, "0")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#E4E4E4]  rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="text-gray-600">
                                    <Clock className="h-5 w-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold">{pendingQueries.toString().padStart(2, "0")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions List */}
                    {mappedQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <MessageCircleQuestion className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Queries Yet</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                You haven't asked any questions yet. When you have questions about trips, they will appear here.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-4">Your Questions</h3>
                            </div>

                            <div className="space-y-4">
                                {mappedQuestions.map((question) => (
                                    <div key={question.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        {/* Question Header */}
                                        <button
                                            onClick={() => toggleQuestion(question.id)}
                                            className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`text-xs font-medium px-2 py-1 rounded ${question.status === "responded"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                            }`}
                                                    >
                                                        {question.status === "responded" ? "Responded" : "Pending"}
                                                    </span>
                                                    <span className="text-xs text-gray-500">Asked on {question.askedDate}</span>
                                                </div>
                                                <h4 className="font-medium text-gray-900">{question.question}</h4>
                                            </div>
                                            {expandedQuestions.includes(question.id) ? (
                                                <ChevronUp className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                                            )}
                                        </button>

                                        {/* Question Details */}
                                        {expandedQuestions.includes(question.id) && (
                                            <div className=" p-4 bg-white">
                                                {question.response ? (
                                                    <div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                                R
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <div>
                                                                        <span className="font-medium text-gray-900">{question.response.author}</span>
                                                                        <span className="text-sm text-gray-500 ml-2">
                                                                            Responded on {question.response.respondedDate}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setSelectedQuery(question);
                                                                                setShowConversationModal(true);
                                                                            }}
                                                                            className="text-orange-600 bg-orange-50 hover:text-orange-700 hover:bg-orange-100"
                                                                        >
                                                                            <MessageSquare className="h-4 w-4 mr-1" />
                                                                            View
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleReport(question.id)}
                                                                            className="text-red-600 bg-[#FFEEEE] hover:text-[#FE336A] hover:cursor-pointer hover:bg-red-50"
                                                                        >
                                                                            <Flag className="h-4 w-4 mr-1" />
                                                                            Report
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-700 bg-[#E4E4E4] rounded-lg p-3 border border-gray-200">
                                                                    {question.response.text}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                                                        <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-yellow-900">Awaiting response</span>
                                                            <span className="text-yellow-700"> - {question.warningMessage}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>

                {/* Conversation Modal */}
                <ConversationModal
                    isOpen={showConversationModal}
                    onClose={() => setShowConversationModal(false)}
                    selectedQuery={selectedQuery}
                />

                {/* Confirm Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Confirm Report</h3>
                                <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Select all reasons that apply for reporting this query. This will help our team take appropriate action.
                            </p>

                            <div className="space-y-3 mb-6">
                                {reportOptions.map((option) => (
                                    <div
                                        key={option}
                                        className={`
                                                flex items-start gap-3 p-3 rounded-lg transition
                                                hover:bg-gray-50 hover:border-[#FF804C]
                                                ${reportReasons.includes(option)
                                                ? " border border-[#FF804C]"   // selected state
                                                : " border border-gray-200"
                                            }
                                                `}
                                    >
                                        <GradientCheckbox
                                            id={option}
                                            checked={reportReasons.includes(option)}
                                            onChange={() => toggleReportReason(option)}
                                        />

                                        <label
                                            htmlFor={option}
                                            className="text-sm text-gray-700 cursor-pointer flex-1"
                                        >
                                            {option}
                                        </label>
                                    </div>

                                ))}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional details (optional):</label>
                                <Textarea
                                    value={reportDetails}
                                    onChange={(e) => setReportDetails(e.target.value)}
                                    placeholder="Please provide more details about why you're reporting this query."
                                    className="min-h-[100px]"
                                    maxLength={500}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">{reportDetails.length}/500 Words</div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowReportModal(false)}
                                    className=" flex-1  border border-[#E4E4E4]  text-[#6B6B6B]  bg-white hover:bg-[#F7F7F7] rounded-lg font-medium transition"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitReport}
                                    className="flex-1 bg-orange-500  hover:bg-orange-600  text-white rounded-lg font-medium transition "
                                >
                                    Yes, Report
                                </Button>

                            </div>

                        </div>
                    </div>
                )}
            </div>
            <SidebarMenu
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                userMenuItems={userMenuItems}
                onLogout={onLogout}
                isLoggedIn={isLoggedIn}
                user={user}
            />
            <Overlay open={showSearchOverlay} onClose={() => setShowSearchOverlay(false)}>
                <SearchTripsCard defaultTab={searchTab}
                    onClose={() => setShowSearchOverlay(false)} />
            </Overlay>
            <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
        </>
    )
}
