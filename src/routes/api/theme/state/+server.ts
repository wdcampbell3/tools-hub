import { json } from "@sveltejs/kit"
import { dev } from "$app/environment"
import fs from "fs"
import path from "path"

export async function GET() {
  // Only allow in development mode
  if (!dev) {
    return json({ error: "Not found" }, { status: 404 })
  }
  try {
    const cssPath = path.resolve("src/app.css")
    if (!fs.existsSync(cssPath)) {
      return json({ error: "app.css not found" }, { status: 404 })
    }

    const cssContent = fs.readFileSync(cssPath, "utf-8")

    const isDarkDefault = isBlockDefault(cssContent, "saasstartertheme")

    const dark = extractColors(cssContent, "saasstartertheme")
    const light = extractColors(cssContent, "saasstartertheme-light")

    return json({
      dark,
      light,
      defaultTheme: isDarkDefault ? "dark" : "light",
    })
  } catch (error) {
    console.error("Error fetching theme state:", error)
    return json({ error: "Failed to fetch theme state" }, { status: 500 })
  }
}

// Helper to extract colors from a named theme block
function extractColors(
  cssContent: string,
  themeName: string,
): Record<string, string> {
  const regex = new RegExp(
    `name:\\s*"${themeName}"[\\s\\S]*?([\\s\\S]*?)\\}`,
    "gm",
  )
  const match = regex.exec(cssContent)
  if (!match) return {}

  const block = match[1]
  const colors: Record<string, string> = {}

  // Extract CSS variables
  const varRegex = /--([\w-]+):\s*([^;]+);/g
  let varMatch
  while ((varMatch = varRegex.exec(block)) !== null) {
    colors[`--${varMatch[1]}`] = varMatch[2].trim()
  }
  return colors
}

// Check for default flag - find the dark theme block specifically
function isBlockDefault(cssContent: string, themeName: string): boolean {
  const nameSearch = `name: "${themeName}";`
  const nameIndex = cssContent.indexOf(nameSearch)
  if (nameIndex === -1) return false

  // Find opening brace before the name
  const blockStart = cssContent.lastIndexOf("{", nameIndex)
  if (blockStart === -1) return false

  // Find matching closing brace
  let braceCount = 1
  let idx = blockStart + 1
  while (idx < cssContent.length && braceCount > 0) {
    if (cssContent[idx] === "{") braceCount++
    if (cssContent[idx] === "}") braceCount--
    idx++
  }
  const blockEnd = idx

  // Extract block content and check for default: true
  const blockContent = cssContent.substring(blockStart, blockEnd)
  return /default:\s*true/.test(blockContent)
}
