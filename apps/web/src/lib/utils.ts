import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateType(date: string) {
  const [year, month, day] = date.split("-")
  return `${day}/${month}/${year}`
}

export const downscaleImageToFile = async (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 1,
): Promise<{ file: File, preview: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onload = () => {
        let { width, height } = img

        // Calculate new dimensions while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height
          if (width > height) {
            width = maxWidth
            height = Math.round(maxWidth / aspectRatio)
          }
          else {
            height = maxHeight
            width = Math.round(maxHeight * aspectRatio)
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Unable to get canvas context"))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Convert Blob to File by providing a name and metadata
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })

              const preview = URL.createObjectURL(resizedFile)

              resolve({ file: resizedFile, preview })
            }
            else {
              reject(new Error("Canvas is empty"))
            }
          },
          file.type,
          quality,
        )
      }
      img.onerror = error => reject(error)
    }
    reader.onerror = error => reject(error)
  })
}

// 2025-02-26 20:21:07.284934+00
// ret 26/02/2025 17:21
export const datetimeToLocale = (datetime: string) => {
  const date = new Date(datetime)

  const day = `${date.getDate()}`.padStart(2, "0")
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const year = date.getFullYear()
  const hours = `${date.getHours()}`.padStart(2, "0")
  const minutes = `${date.getMinutes()}`.padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function truncateString(str: string, maxLength = 100) {
  if (str.length <= maxLength)
    return str

  return `${str.replace(/\n/g, " ").trim().slice(0, maxLength).trim()}...`
}
