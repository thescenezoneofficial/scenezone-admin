"use client"

import { useState } from "react"
import { ArtistProfile } from "./schema"
import { verifyArtistAction, deleteArtistAction } from "./actions"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Loader2, MapPin, Music, IndianRupee, Trash } from "lucide-react"
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
    // IMPORTANT: Pass the artistId._id (User ID), not the profile _id
    const res = await verifyArtistAction(artist.artistId._id)
    setLoading(false)
    if (res.success) onOpenChange(false)
    if (res.error) alert(res.error)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artist profile?")) return
    setLoading(true)
    const res = await deleteArtistAction(artist._id)
    setLoading(false)
    if (res.success) onOpenChange(false)
    if (res.error) alert(res.error)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border">
                    <Image 
                        src={artist.profileImageUrl} 
                        alt={artist.artistId.fullName}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        {artist.artistId.fullName}
                        {artist.artistId.isVerified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        )}
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-1 mt-1">
                        <span className="flex items-center gap-1">
                            <Music className="h-3 w-3" /> {artist.artistType} 
                            {artist.artistSubType && ` • ${artist.artistSubType}`}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {artist.address || "No Address"}
                        </span>
                    </DialogDescription>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="text-lg font-bold">
                    <IndianRupee className="h-3 w-3 mr-1" />
                    {artist.budget} / gig
                </Badge>
                <div className="text-xs text-muted-foreground">
                    Mobile: {artist.artistId.mobileNumber}
                </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
                
                {/* --- BIO SECTION --- */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/30 p-3 rounded-md">
                        <span className="text-muted-foreground block text-xs">Instrument</span>
                        <span className="font-medium">{artist.instrument || "N/A"}</span>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                        <span className="text-muted-foreground block text-xs">Email</span>
                        <span className="font-medium truncate">{artist.email}</span>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                        <span className="text-muted-foreground block text-xs">Crowd Guarantee</span>
                        <span className={`font-medium ${artist.isCrowdGuarantee ? 'text-green-600' : 'text-red-600'}`}>
                            {artist.isCrowdGuarantee ? "Yes" : "No"}
                        </span>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                        <span className="text-muted-foreground block text-xs">DOB</span>
                        <span className="font-medium">
                            {new Date(artist.dob).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* --- VIDEO GALLERY --- */}
                <div>
                    <h3 className="font-semibold mb-4 text-lg">Performance Gallery</h3>
                    {artist.performanceUrlId.length === 0 ? (
                        <p className="text-muted-foreground italic">No performance videos uploaded.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {artist.performanceUrlId.map((vid) => (
                                <div key={vid._id} className="group relative rounded-lg border overflow-hidden bg-black/5">
                                    <div className="aspect-video w-full">
                                        <video 
                                            controls 
                                            className="w-full h-full object-cover"
                                            poster={artist.profileImageUrl} // Fallback poster
                                        >
                                            <source src={vid.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    <div className="p-3 bg-card border-t">
                                        <div className="font-medium text-sm flex justify-between">
                                            <span>{vid.venueName}</span>
                                            <Badge variant="secondary" className="text-[10px] h-5">{vid.genre}</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t bg-muted/10">
            <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={loading}
                className="mr-auto"
            >
                <Trash className="mr-2 h-4 w-4" /> Delete Profile
            </Button>
            
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
            </Button>
            
            {!artist.artistId.isVerified && (
                <Button 
                    onClick={handleVerify} 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify Artist
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}