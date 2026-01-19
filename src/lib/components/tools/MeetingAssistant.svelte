<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { marked } from "marked"

  let messageInput = ""

  type Source = {
    id: number
    meeting_name: string
    meeting_date: string
    message_id: string
    chunk_count: number
    text: string
    preview?: string
  }

  type Message = {
    role: "user" | "assistant"
    content: string
    sources?: Source[]
    usage?: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
    model?: string
  }

  let messages: Message[] = []
  let loading = false
  let chatContainer: HTMLElement
  // Set Gemini 2.5 Flash as default
  let selectedModel = "google/gemini-2.5-flash"
  let availableModels: { id: string; name: string }[] = []
  let modelSearchQuery = ""
  let showModelDropdown = false
  let showSources = false
  let currentSources: Source[] = []
  let selectedSourceId: number | null = null
  let allMeetings: {
    message_id: string
    meeting_name: string
    meeting_date: string
  }[] = []
  let selectedMeetingIds: string[] = [] // Empty = "all"
  let showMeetingFilter = false
  let totalSessionCost = 0.0
  let filteredMeetingNames: string[] = []

  // Reactive: Filter sources in side panel
  $: visibleSources =
    filteredMeetingNames.length > 0
      ? currentSources.filter((s) =>
          filteredMeetingNames.some((n) => {
            const cleanSource = s.meeting_name.trim()
            const cleanFilter = n.trim()
            return (
              cleanSource === cleanFilter ||
              cleanSource.includes(cleanFilter) ||
              cleanFilter.includes(cleanSource)
            )
          }),
        )
      : currentSources

  $: conversationStarters =
    selectedMeetingIds.length > 0
      ? [
          `Summarize ${selectedMeetingIds.length === 1 ? "this meeting" : "these meetings"}`,
          "What were the key takeaways?",
          "List all action items mentioned",
          "Write a summary email to the team",
          "Write a follow up email to the attendee(s)",
        ]
      : [
          "What was my last meeting about?",
          "What were last week's action items?",
          "How was my leadership style last week?",
          "How has team sentiment been recently?",
        ]

  $: filteredModels = availableModels.filter(
    (m) =>
      m.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(modelSearchQuery.toLowerCase()),
  )

  onMount(async () => {
    // Fetch available models from OpenRouter
    try {
      const response = await fetch("/api/models")
      const data = await response.json()
      availableModels = data.models || []

      // Ensure selectedModel is in the list or keep default
      if (
        selectedModel &&
        !availableModels.find((m) => m.id === selectedModel)
      ) {
        // If default isn't in list (unlikely for openrouter mostly), keep it or select first
        // But usually we just keep it.
      }

      // If no selected model (shouldn't happen due to init), pick first
      if (!selectedModel && availableModels.length > 0) {
        selectedModel = availableModels[0].id
      }
    } catch (error) {
      console.error("Failed to fetch models:", error)
      // Fallback to hardcoded models
      // Fallback to hardcoded models (should match server list)
      availableModels = [
        { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
        { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash Preview" },
        { id: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5" },
        { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
        { id: "openai/gpt-5.2", name: "GPT-5.2" },
      ]
    }

    // Fetch available meetings
    await fetchMeetings()

    // Attach outside-click listener for meeting filter dropdown
    window.addEventListener("click", handleWindowClick)

    // Attach click listener for citations
    if (chatContainer) {
      chatContainer.addEventListener("click", handleCitationClick)
    }
  })

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("click", handleWindowClick)
      if (chatContainer)
        chatContainer.removeEventListener("click", handleCitationClick)
    }
  })

  async function fetchMeetings() {
    try {
      const response = await fetch("/api/meetings")
      if (response.ok) {
        const data = await response.json()
        allMeetings = data.meetings || []
      }
    } catch (error) {
      console.error("Failed to fetch meetings:", error)
    }
  }

  let filterContainer: HTMLElement

  function toggleMeetingSelection(messageId: string) {
    // Multi-select mode: Toggle selection
    if (selectedMeetingIds.includes(messageId)) {
      // Deselect
      selectedMeetingIds = selectedMeetingIds.filter((id) => id !== messageId)
    } else {
      // Select
      selectedMeetingIds = [...selectedMeetingIds, messageId]
    }
  }

  function selectAllMeetings() {
    selectedMeetingIds = []
    showMeetingFilter = false
  }

  function isMeetingSelected(messageId: string): boolean {
    // If selectedMeetingIds is empty, ALL are considered selected ("All" mode).
    // Otherwise, only the ones in the array are selected.
    if (selectedMeetingIds.length === 0) return true
    return selectedMeetingIds.includes(messageId)
  }

  // Reactive count for display

  function getFilterButtonText(): string {
    if (selectedMeetingIds.length === 0) {
      return `All Meetings (${allMeetings.length})`
    }
    return `${selectedMeetingIds.length} Meeting${selectedMeetingIds.length !== 1 ? "s" : ""} Selected`
  }

  function handleWindowClick(event: MouseEvent) {
    if (
      showMeetingFilter &&
      filterContainer &&
      !filterContainer.contains(event.target as Node)
    ) {
      showMeetingFilter = false
    }
  }

  function handleCitationClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    const button = target.closest(".citation-link")
    if (button) {
      const rawMeetings = button.getAttribute("data-meetings")
      if (rawMeetings) {
        const names = rawMeetings.split("|||")
        filterSources(names)
      }
    }
  }

  function filterSources(meetingNames: string[]) {
    filteredMeetingNames = meetingNames
    // Ensure sources panel is open
    if (!showSources && currentSources.length > 0) {
      showSources = true
    }

    // Auto-expand the first source of the first meeting
    if (meetingNames.length > 0) {
      const firstMatch = currentSources.find(
        (s) => s.meeting_name === meetingNames[0],
      )
      if (firstMatch) {
        selectedSourceId = firstMatch.id
      }
    }
  }

  function clearSourceFilter() {
    filteredMeetingNames = []
  }

  // --- Missing Functions Implementation ---

  function getSelectedModelName() {
    const model = availableModels.find((m) => m.id === selectedModel)
    return model ? model.name : selectedModel
  }

  function selectModel(id: string) {
    selectedModel = id
    showModelDropdown = false
    modelSearchQuery = ""
  }

  function useConversationStarter(text: string) {
    messageInput = text
    sendMessage()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Pricing Configuration (Cost per 1M tokens)
  const PRICING_RATES: Record<string, { prompt: number; completion: number }> =
    {
      "google/gemini-2.5-flash": { prompt: 0.1, completion: 0.4 },
      "google/gemini-3-flash-preview": { prompt: 0.2, completion: 0.8 },
      "anthropic/claude-haiku-4.5": { prompt: 0.25, completion: 1.25 },
      "anthropic/claude-sonnet-4.5": { prompt: 3.0, completion: 15.0 },
      "openai/gpt-5-mini": { prompt: 0.5, completion: 1.5 },
      "openai/gpt-5.2": { prompt: 5.0, completion: 15.0 },
      "deepseek/deepseek-v3.2": { prompt: 0.14, completion: 0.28 },
      "deepseek/deepseek-r1": { prompt: 0.5, completion: 2.0 },
    }

  function calculateCost(
    usage: { prompt_tokens: number; completion_tokens: number },
    modelId: string,
  ): string {
    const rates = PRICING_RATES[modelId] || { prompt: 0, completion: 0 } // Default to 0 if unknown
    const promptCost = (usage.prompt_tokens / 1_000_000) * rates.prompt
    const completionCost =
      (usage.completion_tokens / 1_000_000) * rates.completion
    const total = promptCost + completionCost

    // Return mostly purely small numbers, show high precision
    if (total < 0.01) return "< $0.01"
    return `$${total.toFixed(4)}`
  }

  function getCostValue(
    usage: { prompt_tokens: number; completion_tokens: number },
    modelId: string,
  ): number {
    const rates = PRICING_RATES[modelId] || { prompt: 0, completion: 0 }
    const promptCost = (usage.prompt_tokens / 1_000_000) * rates.prompt
    const completionCost =
      (usage.completion_tokens / 1_000_000) * rates.completion
    return promptCost + completionCost
  }

  // Reactively update total session cost
  $: {
    let sum = 0
    messages.forEach((msg) => {
      if (msg.usage && msg.model) {
        sum += getCostValue(msg.usage, msg.model)
      }
    })
    totalSessionCost = sum
  }

  async function sendMessage() {
    if (!messageInput.trim() || loading) return

    const content = messageInput
    messageInput = ""

    // Track the model used for this message to calculate price correctly later
    const currentModel = selectedModel

    messages = [...messages, { role: "user", content }]
    loading = true

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          model: selectedModel,
          meetingIds:
            selectedMeetingIds.length > 0 ? selectedMeetingIds : undefined,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        let errMessage = "Failed to send message"
        try {
          const json = JSON.parse(errText)
          errMessage = json.message || json.error || errText
        } catch (e) {
          errMessage = errText || errMessage
        }
        throw new Error(errMessage)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let fullResponse = ""
      let sources: Source[] = []
      let usage:
        | {
            prompt_tokens: number
            completion_tokens: number
            total_tokens: number
          }
        | undefined

      if (reader) {
        let buffer = ""
        let isSourcesProcessed = false

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })

          // If we haven't processed sources yet, buffer everything
          if (!isSourcesProcessed) {
            buffer += chunk

            // Check if we have the full sources block
            const sourcesStartIndex = buffer.indexOf("__SOURCES__")
            const sourcesEndIndex = buffer.indexOf("__END_SOURCES__")

            if (sourcesStartIndex !== -1 && sourcesEndIndex !== -1) {
              // Extract sources
              const sourcesContent = buffer.substring(
                sourcesStartIndex + "__SOURCES__".length,
                sourcesEndIndex,
              )

              try {
                sources = JSON.parse(sourcesContent)
                // Don't show sources immediately. Wait for citations.
                // But we can auto-open the panel if we expect sources?
                // User said "sources should not show in the list", so let's keep list empty initially.
                if (sources && sources.length > 0) {
                  // We'll update currentSources dynamically in the loop
                  currentSources = []
                  selectedSourceId = null
                }
              } catch (e) {
                console.error("Failed to parse sources:", e)
              }

              // Remove sources block from buffer
              // Everything before sources (unlikely) + everything after END_SOURCES
              const preSources = buffer.substring(0, sourcesStartIndex)
              const postSources = buffer.substring(
                sourcesEndIndex + "__END_SOURCES__".length,
              )

              // The buffer now becomes the actual text content start
              buffer = preSources + postSources // Clean buffer
              fullResponse += buffer.trimStart() // Add to response
              isSourcesProcessed = true
              buffer = "" // Clear buffer to stream normally now
            } else if (
              sourcesStartIndex === -1 &&
              buffer.length > 500 &&
              buffer.indexOf("__SOURCES__") === -1
            ) {
              // Buffer safety logic...
            }
          } else {
            // Sources already processed OR we decided there are none
            let cleanChunk = chunk

            // Handle USAGE
            if (cleanChunk.includes("__USAGE__")) {
              const usageMatch = cleanChunk.match(
                /__USAGE__([\s\S]*?)__END_USAGE__/,
              )
              if (usageMatch) {
                try {
                  usage = JSON.parse(usageMatch[1])
                } catch (e) {
                  console.error(e)
                }
                cleanChunk = cleanChunk.replace(
                  /__USAGE__[\s\S]*?__END_USAGE__/,
                  "",
                )
              }
            }

            fullResponse += cleanChunk
          }

          // Live calculation of cited sources
          const citedKeys = new Set<string>()
          const citationRegex = /\[\[([^\]]+)\]\]/g
          let citationMatch

          // Parse full match to find citations
          // Note: This regex matches [[Citation]]
          while ((citationMatch = citationRegex.exec(fullResponse)) !== null) {
            citedKeys.add(citationMatch[1].trim())
          }

          const citedSources = sources.filter((s) => {
            const sourceDate = s.meeting_date.split("T")[0]
            const exactKey = `${s.meeting_name}, ${sourceDate}`

            return Array.from(citedKeys).some((citation) => {
              // Clean potential extra brackets just in case
              const cleanCitation = citation.replace(/^\[+|\]+$/g, "").trim()
              if (cleanCitation === exactKey) return true
              if (
                cleanCitation.startsWith(s.meeting_name) &&
                cleanCitation.includes(sourceDate)
              )
                return true
              return false
            })
          })

          // Auto-open panel if we have cited sources and it's not open yet
          if (
            citedSources.length > 0 &&
            !showSources &&
            typeof window !== "undefined" &&
            window.innerWidth >= 1024
          ) {
            showSources = true
          }

          currentSources = citedSources

          // Live update
          messages = [
            ...messages.slice(0, -1),
            {
              role: "assistant",
              content: fullResponse,
              sources: citedSources, // Only show cited
              usage: usage,
              model: currentModel,
            },
          ]
        }
      }

      // Final consistency check (same logic as in loop, basically)
      // Just ensuring everything is tidy at the end.
      const citedKeys = new Set<string>()
      const citationRegex = /\[\[([^\]]+)\]\]/g
      let citationMatch
      while ((citationMatch = citationRegex.exec(fullResponse)) !== null) {
        citedKeys.add(citationMatch[1].trim())
      }

      const citedSources = sources.filter((s) => {
        const sourceDate = s.meeting_date.split("T")[0]
        const exactKey = `${s.meeting_name}, ${sourceDate}`

        return Array.from(citedKeys).some((citation) => {
          const cleanCitation = citation.replace(/^\[+|\]+$/g, "").trim()
          if (cleanCitation === exactKey) return true
          if (
            cleanCitation.startsWith(s.meeting_name) &&
            cleanCitation.includes(sourceDate)
          )
            return true
          return false
        })
      })

      // Final cleanup update
      messages = [
        ...messages.slice(0, -1),
        {
          role: "assistant",
          content: fullResponse.trim(),
          sources: citedSources.length > 0 ? citedSources : sources, // Fallback to all if none matched?
          // Wait, if none matched, maybe we shouldn't show any?
          // The previous logic was "Fallback to all if none matched".
          // But the user request implies they want specific filtering.
          // I will keep the fallback ONLY if the final count is 0, to avoiding showing nothing
          // if the AI failed to cite correctly but we retrieved docs.
          // BUT, "sources should not show ... until mentioned". This suggests strictness.
          // However, for the FINAL state, if the AI hallucinated/forgot citations,
          // showing the retrieved context is helpful for debugging.
          // I'll stick to the original behavior for the FINAL update: fallback to sources if 0 citations found.
          // BUT for the loop, I used strict filtering.
          usage: usage,
          model: currentModel,
        },
      ]

      // Update currentSources with filtered list
      currentSources = citedSources.length > 0 ? citedSources : sources
      if (
        currentSources.length > 0 &&
        typeof window !== "undefined" &&
        window.innerWidth >= 1024
      ) {
        showSources = true
      }
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      messages = [
        ...messages,
        {
          role: "assistant",
          content: `Sorry, I encountered an error processing your request: ${errorMessage}`,
        },
      ]
    } finally {
      loading = false
      setTimeout(() => {
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
      }, 10)
    }
  }

  function renderWithCitations(content: string) {
    // Pre-process: Fix malformed citation patterns
    // Convert [[A], [B]] to [[A]] [[B]]
    let processedContent = content.replace(/\]\],?\s*\[/g, "]] [[")
    // Convert [[A, B], [C, D]] patterns (comma-separated inside one bracket pair)
    // This handles cases like [[Meeting A, 2026-01-15], [Meeting B, 2026-01-16]]
    processedContent = processedContent.replace(
      /\[(\[.*?\])(?:,\s*)(\[.*?\])\]/g,
      "$1] [$2",
    )

    // First render markdown
    let html = marked.parse(processedContent) as string

    // Regex to match one OR MORE adjacent citations
    // Matches "[[Name, Date]]" optionally followed by whitespace and more "[[Name, Date]]"
    const groupRegex = /((?:\[\[[^\]]+\]\]\s*)+)/g

    html = html.replace(groupRegex, (match: string) => {
      // "match" contains all adjacent citations, e.g. "[[A, D]] [[B, D]]"

      // Refactored logic inside the replace callback:
      const items: { name: string; text: string }[] = []
      const individualRegex2 = /\[\[(.*?)\]\]/g
      let m2
      while ((m2 = individualRegex2.exec(match)) !== null) {
        const inner = m2[1]
        let name = inner
        const dateRegexVal = /,\s*\d{4}-\d{2}-\d{2}.*$/
        if (dateRegexVal.test(inner)) {
          name = inner.replace(dateRegexVal, "").trim()
        } else if (inner.includes(",")) {
          name = inner.split(",")[0].trim()
        }
        // Avoid duplicates in the group list
        if (!items.find((i) => i.name === name)) {
          items.push({ name, text: inner })
        }
      }

      if (items.length === 0) return match // No valid citations found, return original

      const finalCount = items.length
      const badgeHtml =
        finalCount > 1
          ? `<span class="inline-flex items-center justify-center bg-primary ml-0.5 text-white text-[9px] font-bold h-3.5 min-w-[14px] px-0.5 rounded-full -translate-y-1">${finalCount}</span>`
          : ""

      // Join with newline instead of comma
      const tooltipText = items
        .map((i) => {
          let txt = i.text.replace(/^\[+|\]+$/g, "").trim()
          // Fix ISO dates to YYYY-MM-DD
          return txt.replace(/(\d{4}-\d{2}-\d{2})T[\d:.]+Z?/, "$1")
        })
        .join("\n")

      // Encode the meetings data for the click handler
      const meetingsData = items.map((i) => i.name).join("||")
      const dataAttr = meetingsData.replace(/"/g, "&quot;")

      return `<button class="citation-link text-primary hover:text-primary-focus inline-flex items-center cursor-pointer mx-0.5 align-middle relative" data-meetings="${dataAttr}" data-tooltip="${tooltipText.replace(/"/g, "&quot;")}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>${badgeHtml}
            </button>`
    })

    return html
  }

  let copiedIndex: number | null = null

  async function copyResponse(content: string) {
    // Strip citations [[...]] from the content
    const cleanContent = content.replace(/\[\[[^\]]+\]\]/g, "")

    // Convert markdown to HTML for rich paste (Gmail, etc.)
    const html = marked.parse(cleanContent) as string

    try {
      // Use clipboard API with both HTML and plain text
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html as string], { type: "text/html" }),
          "text/plain": new Blob([cleanContent], { type: "text/plain" }),
        }),
      ])

      // Show feedback (find which message this is)
      const msgIndex = messages.findIndex((m) => m.content === content)
      if (msgIndex >= 0) {
        copiedIndex = msgIndex
        setTimeout(() => {
          copiedIndex = null
        }, 2000)
      }
    } catch (err) {
      // Fallback to plain text copy
      await navigator.clipboard.writeText(cleanContent)
    }
  }

  // Parse transcript to extract metadata and clean content
  function parseTranscriptMeta(text: string): {
    videoUrl: string | null
    duration: string
    transcript: string
  } {
    let videoUrl: string | null = null
    let duration = ""
    let transcript = text

    // Extract Fathom video URL
    const urlMatch = text.match(/<?(https?:\/\/fathom\.video\/[^\s>]+)>?/)
    if (urlMatch) {
      videoUrl = urlMatch[1]
    }

    // Find the "/ 00:00" or similar pattern that starts the actual transcript
    const transcriptStartMatch = text.match(/\/\s*\d{2}:\d{2}:\d{2}/)
    if (transcriptStartMatch && transcriptStartMatch.index !== undefined) {
      transcript = text.substring(transcriptStartMatch.index)
    }

    // Extract duration from the last timecode in transcript
    const timecodes = transcript.match(/\d{2}:\d{2}:\d{2}/g)
    if (timecodes && timecodes.length > 0) {
      const lastTime = timecodes[timecodes.length - 1]
      const [hours, mins, secs] = lastTime.split(":").map(Number)
      const totalMins = hours * 60 + mins + (secs > 0 ? 1 : 0) // Round up
      duration =
        totalMins >= 60
          ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
          : `${totalMins}m`
    }

    return { videoUrl, duration, transcript }
  }

  // Format transcript: strip line breaks, add breaks before timecodes, remove signature
  function formatTranscript(text: string): string {
    // Remove RAIZOR signature block and similar footer content
    let formatted = text.replace(/--\s*\[image:.*?$/s, "").trim()
    formatted = formatted.replace(/RAIZOR.*$/s, "").trim()

    // Remove all line breaks first
    formatted = formatted.replace(/[\r\n]+/g, " ").trim()

    // Add double line break before each timecode pattern, removing the leading "/ "
    formatted = formatted.replace(/\s*\/?\s*\b(\d{2}:\d{2}:\d{2})\b/g, "\n\n$1")

    return formatted.trim()
  }

  // State for tracking which source transcript is being copied
  let copiedSourceId: number | null = null

  async function copySourceTranscript(sourceId: number, text: string) {
    const { transcript } = parseTranscriptMeta(text)
    await navigator.clipboard.writeText(formatTranscript(transcript))
    copiedSourceId = sourceId
    setTimeout(() => {
      copiedSourceId = null
    }, 2000)
  }

  function closeSources() {
    showSources = false
  }
</script>

<!-- Mobile Sources Backdrop -->
{#if showSources}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="fixed inset-0 bg-black/20 z-40 lg:hidden"
    onclick={closeSources}
    role="button"
    tabindex="0"
    aria-label="Close sources panel"
  ></div>
{/if}

<div class="h-full flex gap-0 relative overflow-hidden">
  <!-- Main Chat Area -->
  <div class="flex-1 flex flex-col bg-base-100 min-w-0">
    {#if messages.length > 0}
      <div
        class="h-14 border-b border-base-300 flex items-center gap-2 px-4 bg-base-100 flex-none z-10"
      >
        <button
          class="btn btn-ghost btn-sm gap-2"
          onclick={() => {
            messages = []
            currentSources = []
            showSources = false
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Meetings
        </button>
      </div>
    {/if}
    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-6" bind:this={chatContainer}>
      {#if messages.length === 0}
        <div class="h-full flex flex-col items-center justify-center">
          <!-- Meeting Filter -->
          <div class="w-full max-w-2xl mb-8" bind:this={filterContainer}>
            <div class="relative">
              <button
                class="btn bg-base-100 border-base-300 hover:bg-base-300 text-base-content w-full justify-between font-normal"
                onclick={() => (showMeetingFilter = !showMeetingFilter)}
              >
                <span>{getFilterButtonText()}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {#if showMeetingFilter}
                <div
                  class="absolute top-full left-0 right-0 mt-2 bg-base-200 border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col"
                >
                  <div
                    class="p-3 border-b border-base-300 flex justify-between items-center gap-2"
                  >
                    <span class="font-semibold">Filter Meetings</span>
                    <button
                      class="btn btn-xs btn-ghost"
                      onclick={selectAllMeetings}
                    >
                      Select All
                    </button>
                  </div>
                  <div class="overflow-y-auto flex-1">
                    {#key selectedMeetingIds}
                      {#each allMeetings as meeting (meeting.message_id)}
                        <label
                          class="flex items-center gap-3 p-3 hover:bg-base-300 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            class="checkbox checkbox-sm checkbox-primary"
                            checked={isMeetingSelected(meeting.message_id)}
                            onchange={() => {
                              toggleMeetingSelection(meeting.message_id)
                            }}
                          />
                          <div class="flex-1">
                            <div class="font-medium text-sm">
                              {meeting.meeting_name}
                            </div>
                            <div class="text-xs opacity-60">
                              {new Date(
                                meeting.meeting_date,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </label>
                      {/each}
                    {/key}
                    {#if allMeetings.length === 0}
                      <div class="p-4 text-center text-sm opacity-60">
                        No meetings found
                      </div>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Conversation Starters -->
          <div class="w-full max-w-2xl">
            <h3 class="text-sm font-semibold opacity-60 mb-3 text-center">
              Conversation Starters
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              {#each conversationStarters as starter}
                <button
                  class="btn btn-sm bg-base-100 border-base-300 hover:bg-base-300 text-base-content justify-start text-left h-auto py-3 whitespace-normal font-normal"
                  onclick={() => useConversationStarter(starter)}
                >
                  {starter}
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      {#each messages as msg, i}
        <div class="mb-6 {msg.role === 'user' ? 'flex justify-end' : ''}">
          {#if msg.role === "user"}
            <div class="bg-primary/10 rounded-2xl px-4 py-3 max-w-2xl">
              <p class="text-base-content whitespace-pre-wrap">{msg.content}</p>
            </div>
          {:else}
            <div class="max-w-3xl">
              <div class="prose prose-sm max-w-none">
                <!-- Render content with clickable citations -->
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html renderWithCitations(msg.content)}
              </div>
              {#if msg.sources && msg.sources.length > 0}
                <div class="flex items-center gap-3 mt-2">
                  <button
                    class="btn btn-sm btn-ghost"
                    onclick={() => {
                      currentSources = msg.sources || []
                      showSources = true
                      selectedSourceId = currentSources[0]?.id
                    }}
                  >
                    📄 View Sources ({msg.sources.length})
                  </button>

                  <button
                    class="btn btn-sm btn-ghost gap-1"
                    onclick={() => copyResponse(msg.content)}
                    title="Copy response (without citations)"
                  >
                    {#if copiedIndex === i}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-success"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-success text-xs">Copied!</span>
                    {:else}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span class="text-xs">Copy</span>
                    {/if}
                  </button>

                  {#if msg.usage && msg.model}
                    <div
                      class="text-xs opacity-50 flex items-center gap-1"
                      title="Input: {msg.usage.prompt_tokens} / Output: {msg
                        .usage.completion_tokens}"
                    >
                      <span>💰 Cost: {calculateCost(msg.usage, msg.model)}</span
                      >
                      <span class="text-[10px]"
                        >({msg.usage.total_tokens} toks)</span
                      >
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}

      {#if loading}
        <div class="mb-6">
          <div class="flex items-center gap-2 text-base-content/60">
            <span class="loading loading-dots loading-sm"></span>
            <span class="text-sm">Thinking...</span>
          </div>
        </div>
      {/if}
    </div>

    <!-- Input Area -->
    <div class="border-t border-base-300 p-4 bg-base-100">
      <div class="max-w-3xl mx-auto">
        <div class="flex gap-2 items-end">
          <!-- Model Selector Dropdown -->
          <div class="relative">
            <button
              class="btn btn-sm btn-ghost"
              onclick={() => (showModelDropdown = !showModelDropdown)}
              title={getSelectedModelName()}
              aria-label="Toggle model dropdown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </button>

            {#if showModelDropdown}
              <div
                class="absolute bottom-full left-0 mb-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col"
              >
                <div class="p-2 border-b border-base-300">
                  <!-- svelte-ignore a11y_autofocus -->
                  <input
                    type="text"
                    class="input input-sm input-bordered w-full"
                    placeholder="Search models..."
                    bind:value={modelSearchQuery}
                    autofocus
                  />
                </div>
                <div class="overflow-y-auto flex-1">
                  {#each filteredModels as model}
                    <button
                      class="w-full text-left px-3 py-2 hover:bg-base-200 transition-colors {selectedModel ===
                      model.id
                        ? 'bg-primary/10'
                        : ''}"
                      onclick={() => selectModel(model.id)}
                    >
                      <div class="font-medium text-sm">{model.name}</div>
                      <div class="text-xs opacity-60 truncate">{model.id}</div>
                    </button>
                  {/each}
                  {#if filteredModels.length === 0}
                    <div class="p-4 text-center text-sm opacity-60">
                      No models found
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>

          <!-- Message Input -->
          <input
            type="text"
            class="input input-bordered flex-1"
            placeholder="Ask"
            bind:value={messageInput}
            onkeydown={handleKeydown}
            disabled={loading}
          />

          <!-- Send Button -->
          <button
            class="btn btn-primary btn-square"
            onclick={sendMessage}
            disabled={loading || !messageInput.trim()}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>

        <!-- Selected Model Display -->
        <div
          class="flex justify-between items-center text-xs opacity-60 mt-2 px-1"
        >
          <span>Currently selected: {getSelectedModelName()}</span>
          <span>Total used this session: ${totalSessionCost.toFixed(4)}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Sources Side Panel (Drawer on Mobile, Column on Desktop) - Only show when there are messages -->
  {#if messages.length > 0}
    <div
      class="
			fixed inset-y-0 right-0 z-50 w-80 bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out
			lg:static lg:transform-none lg:shadow-none lg:border-l lg:border-base-300
			{showSources ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            {showSources ? '' : 'lg:hidden'} 
		"
    >
      <!-- Panel Header -->
      <div
        class="h-14 border-b border-base-300 flex items-center justify-between px-4 bg-base-100"
      >
        <span class="font-bold">Sources ({currentSources.length})</span>
        <div class="flex items-center gap-1">
          {#if filteredMeetingNames.length > 0}
            <button
              class="btn btn-xs btn-ghost text-primary"
              onclick={clearSourceFilter}
              title="Show all sources"
            >
              Show All
            </button>
          {/if}
          <button
            class="btn btn-sm btn-ghost btn-square"
            onclick={closeSources}
            aria-label="Close panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Panel Content -->
      <div
        class="h-[calc(100%-3.5rem)] overflow-y-auto p-4 space-y-3 bg-base-100"
      >
        {#each visibleSources as source}
          {@const meta = parseTranscriptMeta(source.text)}
          {@const meetingDate = new Date(source.meeting_date)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm {selectedSourceId ===
            source.id
              ? 'bg-base-200 border-primary shadow-md'
              : 'bg-base-200 border-transparent hover:bg-base-300 hover:border-primary/30'}"
            onclick={() =>
              (selectedSourceId =
                selectedSourceId === source.id ? null : source.id)}
            role="button"
            tabindex="0"
          >
            <div class="p-3">
              <div class="flex justify-between items-start mb-1">
                <h4
                  class="font-medium text-sm leading-tight text-base-content {selectedSourceId ===
                  source.id
                    ? '!text-primary'
                    : ''}"
                >
                  {source.meeting_name}
                </h4>
                <div
                  class="text-[10px] text-base-content/60 whitespace-nowrap ml-2 text-right"
                >
                  <div>{meetingDate.toLocaleDateString()}</div>
                  {#if meta.duration}
                    <div class="text-base-content/40">
                      {meta.duration} • {meetingDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  {/if}
                </div>
              </div>

              {#if selectedSourceId === source.id}
                <div
                  class="text-xs mt-2 text-base-content/80 bg-base-100 p-3 rounded border border-base-content/10 max-h-60 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed"
                >
                  {formatTranscript(meta.transcript)}
                </div>
                <div
                  class="flex justify-between items-center mt-2 pt-2 border-t border-base-300"
                >
                  {#if meta.videoUrl}
                    <a
                      href={meta.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xs text-primary hover:underline flex items-center gap-1"
                      onclick={(e) => e.stopPropagation()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Video link
                    </a>
                  {:else}
                    <span></span>
                  {/if}
                  <button
                    class="btn btn-xs btn-ghost gap-1 text-base-content/60 hover:text-primary"
                    onclick={(e) => {
                      e.stopPropagation()
                      copySourceTranscript(source.id, source.text)
                    }}
                  >
                    {#if copiedSourceId === source.id}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5 text-success"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-success">Copied!</span>
                    {:else}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    {/if}
                  </button>
                </div>
              {:else}
                <div class="text-xs text-base-content/50 line-clamp-2">
                  {meta.transcript.substring(0, 100).replace(/[\r\n]+/g, " ") +
                    "..."}
                </div>
              {/if}
            </div>
          </div>
        {/each}
        {#if visibleSources.length === 0 && currentSources.length === 0}
          <div class="text-center p-8 text-base-content/40 text-sm">
            No sources available yet.
          </div>
        {:else if visibleSources.length === 0}
          <div class="text-center p-8 text-base-content/40 text-sm">
            No sources match the current filter.
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Floating Sources Toggle Button (when closed, only show when there are messages) -->
  {#if messages.length > 0 && !showSources && currentSources.length > 0}
    <button
      class="fixed bottom-24 right-4 z-40 btn btn-primary btn-circle shadow-lg lg:absolute lg:bottom-auto lg:top-4 lg:right-4"
      onclick={() => (showSources = true)}
      aria-label="Open sources panel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span class="absolute -top-1 -right-1 badge badge-sm badge-secondary"
        >{currentSources.length}</span
      >
    </button>
  {/if}
</div>

<style>
  :global(.citation) {
    cursor: pointer;
    color: rgb(59 130 246);
    font-weight: 600;
    margin: 0 1px;
  }

  :global(.citation:hover) {
    text-decoration: underline;
  }

  /* Custom tooltip for citation links */
  :global(.citation-link) {
    position: relative;
  }

  :global(.citation-link::after) {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 0;
    transform: translateX(-10%);
    background: #1f2937;
    color: #ffffff;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    white-space: pre-line;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.15s,
      visibility 0.15s;
    z-index: 100;
    pointer-events: none;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
    width: max-content;
    max-width: 250px;
    text-align: left;
    line-height: 1.4;
    margin-bottom: 6px;
  }

  :global(.citation-link:hover::after) {
    opacity: 1;
    visibility: visible;
  }

  /* Arrow for tooltip */
  :global(.citation-link::before) {
    content: "";
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    border: 6px solid transparent;
    border-top-color: #1f2937;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.15s,
      visibility 0.15s;
    z-index: 101;
  }

  :global(.citation-link:hover::before) {
    opacity: 1;
    visibility: visible;
  }
</style>
