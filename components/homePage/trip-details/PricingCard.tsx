import { Bike, Home, Send, MessageCircle } from "lucide-react"

export default function PricingCard({ onPricing, onAsk }: any) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <p className="text-3xl font-bold">₹12,999</p>
      <p className="text-xs text-gray-500 mb-4">per person</p>

      <button onClick={onPricing} className="w-full border p-3 rounded-lg mb-4">
        Select Options
      </button>

      <button
        onClick={onAsk}
        className="w-full border-2 border-orange-500 text-orange-500 p-3 rounded-lg"
      >
        <MessageCircle className="inline w-4 h-4 mr-2" />
        Send Query
      </button>
    </div>
  )
}
