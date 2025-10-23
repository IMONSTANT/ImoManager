'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useFileUpload(bucket: string = 'solutions') {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const supabase = createClient()

  const upload = async (file: File, path?: string) => {
    setUploading(true)
    try {
      const filePath = path || `${Date.now()}-${file.name}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return { path: data.path, url: publicUrl }
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, progress }
}
