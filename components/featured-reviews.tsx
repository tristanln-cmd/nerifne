import Image from "next/image"
import { Star } from "lucide-react"

const featured = [
  {
    name: "Peyton",
    title: "Founder @ bunni.lol",
    avatar: "/images/a_38dc6b8a7a07da08a6d8113e886af5ae.gif",
    content:
      "He is a very good staff member and communicates well with the team. He is extremely quick to respond and has an amazing level of professionalism. Customer support has never been better than this.",
  },
  {
    name: "Heatblast",
    title: "Moderator @ v3rmillion",
    avatar: "/images/heatblast-pfp.png",
    content:
      "I know this dude personally, amazing amazing person known him about 5 years probs or so, he&apos;s never let me down or betrayed me and always has a positive service, keep up the good work nerfine i been watching you build your legacy for years -HB",
  },
  {
    name: "Astra",
    title: "Community Manager",
    avatar: "/images/astra.png",
    content: "Nerfine managerz W\nW guy no jokes, best 😭",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-emerald-400 text-emerald-400" : "fill-muted text-muted"}`}
          aria-hidden
        />
      ))}
    </div>
  )
}

export function FeaturedReviews() {
  return (
    <div className="flex flex-col gap-4">
      {featured.map((review) => (
        <div key={review.name} className="flex flex-col rounded-lg border-2 border-emerald-500/30 bg-card p-5">
          <div className="mb-3 flex items-center gap-3">
            <Image
              src={review.avatar}
              alt={review.name}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground">{review.name}</div>
              <div className="truncate text-xs text-muted-foreground">{review.title}</div>
            </div>
            <StarRating rating={5} />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{review.content}</p>
        </div>
      ))}
    </div>
  )
}
