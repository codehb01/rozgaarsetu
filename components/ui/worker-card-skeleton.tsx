import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function WorkerCardSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      {/* Profile Image */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      
      {/* Skills */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-[80px] rounded-full" />
          <Skeleton className="h-6 w-[70px] rounded-full" />
          <Skeleton className="h-6 w-[90px] rounded-full" />
        </div>
      </div>
      
      {/* Rating and Price */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-6 w-[80px]" />
      </div>
      
      {/* Action Button */}
      <Skeleton className="h-10 w-full rounded-md" />
    </Card>
  )
}

export function WorkerGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <WorkerCardSkeleton key={i} />
      ))}
    </div>
  )
}