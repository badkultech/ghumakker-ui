import { X } from "lucide-react"

export default function BaseModal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between p-4 border-b">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
