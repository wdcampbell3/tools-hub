<script lang="ts">
  type Tab = "basic" | "social" | "template"
  type Template = "professional" | "modern" | "minimal"
  type LogoPosition = "left" | "right"

  interface SocialLink {
    id: string
    platform: string
    url: string
  }

  // State management
  let activeTab = $state<Tab>("basic")

  // Basic Info
  let fullName = $state("")
  let jobTitle = $state("")
  let company = $state("")
  let email = $state("")
  let phone = $state("")
  let website = $state("")

  let logoPreview = $state("")
  let logoPosition = $state<LogoPosition>("left")
  let fontColor = $state("#1f2937")
  let sidebarColor = $state("#4b5563")

  // Social Links
  let socialLinks = $state<SocialLink[]>([])

  // Template
  let selectedTemplate = $state<Template>("professional")

  // File upload handler
  function handleLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        logoPreview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  // Delete logo handler
  function deleteLogo() {
    logoPreview = ""
    // Reset file input
    const fileInput = document.getElementById("logoUpload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  // Social links management
  function addSocialLink() {
    socialLinks = [
      ...socialLinks,
      {
        id: crypto.randomUUID(),
        platform: "LinkedIn",
        url: "https://www.linkedin.com/yourprofile",
      },
    ]
  }

  function removeSocialLink(id: string) {
    socialLinks = socialLinks.filter((link) => link.id !== id)
  }

  // Template configurations
  const templates = {
    professional: {
      name: "Professional",
      description:
        "Clean and corporate layout with emphasis on contact details",
    },
    modern: {
      name: "Modern",
      description:
        "Contemporary design with bold typography and vibrant colors",
    },
    minimal: {
      name: "Minimal",
      description: "Simple and elegant with focus on essential information",
    },
  }

  // Social platform icons (using static images)
  const platformIcons: Record<string, string> = {
    LinkedIn: "/images/social-icons/LinkedIn-60.jpg",
    X: "/images/social-icons/X-logo-60.jpg",
    Facebook: "/images/social-icons/Facebook-60.jpg",
    Instagram: "/images/social-icons/instagram-60.jpg",
    YouTube: "/images/social-icons/YouTube-Logo 60.jpg",
  }

  // Generate HTML signature based on template
  let signatureHTML = $derived.by(() => {
    const logoHTML = logoPreview
      ? `<div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; display: block;">
        <img src="${logoPreview}" alt="Logo" width="80" height="80" style="width: 100%; height: 100%; object-fit: cover; display: block; min-width: 80px; min-height: 80px;" />
      </div>`
      : ""

    const socialLinksHTML = socialLinks
      .map((link) => {
        const iconSrc = platformIcons[link.platform]
        return iconSrc
          ? `<a href="${link.url}" style="text-decoration: none; margin-right: 6px;"><img src="${iconSrc}" alt="${link.platform}" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;" /></a>`
          : ""
      })
      .join("")

    if (selectedTemplate === "professional") {
      const lastContactMargin = socialLinksHTML ? "4px" : "0"
      return `
<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; max-width: 600px; width: 100%; table-layout: fixed;">
  <tr>
    ${logoPreview && logoPosition === "left" ? `<td style="padding-right: 20px; vertical-align: top; width: 105px;">${logoHTML}</td>` : ""}
    <td style="border-left: 3px solid ${sidebarColor}; padding-left: 20px; vertical-align: top;">
      ${fullName ? `<div style="color: ${fontColor}; font-size: clamp(14px, 3vw, 18px); font-weight: bold; margin-bottom: 4px; word-wrap: break-word;">${fullName}</div>` : ""}
      ${jobTitle ? `<div style="color: #6b7280; font-size: clamp(12px, 2.5vw, 14px); margin-bottom: 2px; word-wrap: break-word;">${jobTitle}</div>` : ""}
      ${company ? `<div style="color: ${fontColor}; font-weight: bold; font-size: clamp(12px, 2.5vw, 14px); margin-bottom: 12px; word-wrap: break-word;">${company}</div>` : ""}
      ${email ? `<div style="color: #6b7280; font-size: clamp(11px, 2vw, 13px); margin-bottom: 4px; word-wrap: break-word;"><span style="color: #3b82f6;">📧</span> ${email}</div>` : ""}
      ${phone ? `<div style="color: #6b7280; font-size: clamp(11px, 2vw, 13px); margin-bottom: 4px; word-wrap: break-word;"><span style="color: #3b82f6;">📞</span> ${phone}</div>` : ""}
      ${website ? `<div style="color: #6b7280; font-size: clamp(11px, 2vw, 13px); margin-bottom: ${lastContactMargin}; word-wrap: break-word;"><span style="color: #3b82f6;">🌐</span> ${website}</div>` : ""}
      ${socialLinksHTML ? `<div style="margin-top: 8px;">${socialLinksHTML}</div>` : ""}
    </td>
    ${logoPreview && logoPosition === "right" ? `<td style="padding-left: 20px; vertical-align: top; width: 105px;">${logoHTML}</td>` : ""}
  </tr>
</table>`
    } else if (selectedTemplate === "modern") {
      const titleCompany = [jobTitle, company].filter(Boolean).join(" • ")
      const lastContactMargin = socialLinksHTML ? "4px" : "0"
      return `
<table cellpadding="0" cellspacing="0" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; width: 100%; table-layout: fixed;">
  <tr>
    ${logoPreview ? `<td style="background: linear-gradient(135deg, ${sidebarColor} 0%, #1f2937 100%); padding: 20px; border-radius: 12px 0 0 12px; vertical-align: middle; text-align: center; width: 120px;">${logoHTML}</td>` : ""}
    <td style="padding: 20px; vertical-align: top;">
      ${fullName ? `<div style="color: ${fontColor}; font-size: clamp(16px, 3.5vw, 20px); font-weight: bold; margin-bottom: 4px; word-wrap: break-word;">${fullName}</div>` : ""}
      ${titleCompany ? `<div style="color: #6b7280; font-size: clamp(12px, 2.5vw, 14px); font-style: italic; margin-bottom: 8px; word-wrap: break-word;">${titleCompany}</div>` : ""}
      ${email ? `<div style="margin-top: 12px; margin-bottom: 4px; word-wrap: break-word;"><span style="color: #6b7280; font-size: clamp(11px, 2vw, 13px);">E: ${email}</span></div>` : ""}
      ${phone ? `<div style="margin-bottom: 4px; word-wrap: break-word;"><span style="color: #6b7280; font-size: clamp(11px, 2vw, 13px);">P: ${phone}</span></div>` : ""}
      ${website ? `<div style="margin-bottom: ${lastContactMargin}; word-wrap: break-word;"><span style="color: #6b7280; font-size: clamp(11px, 2vw, 13px);">W: ${website}</span></div>` : ""}
      ${socialLinksHTML ? `<div style="margin-top: 8px;">${socialLinksHTML}</div>` : ""}
    </td>
  </tr>
</table>`
    } else {
      // minimal
      const details = []
      const separator = `<span style="color: ${sidebarColor}; margin: 0 4px;"> • </span>`

      if (jobTitle && company) {
        details.push(`${jobTitle}${separator}${company}`)
      } else if (jobTitle) {
        details.push(jobTitle)
      } else if (company) {
        details.push(company)
      }

      if (email && phone) {
        details.push(`${email}${separator}${phone}`)
      } else if (email) {
        details.push(email)
      } else if (phone) {
        details.push(phone)
      }

      if (website) details.push(website)

      const detailsMargin = socialLinksHTML && details.length > 0 ? "8px" : "0"
      return `
<table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; width: 100%; table-layout: fixed;">
  <tr>
    ${logoPreview ? `<td style="padding: 16px; vertical-align: top; width: 120px;">${logoHTML}</td>` : ""}
    <td style="padding: 16px; vertical-align: middle;">
      ${fullName ? `<div style="color: ${fontColor}; font-size: clamp(14px, 3vw, 16px); font-weight: 600; margin-bottom: 8px; word-wrap: break-word;">${fullName}</div>` : ""}
      ${details.length > 0 ? `<div style="color: #9ca3af; font-size: clamp(11px, 2vw, 13px); line-height: 1.6; margin-bottom: ${detailsMargin}; word-wrap: break-word;">${details.join("<br/>")}</div>` : ""}
      ${socialLinksHTML ? `<div style="margin-top: 8px;">${socialLinksHTML}</div>` : ""}
    </td>
  </tr>
</table>`
    }
  })

  // Copy to clipboard - optimized for Gmail
  async function copySignature() {
    try {
      // Method 1: Try modern Clipboard API with both HTML and plain text
      if (navigator.clipboard && window.ClipboardItem) {
        const htmlBlob = new Blob([signatureHTML], { type: "text/html" })
        const textBlob = new Blob([signatureHTML.replace(/<[^>]*>/g, "")], {
          type: "text/plain",
        })

        const clipboardItem = new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": textBlob,
        })

        await navigator.clipboard.write([clipboardItem])
        alert("Signature copied! You can now paste it into Gmail settings.")
        return
      }

      // Method 2: Fallback to selection-based copy (works better in some browsers)
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = signatureHTML
      tempDiv.contentEditable = "true"
      tempDiv.style.position = "fixed"
      tempDiv.style.top = "0"
      tempDiv.style.left = "0"
      tempDiv.style.width = "0"
      tempDiv.style.height = "0"
      tempDiv.style.opacity = "0"
      tempDiv.style.overflow = "hidden"
      document.body.appendChild(tempDiv)

      // Select the content
      const range = document.createRange()
      range.selectNodeContents(tempDiv)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)

      // Focus the element to ensure copy works
      tempDiv.focus()

      // Copy using execCommand as fallback
      const successful = document.execCommand("copy")

      // Cleanup
      document.body.removeChild(tempDiv)
      selection?.removeAllRanges()

      if (successful) {
        alert("Signature copied! You can now paste it into Gmail settings.")
      } else {
        throw new Error("Copy command failed")
      }
    } catch (err) {
      console.error("Failed to copy:", err)
      alert(
        "Failed to copy signature. Please try selecting and copying the preview manually.",
      )
    }
  }
</script>

<div class="h-full flex overflow-hidden">
  <!-- Left Side: Create Your Signature -->
  <div class="w-1/2 overflow-auto bg-base-100 p-8">
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold mb-2">Create Your Signature</h1>
      <p class="text-base-content/60 mb-8">
        Fill in your details and watch your signature come to life in real-time.
      </p>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          class="btn flex-1 {activeTab === 'basic'
            ? 'btn-primary'
            : 'btn-ghost bg-base-200'}"
          onclick={() => (activeTab = "basic")}
        >
          Basic Info
        </button>
        <button
          class="btn flex-1 {activeTab === 'social'
            ? 'btn-primary'
            : 'btn-ghost bg-base-200'}"
          onclick={() => (activeTab = "social")}
        >
          Social Links
        </button>
        <button
          class="btn flex-1 {activeTab === 'template'
            ? 'btn-primary'
            : 'btn-ghost bg-base-200'}"
          onclick={() => (activeTab = "template")}
        >
          Template
        </button>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        {#if activeTab === "basic"}
          <!-- Basic Info Form -->
          <div class="form-control">
            <label class="label" for="fullName">
              <span class="label-text font-semibold"
                >Full Name <span class="text-error">*</span></span
              >
            </label>
            <input
              id="fullName"
              type="text"
              bind:value={fullName}
              class="input input-bordered w-full"
              placeholder="John Doe"
            />
          </div>

          <div class="form-control">
            <label class="label" for="jobTitle">
              <span class="label-text font-semibold">Job Title</span>
            </label>
            <input
              id="jobTitle"
              type="text"
              bind:value={jobTitle}
              class="input input-bordered w-full"
              placeholder="Software Engineer"
            />
          </div>

          <div class="form-control">
            <label class="label" for="company">
              <span class="label-text font-semibold">Company</span>
            </label>
            <input
              id="company"
              type="text"
              bind:value={company}
              class="input input-bordered w-full"
              placeholder="Acme Inc."
            />
          </div>

          <div class="form-control">
            <label class="label" for="email">
              <span class="label-text font-semibold">Email</span>
            </label>
            <input
              id="email"
              type="email"
              bind:value={email}
              class="input input-bordered w-full"
              placeholder="john@example.com"
            />
          </div>

          <div class="form-control">
            <label class="label" for="phone">
              <span class="label-text font-semibold">Phone</span>
            </label>
            <input
              id="phone"
              type="tel"
              bind:value={phone}
              class="input input-bordered w-full"
              placeholder="(555) 123-4567"
            />
          </div>

          <div class="form-control">
            <label class="label" for="website">
              <span class="label-text font-semibold">Website</span>
            </label>
            <input
              id="website"
              type="text"
              bind:value={website}
              class="input input-bordered w-full"
              placeholder="www.example.com"
            />
          </div>

          <div class="form-control">
            <label class="label" for="logoUpload">
              <span class="label-text font-semibold">Logo Upload</span>
            </label>
            <input
              id="logoUpload"
              type="file"
              accept="image/*"
              class="file-input file-input-bordered w-full"
              onchange={handleLogoUpload}
            />
            <div class="label">
              <span class="label-text-alt"
                >Upload your logo (GIF, PNG, or JPG - max 80x80px recommended)</span
              >
            </div>
            {#if logoPreview}
              <div class="mt-4 flex items-center gap-4">
                <div>
                  <p class="text-sm font-semibold mb-2">Current Logo:</p>
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    class="w-20 h-20 object-cover rounded-full border-2 border-base-300"
                  />
                </div>
                <button class="btn btn-primary btn-sm" onclick={deleteLogo}>
                  Delete Logo
                </button>
              </div>
            {/if}
          </div>

          <div class="form-control">
            <div class="label">
              <span class="label-text font-semibold">Logo Position</span>
            </div>
            <div class="flex gap-4">
              <button
                class="btn flex-1 {logoPosition === 'left'
                  ? 'btn-primary'
                  : 'btn-outline'}"
                onclick={() => (logoPosition = "left")}
              >
                Left Side
              </button>
              <button
                class="btn flex-1 {logoPosition === 'right'
                  ? 'btn-primary'
                  : 'btn-outline'}"
                onclick={() => (logoPosition = "right")}
              >
                Right Side
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label" for="fontColor">
              <span class="label-text font-semibold">Font Color</span>
            </label>
            <div class="flex gap-4 items-center">
              <input
                id="fontColor"
                type="color"
                bind:value={fontColor}
                class="w-16 h-12 rounded cursor-pointer border-2 border-base-300"
              />
              <input
                type="text"
                bind:value={fontColor}
                class="input input-bordered flex-1"
                placeholder="#1f2937"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label" for="sidebarColor">
              <span class="label-text font-semibold">Highlight Color</span>
            </label>
            <div class="flex gap-4 items-center">
              <input
                id="sidebarColor"
                type="color"
                bind:value={sidebarColor}
                class="w-16 h-12 rounded cursor-pointer border-2 border-base-300"
              />
              <input
                type="text"
                bind:value={sidebarColor}
                class="input input-bordered flex-1"
                placeholder="#4b5563"
              />
            </div>
          </div>
        {:else if activeTab === "social"}
          <!-- Social Links Form -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <p class="text-base-content/70">
                Add your social media profiles to your signature
              </p>
              <button class="btn btn-primary btn-sm" onclick={addSocialLink}>
                + Add Link
              </button>
            </div>

            {#each socialLinks as link (link.id)}
              <div class="card bg-base-200 p-4">
                <div class="flex gap-4 items-start">
                  <div class="form-control flex-1">
                    <label class="label" for="platform-{link.id}">
                      <span class="label-text font-semibold">Platform</span>
                    </label>
                    <select
                      id="platform-{link.id}"
                      bind:value={link.platform}
                      class="select select-bordered"
                    >
                      <option>LinkedIn</option>
                      <option>X</option>
                      <option>Facebook</option>
                      <option>Instagram</option>
                      <option>YouTube</option>
                    </select>
                  </div>

                  <div class="form-control flex-[2]">
                    <label class="label" for="url-{link.id}">
                      <span class="label-text font-semibold">URL</span>
                    </label>
                    <input
                      id="url-{link.id}"
                      type="url"
                      bind:value={link.url}
                      class="input input-bordered w-full"
                      placeholder="https://www.linkedin.com/yourprofile"
                    />
                  </div>

                  <button
                    class="btn btn-circle btn-ghost btn-sm mt-9"
                    onclick={() => removeSocialLink(link.id)}
                    aria-label="Remove link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {:else if activeTab === "template"}
          <!-- Template Selection -->
          <div class="space-y-4">
            <p class="text-base-content/70 mb-4">
              Choose a template that best represents your brand
            </p>

            {#each Object.entries(templates) as [key, template]}
              <button
                class="card bg-base-200 p-6 w-full text-left hover:shadow-lg transition-all {selectedTemplate ===
                key
                  ? 'ring-2 ring-primary bg-primary/10'
                  : ''}"
                onclick={() => (selectedTemplate = key as Template)}
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-bold mb-1">{template.name}</h3>
                    <p class="text-sm text-base-content/60">
                      {template.description}
                    </p>
                  </div>
                  {#if selectedTemplate === key}
                    <div class="badge badge-primary gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Right Side: Live Preview -->
  <div class="w-1/2 overflow-auto bg-base-200 p-8">
    <div class="sticky top-0">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Live Preview</h2>
        <button class="btn btn-primary" onclick={copySignature}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="mr-2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </button>
      </div>

      <!-- Preview Container -->
      <div class="card bg-base-100 shadow-xl p-8 mb-6">
        <div class="preview-container">
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html signatureHTML}
        </div>
        <div
          class="text-center text-sm text-base-content/50 mt-4 pt-4 border-t border-base-300"
        >
          This is how your signature will appear in emails
        </div>
      </div>

      <!-- How to Use Section -->
      <div class="collapse collapse-arrow bg-base-100 mb-4">
        <input type="checkbox" checked />
        <div class="collapse-title text-lg font-bold">How to Use This Tool</div>
        <div class="collapse-content">
          <div class="space-y-2 text-sm">
            <p class="font-semibold">Step-by-Step Instructions:</p>
            <ol class="list-decimal list-inside space-y-1 text-base-content/70">
              <li>Fill in your information in the form above</li>
              <li>Choose your preferred template style</li>
              <li>Click the "Copy Signature" button</li>
              <li>
                Open Gmail and go to Settings (gear icon) → See all settings
              </li>
              <li>Scroll down to the "Signature" section</li>
              <li>Click "Create new" or select an existing signature</li>
              <li>
                Click in the signature text box and paste (Ctrl+V or Cmd+V)
              </li>
              <li>Scroll down and click "Save Changes"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
