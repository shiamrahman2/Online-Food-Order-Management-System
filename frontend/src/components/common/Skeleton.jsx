export function CardSkeleton() {
  return (
    <div className="ticket-card shadow-card animate-pulse">
      <div className="h-36 bg-sand" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-sand rounded w-3/4" />
        <div className="h-3 bg-sand rounded w-1/2" />
        <div className="h-3 bg-sand rounded w-1/3" />
      </div>
    </div>
  )
}

export default function Skeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
