import Image from "next/image"

export default function ImageGrid() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 rounded-xl overflow-hidden">
          <Image
            src="/himalayan-village-houses.jpg"
            alt="Trip"
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
