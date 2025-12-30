'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { format } from 'date-fns'
import { Edit2, Trash2 } from 'lucide-react'

interface FeedCardProps {
  content: string
  created_at: Date
  updated_at: Date
  author?: string
  onDelete?: () => void
  onEdit?: (newContent: string) => Promise<void>
}

const FeedCard: React.FC<FeedCardProps> = ({
  author,
  content,
  created_at,
  updated_at,
  onDelete,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd')
  }

  const handleEditSubmit = async () => {
    if (onEdit) {
      await onEdit(editedContent)
      setIsEditing(false)
    }
  }

  return (
    <Card className="mb-4 border-none shadow-none">
      <CardHeader className="flex flex-col items-start pb-4 px-4">
        <div className="flex flex-col">
          {author && <h3 className="font-semibold text-blue-600">{author}</h3>}
          <p className="text-sm text-gray-500">
            {formatDate(created_at)}
            {created_at.getTime() !== updated_at.getTime() && ` • Edited ${formatDate(updated_at)}`}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-6">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
          />
        ) : (
          <p className="text-gray-700">{content}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-start space-x-2 px-4 pt-2">
        {isEditing ? (
          <>
            <Button onClick={handleEditSubmit} variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
            <Button onClick={() => setIsEditing(false)} variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-700">Cancel</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {onDelete && (
              <Button onClick={onDelete} variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default FeedCard