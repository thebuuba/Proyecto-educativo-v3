function Bar({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
}

function Block({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Bar key={i} className={`h-4 ${i === rows - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Bar className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Bar key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Bar className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Bar key={i} className="h-24 w-full" />
        ))}
      </div>
      <TableSkeleton />
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Bar className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Block rows={4} />
        <Block rows={4} />
      </div>
      <Block rows={6} />
    </div>
  )
}
