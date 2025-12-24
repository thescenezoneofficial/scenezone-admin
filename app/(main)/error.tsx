'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service (e.g., Sentry)
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center gap-6 px-4">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
          <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        
        <p className="text-muted-foreground">
          {/* Display the error message from your ApiError or a generic one */}
          {error.message || "An unexpected error occurred while fetching data."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
        
        {/* Attempt to recover by trying to re-render the segment */}
        <Button onClick={() => reset()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}