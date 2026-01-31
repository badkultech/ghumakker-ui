import { X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TRIP_DETAILS } from "@/lib/constants/strings"

interface LeaderProfileModalProps {
  onClose: () => void
  leader?: {
    name?: string
    bio?: string
    tagline?: string
    imageUrl?: string
    likes?: number
    years?: number
    trips?: number
    travelers?: number
  }
}

export default function LeaderProfileModal({
  onClose,
  leader,
}: LeaderProfileModalProps) {
  const name = leader?.name || TRIP_DETAILS.LEADER_MODAL.DEFAULT_NAME
  const bio =
    leader?.bio ||
    TRIP_DETAILS.LEADER_MODAL.DEFAULT_BIO
  const tagline = leader?.tagline || TRIP_DETAILS.LEADER_MODAL.DEFAULT_TAGLINE

  // Check if leader data is missing or incomplete
  const hasLeaderData = leader?.name || leader?.bio || leader?.imageUrl;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">{hasLeaderData ? name : "Leader Profile"}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {!hasLeaderData ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Leader Not Found</h4>
            <p className="text-sm text-gray-500 mb-6">
              No leader information is available for this trip.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium"
            >
              {TRIP_DETAILS.LEADER_MODAL.CLOSE}
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex gap-4 mb-4">
              <Avatar className="w-16 h-16">
                {leader?.imageUrl && (
                  <AvatarImage
                    src={leader.imageUrl}
                    alt={name}
                  />
                )}

                <AvatarFallback>
                  {name?.[0]}
                </AvatarFallback>
              </Avatar>


              <div>
                <p className="font-bold">{name}</p>

                <p className="text-sm text-gray-500">
                  {tagline}
                </p>

                <p className="text-xs text-gray-400">
                  {TRIP_DETAILS.LEADER_MODAL.LIKES_TEXT} • {leader?.likes || 1947} {TRIP_DETAILS.LEADER_MODAL.LIKES_SUFFIX}
                </p>
              </div>
            </div>

            <h4 className="font-semibold mb-2">{TRIP_DETAILS.LEADER_MODAL.FULL_BIO_TITLE}</h4>

            <p className="text-sm text-gray-600 leading-relaxed">
              {bio}
            </p>

            <button
              onClick={onClose}
              className="w-full mt-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium"
            >
              {TRIP_DETAILS.LEADER_MODAL.CLOSE}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

