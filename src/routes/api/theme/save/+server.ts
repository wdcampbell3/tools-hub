import { json } from "@sveltejs/kit"
import { dev } from "$app/environment"
import fs from "fs"
import path from "path"

export async function POST({ request }) {
  // Only allow in development mode
  if (!dev) {
    return json({ error: "Not found" }, { status: 404 })
  }
  try {
    const { colors, defaultTheme } = await request.json() // Expect { colors: {light, dark}, defaultTheme: 'light' | 'dark' }

    const cssPath = path.resolve("src/app.css")
    let cssContent = fs.readFileSync(cssPath, "utf-8")

    // Apply updates
    if (colors.dark) {
      cssContent = updateThemeBlock(
        cssContent,
        "saasstartertheme",
        colors.dark,
        defaultTheme === "dark",
      )
    }
    if (colors.light) {
      cssContent = updateThemeBlock(
        cssContent,
        "saasstartertheme-light",
        colors.light,
        defaultTheme === "light",
      )
    }

    fs.writeFileSync(cssPath, cssContent, "utf-8")

    return json({ success: true, message: "Themes saved successfully" })
  } catch (error) {
    console.error("Error saving themes:", error)
    return json({ error: "Failed to save themes" }, { status: 500 })
  }
}

// Helper to patch a theme block using precise brace counting
function updateThemeBlock(
  content: string,
  themeName: string,
  newColors: Record<string, string>,
  isDefault: boolean,
): string {
  // 1. Find the start of the theme block
  // Look for @plugin "daisyui/theme" { ... name: "themeName";
  // We search for the name first, then backtrack to the @plugin declaration

  const nameSearch = `name: "${themeName}";`
  const nameIndex = content.indexOf(nameSearch)

  if (nameIndex === -1) {
    console.error(`Theme block not found for ${themeName}`)
    return content
  }

  // Find the start of the block (opening brace before the name)
  const blockStart = content.lastIndexOf("{", nameIndex)
  const pluginStart = content.lastIndexOf('@plugin "daisyui/theme"', blockStart)

  if (blockStart === -1 || pluginStart === -1) {
    console.error(`Malformed theme block for ${themeName}`)
    return content
  }

  // 2. Find the matching closing brace
  let braceCount = 1
  let currentIndex = blockStart + 1
  let blockEnd = -1

  while (currentIndex < content.length) {
    if (content[currentIndex] === "{") braceCount++
    if (content[currentIndex] === "}") braceCount--

    if (braceCount === 0) {
      blockEnd = currentIndex
      break
    }
    currentIndex++
  }

  if (blockEnd === -1) {
    console.error(`Could not find closing brace for ${themeName}`)
    return content
  }

  // 3. Extract the full block (from @plugin to })
  const fullBlockOriginal = content.substring(pluginStart, blockEnd + 1)

  // Extract just the body (inside {})
  let body = content.substring(blockStart + 1, blockEnd)

  // 4. Update Properties
  const isDarkTheme = themeName === "saasstartertheme"
  const defaultVal = isDefault ? "true" : "false"
  const prefersDarkVal = isDarkTheme ? "true" : "false"
  const colorSchemeVal = isDarkTheme ? "dark" : "light"

  function setProp(text: string, prop: string, val: string): string {
    const regex = new RegExp(`(\\s*${prop}:\\s*)([^;]+)(;)`)
    if (text.match(regex)) {
      return text.replace(regex, `$1${val}$3`)
    } else {
      // Add to top of body
      // Find first non-whitespace char to determine indentation or just force it
      return `\n  ${prop}: ${val};` + text
    }
  }

  body = setProp(body, "default", defaultVal)
  body = setProp(body, "prefersdark", prefersDarkVal)
  body = setProp(body, "color-scheme", colorSchemeVal)

  Object.entries(newColors).forEach(([key, value]) => {
    const regex = new RegExp(`(\\s*${key}:\\s*)([^;]+)(;)`)
    if (body.match(regex)) {
      body = body.replace(regex, `$1${value}$3`)
    } else {
      body += `\n  ${key}: ${value};`
    }
  })

  // Reconstruct
  const newBlock = content.substring(pluginStart, blockStart + 1) + body + "}"

  return content.replace(fullBlockOriginal, newBlock)
}
