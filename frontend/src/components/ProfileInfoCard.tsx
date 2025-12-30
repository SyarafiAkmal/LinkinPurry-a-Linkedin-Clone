import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pencil, Users } from 'lucide-react'

interface ProfileInfoCardProps {
  type?: "main" | "default"
  title?: string
  content?: string
  profileImage?: string
  username?: string
  fullName?: string
  location?: string
  organization?: string
  connectionCount?: number
  onEdit?: () => void
}

export function ProfileInfoCard({
  type = "default",
  title,
  content,
  profileImage,
  username,
  fullName,
  connectionCount,
  onEdit
}: ProfileInfoCardProps) {
  if (type === "main") {
    return (
      <Card className="relative overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300" />
        <CardContent className="relative px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-24 h-24 border-4 border-white -mt-12">
              <AvatarImage src={profileImage} alt={fullName} />
              <AvatarFallback>{fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold truncate">{fullName}</h1>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                {connectionCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{connectionCount} connections</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  )
}