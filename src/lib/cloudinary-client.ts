import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public"

interface CloudinaryOptions {
  width?: number
  height?: number
  quality?: string | number
  crop?: string
  format?: string
}

export const getOptimizedImageUrl = (
  publicId: string,
  options: CloudinaryOptions = {},
) => {
  if (!publicId) return ""
  if (publicId.startsWith("http")) return publicId // Return as is if it's already a URL

  const {
    width,
    height,
    quality = "auto",
    crop = "limit",
    format = "auto",
  } = options

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    crop ? `c_${crop}` : "",
  ]
    .filter(Boolean)
    .join(",")

  return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`
}
