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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">{name}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
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

          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mt-6">
            <Stat value={`${leader?.years || "12+"}`} label={TRIP_DETAILS.LEADER_MODAL.YEARS_EXP} />
            <Stat value={`${leader?.trips || "300+"}`} label={TRIP_DETAILS.LEADER_MODAL.TRIPS_ORG} />
            <Stat value={`${leader?.travelers || "1947"}`} label={TRIP_DETAILS.LEADER_MODAL.HAPPY_TRAVELERS} />
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium"
          >
            {TRIP_DETAILS.LEADER_MODAL.CLOSE}
          </button>
        </div>

      </div>
    </div>
  )
}

const Stat = ({ value, label }: any) => (
  <div className="text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
)
