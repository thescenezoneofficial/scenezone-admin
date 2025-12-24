import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center gap-6 px-4">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground mt-2">
          Could not find the requested resource.
        </p>
      </div>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}