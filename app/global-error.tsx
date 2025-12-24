'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Button } from '@/components/ui/button'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl font-bold">Critical Error</h2>
          <p className="text-muted-foreground">Something went globally wrong.</p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  )
}