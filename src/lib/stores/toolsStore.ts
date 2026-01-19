export interface Tool {
  id: string
  name: string
  icon: string
  description: string
}

export const tools: Tool[] = [
  {
    id: "calculator",
    name: "Calculator",
    icon: "🧮",
    description: "Simple calculator for basic arithmetic operations",
  },
  {
    id: "converter",
    name: "Unit Converter",
    icon: "⚖️",
    description: "Convert between varying metric and imperial units",
  },
  {
    id: "signature",
    name: "Gmail Signature Maker",
    icon: "✉️",
    description: "Create professional email signatures with custom templates",
  },
  {
    id: "meeting-assistant",
    name: "Meeting Assistant",
    icon: "💬",
    description: "Chat with your meeting transcripts using AI",
  },
  // Add more tools here as needed
]
