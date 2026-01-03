"use client"

import { useState } from "react"
import { ArtistProfile } from "./schema"
import { verifyArtistAction, deleteArtistAction } from "./actions"
import { CustomModal } from "@/components/ui/custom-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, MapPin, Music, IndianRupee, Trash } from "lucide-react"
import Image from "next/image"

interface ArtistDetailsProps {
  artist: ArtistProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ArtistDetails({ artist, open, onOpenChange }: ArtistDetailsProps) {
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    const res = await verifyArtistAction(artist.artistId._id)
    setLoading(false)
    if (res.success) onOpenChange(false)
    if (res.error) alert(res.error)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artist profile?")) return
    setLoading(true)
    const res = await deleteArtistAction(artist.artistId._id)
    setLoading(false)
    if (res.success) onOpenChange(false)
    if (res.error) alert(res.error)
  }

  return (
    <CustomModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Artist Details"
    >
      <div className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-2">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border">
              <Image
                src={artist.profileImageUrl}
                alt={artist.artistId.fullName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                {artist.artistId.fullName}
                {artist.artistId.isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </h3>
              <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Music className="h-3 w-3" /> {artist.artistType}
                  {artist.artistSubType && ` • ${artist.artistSubType}`}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {artist.address || "No Address"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 self-end sm:self-auto">
            <Badge variant="outline" className="text-base font-bold">
              <IndianRupee className="mr-1 h-3 w-3" />
              {artist.budget} / gig
            </Badge>
            <div className="text-xs text-muted-foreground">
              Mobile: {artist.artistId.mobileNumber}
            </div>
          </div>
        </div>

        <Separator />

        {/* --- BIO GRID --- */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-muted/30 p-3">
            <span className="block text-xs text-muted-foreground">Instrument</span>
            <span className="font-medium">{artist.instrument || "N/A"}</span>
          </div>
          <div className="rounded-md bg-muted/30 p-3">
            <span className="block text-xs text-muted-foreground">Email</span>
            <span className="truncate font-medium block">{artist.email}</span>
          </div>
          <div className="rounded-md bg-muted/30 p-3">
            <span className="block text-xs text-muted-foreground">Crowd Guarantee</span>
            <span
              className={`font-medium ${
                artist.isCrowdGuarantee ? "text-green-600" : "text-red-600"
              }`}
            >
              {artist.isCrowdGuarantee ? "Yes" : "No"}
            </span>
          </div>
          <div className="rounded-md bg-muted/30 p-3">
            <span className="block text-xs text-muted-foreground">DOB</span>
            <span className="font-medium">
              {new Date(artist.dob).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* --- VIDEO GALLERY --- */}
        <div>
          <h4 className="mb-3 font-semibold">Performance Gallery</h4>
          {artist.performanceUrlId.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">No videos uploaded.</p>
          ) : (
            <div className="space-y-4">
              {artist.performanceUrlId.map((vid) => (
                <div
                  key={vid._id}
                  className="group relative overflow-hidden rounded-lg border bg-black/5"
                >
                  <div className="aspect-video w-full">
                    <video
                      controls
                      className="h-full w-full object-cover"
                      poster={artist.profileImageUrl}
                    >
                      <source src={vid.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="border-t bg-card p-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{vid.venueName}</span>
                      <Badge variant="secondary" className="h-5 px-1 text-[10px]">
                        {vid.genre}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="mt-4 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="sm:mr-auto"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete Profile
          </Button>

          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {!artist.artistId.isVerified && (
            <Button
              size="sm"
              onClick={handleVerify}
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Artist
            </Button>
          )}
        </div>
      </div>
    </CustomModal>
  )
}