import { _ as current_component, Y as ensure_array_like, X as stringify, R as pop, P as push, S as head } from "../../../../chunks/index.js";
import { marked } from "marked";
import { e as escape_html } from "../../../../chunks/escaping.js";
import { a as attr } from "../../../../chunks/attributes.js";
import { h as html } from "../../../../chunks/html.js";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
function MeetingAssistant($$payload, $$props) {
  push();
  let visibleSources, conversationStarters;
  let messageInput = "";
  let messages = [];
  let loading = false;
  let selectedModel = "google/gemini-2.5-flash";
  let availableModels = [];
  let modelSearchQuery = "";
  let currentSources = [];
  let selectedSourceId = null;
  let allMeetings = [];
  let selectedMeetingIds = [];
  let totalSessionCost = 0;
  let filteredMeetingNames = [];
  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("click", handleWindowClick);
    }
  });
  function getFilterButtonText() {
    if (selectedMeetingIds.length === 0) {
      return `All Meetings (${allMeetings.length})`;
    }
    return `${selectedMeetingIds.length} Meeting${selectedMeetingIds.length !== 1 ? "s" : ""} Selected`;
  }
  function handleWindowClick(event) {
  }
  function getSelectedModelName() {
    const model = availableModels.find((m) => m.id === selectedModel);
    return model ? model.name : selectedModel;
  }
  const PRICING_RATES = {
    "google/gemini-2.5-flash": { prompt: 0.1, completion: 0.4 },
    "google/gemini-3-flash-preview": { prompt: 0.2, completion: 0.8 },
    "anthropic/claude-haiku-4.5": { prompt: 0.25, completion: 1.25 },
    "anthropic/claude-sonnet-4.5": { prompt: 3, completion: 15 },
    "openai/gpt-5-mini": { prompt: 0.5, completion: 1.5 },
    "openai/gpt-5.2": { prompt: 5, completion: 15 },
    "deepseek/deepseek-v3.2": { prompt: 0.14, completion: 0.28 },
    "deepseek/deepseek-r1": { prompt: 0.5, completion: 2 }
  };
  function calculateCost(usage, modelId) {
    const rates = PRICING_RATES[modelId] || { prompt: 0, completion: 0 };
    const promptCost = usage.prompt_tokens / 1e6 * rates.prompt;
    const completionCost = usage.completion_tokens / 1e6 * rates.completion;
    const total = promptCost + completionCost;
    if (total < 0.01) return "< $0.01";
    return `$${total.toFixed(4)}`;
  }
  function getCostValue(usage, modelId) {
    const rates = PRICING_RATES[modelId] || { prompt: 0, completion: 0 };
    const promptCost = usage.prompt_tokens / 1e6 * rates.prompt;
    const completionCost = usage.completion_tokens / 1e6 * rates.completion;
    return promptCost + completionCost;
  }
  function renderWithCitations(content) {
    let processedContent = content.replace(/\]\],?\s*\[/g, "]] [[");
    processedContent = processedContent.replace(/\[(\[.*?\])(?:,\s*)(\[.*?\])\]/g, "$1] [$2");
    let html2 = marked.parse(processedContent);
    const groupRegex = /((?:\[\[[^\]]+\]\]\s*)+)/g;
    html2 = html2.replace(groupRegex, (match) => {
      const items = [];
      const individualRegex2 = /\[\[(.*?)\]\]/g;
      let m2;
      while ((m2 = individualRegex2.exec(match)) !== null) {
        const inner = m2[1];
        let name = inner;
        const dateRegexVal = /,\s*\d{4}-\d{2}-\d{2}.*$/;
        if (dateRegexVal.test(inner)) {
          name = inner.replace(dateRegexVal, "").trim();
        } else if (inner.includes(",")) {
          name = inner.split(",")[0].trim();
        }
        if (!items.find((i) => i.name === name)) {
          items.push({ name, text: inner });
        }
      }
      if (items.length === 0) return match;
      const finalCount = items.length;
      const badgeHtml = finalCount > 1 ? `<span class="inline-flex items-center justify-center bg-primary ml-0.5 text-white text-[9px] font-bold h-3.5 min-w-[14px] px-0.5 rounded-full -translate-y-1">${finalCount}</span>` : "";
      const tooltipText = items.map((i) => {
        let txt = i.text.replace(/^\[+|\]+$/g, "").trim();
        return txt.replace(/(\d{4}-\d{2}-\d{2})T[\d:.]+Z?/, "$1");
      }).join("\n");
      const meetingsData = items.map((i) => i.name).join("||");
      const dataAttr = meetingsData.replace(/"/g, "&quot;");
      return `<button class="citation-link text-primary hover:text-primary-focus inline-flex items-center cursor-pointer mx-0.5 align-middle relative" data-meetings="${dataAttr}" data-tooltip="${tooltipText.replace(/"/g, "&quot;")}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>${badgeHtml}
            </button>`;
    });
    return html2;
  }
  let copiedIndex = null;
  function parseTranscriptMeta(text) {
    let videoUrl = null;
    let duration = "";
    let transcript = text;
    const urlMatch = text.match(/<?(https?:\/\/fathom\.video\/[^\s>]+)>?/);
    if (urlMatch) {
      videoUrl = urlMatch[1];
    }
    const transcriptStartMatch = text.match(/\/\s*\d{2}:\d{2}:\d{2}/);
    if (transcriptStartMatch && transcriptStartMatch.index !== void 0) {
      transcript = text.substring(transcriptStartMatch.index);
    }
    const timecodes = transcript.match(/\d{2}:\d{2}:\d{2}/g);
    if (timecodes && timecodes.length > 0) {
      const lastTime = timecodes[timecodes.length - 1];
      const [hours, mins, secs] = lastTime.split(":").map(Number);
      const totalMins = hours * 60 + mins + (secs > 0 ? 1 : 0);
      duration = totalMins >= 60 ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` : `${totalMins}m`;
    }
    return { videoUrl, duration, transcript };
  }
  function formatTranscript(text) {
    let formatted = text.replace(/--\s*\[image:.*?$/s, "").trim();
    formatted = formatted.replace(/RAIZOR.*$/s, "").trim();
    formatted = formatted.replace(/[\r\n]+/g, " ").trim();
    formatted = formatted.replace(/\s*\/?\s*\b(\d{2}:\d{2}:\d{2})\b/g, "\n\n$1");
    return formatted.trim();
  }
  let copiedSourceId = null;
  visibleSources = filteredMeetingNames.length > 0 ? currentSources.filter((s) => filteredMeetingNames.some((n) => {
    const cleanSource = s.meeting_name.trim();
    const cleanFilter = n.trim();
    return cleanSource === cleanFilter || cleanSource.includes(cleanFilter) || cleanFilter.includes(cleanSource);
  })) : currentSources;
  conversationStarters = selectedMeetingIds.length > 0 ? [
    `Summarize ${selectedMeetingIds.length === 1 ? "this meeting" : "these meetings"}`,
    "What were the key takeaways?",
    "List all action items mentioned",
    "Write a summary email to the team",
    "Write a follow up email to the attendee(s)"
  ] : [
    "What was my last meeting about?",
    "What were last week's action items?",
    "How was my leadership style last week?",
    "How has team sentiment been recently?"
  ];
  availableModels.filter((m) => m.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) || m.id.toLowerCase().includes(modelSearchQuery.toLowerCase()));
  {
    let sum = 0;
    messages.forEach((msg) => {
      if (msg.usage && msg.model) {
        sum += getCostValue(msg.usage, msg.model);
      }
    });
    totalSessionCost = sum;
  }
  const each_array_2 = ensure_array_like(messages);
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col lg:flex-row h-full relative overflow-hidden"><div class="flex-1 flex flex-col bg-base-100 min-w-0 min-h-0">`;
  if (messages.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="h-14 border-b border-base-300 flex items-center gap-2 px-4 bg-base-100 flex-none z-10"><button class="btn btn-ghost btn-sm gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Back to Meetings</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex-1 min-h-0 overflow-y-auto p-6">`;
  if (messages.length === 0) {
    $$payload.out += "<!--[-->";
    const each_array_1 = ensure_array_like(conversationStarters);
    $$payload.out += `<div class="h-full flex flex-col items-center justify-center"><div class="w-full max-w-2xl mb-8"><div class="relative"><button class="btn bg-base-100 border-base-300 hover:bg-base-300 text-base-content w-full justify-between font-normal"><span>${escape_html(getFilterButtonText())}</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div> <div class="w-full max-w-2xl"><h3 class="text-sm font-semibold opacity-60 mb-3 text-center">Conversation Starters</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let starter = each_array_1[$$index_1];
      $$payload.out += `<button class="btn btn-sm bg-base-100 border-base-300 hover:bg-base-300 text-base-content justify-start text-left h-auto py-3 whitespace-normal font-normal">${escape_html(starter)}</button>`;
    }
    $$payload.out += `<!--]--></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <!--[-->`;
  for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
    let msg = each_array_2[i];
    $$payload.out += `<div${attr("class", `mb-6 ${stringify(msg.role === "user" ? "flex justify-end" : "")}`)}>`;
    if (msg.role === "user") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="bg-primary/10 rounded-2xl px-4 py-3 max-w-2xl"><p class="text-base-content whitespace-pre-wrap">${escape_html(msg.content)}</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="max-w-3xl"><div class="prose prose-sm max-w-none">${html(renderWithCitations(msg.content))}</div> `;
      if (msg.sources && msg.sources.length > 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex items-center gap-3 mt-2"><button class="btn btn-sm btn-ghost">📄 View Sources (${escape_html(msg.sources.length)})</button> <button class="btn btn-sm btn-ghost gap-1" title="Copy response (without citations)">`;
        if (copiedIndex === i) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="text-success text-xs">Copied!</span>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> <span class="text-xs">Copy</span>`;
        }
        $$payload.out += `<!--]--></button> `;
        if (msg.usage && msg.model) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="text-xs opacity-50 flex items-center gap-1"${attr("title", `Input: ${stringify(msg.usage.prompt_tokens)} / Output: ${stringify(msg.usage.completion_tokens)}`)}><span>💰 Cost: ${escape_html(calculateCost(msg.usage, msg.model))}</span> <span class="text-[10px]">(${escape_html(msg.usage.total_tokens)} toks)</span></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="border-t border-base-300 bg-base-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex-none z-20"><div class="max-w-3xl mx-auto"><div class="flex gap-2 items-end"><div class="relative pb-1"><button class="btn btn-sm btn-ghost"${attr("title", getSelectedModelName())} aria-label="Toggle model dropdown"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <textarea class="textarea textarea-bordered flex-1 min-h-[3rem] max-h-[200px] resize-none overflow-y-auto leading-normal py-3" placeholder="Ask"${attr("disabled", loading, true)} rows="1">`;
  const $$body = escape_html(messageInput);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <button class="btn btn-primary btn-square mb-0.5"${attr("disabled", !messageInput.trim(), true)} aria-label="Send message"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></button></div> <div class="flex justify-between items-center text-xs opacity-60 mt-2 px-1"><span>Currently selected: ${escape_html(getSelectedModelName())}</span> <span>Total used this session: $${escape_html(totalSessionCost.toFixed(4))}</span></div></div></div></div> `;
  if (messages.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_4 = ensure_array_like(visibleSources);
    $$payload.out += `<div${attr("class", ` fixed inset-y-0 right-0 z-50 w-80 bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:shadow-none lg:border-l lg:border-base-300 ${stringify("translate-x-full lg:translate-x-0")} ${stringify("lg:hidden")} `)}><div class="h-14 border-b border-base-300 flex items-center justify-between px-4 bg-base-100"><span class="font-bold">Sources (${escape_html(currentSources.length)})</span> <div class="flex items-center gap-1">`;
    if (filteredMeetingNames.length > 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="btn btn-xs btn-ghost text-primary" title="Show all sources">Show All</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <button class="btn btn-sm btn-ghost btn-square" aria-label="Close panel"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div></div> <div class="h-[calc(100%-3.5rem)] overflow-y-auto p-4 space-y-3 bg-base-100"><!--[-->`;
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let source = each_array_4[$$index_4];
      const meta = parseTranscriptMeta(source.text);
      const meetingDate = new Date(source.meeting_date);
      $$payload.out += `<div${attr("class", `rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${stringify(selectedSourceId === source.id ? "bg-base-200 border-primary shadow-md" : "bg-base-200 border-transparent hover:bg-base-300 hover:border-primary/30")}`)} role="button" tabindex="0"><div class="p-3"><div class="flex justify-between items-start mb-1"><h4${attr("class", `font-medium text-sm leading-tight text-base-content ${stringify(selectedSourceId === source.id ? "!text-primary" : "")}`)}>${escape_html(source.meeting_name)}</h4> <div class="text-[10px] text-base-content/60 whitespace-nowrap ml-2 text-right"><div>${escape_html(meetingDate.toLocaleDateString())}</div> `;
      if (meta.duration) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="text-base-content/40">${escape_html(meta.duration)} • ${escape_html(meetingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}</div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div> `;
      if (selectedSourceId === source.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="text-xs mt-2 text-base-content/80 bg-base-100 p-3 rounded border border-base-content/10 max-h-60 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">${escape_html(formatTranscript(meta.transcript))}</div> <div class="flex justify-between items-center mt-2 pt-2 border-t border-base-300">`;
        if (meta.videoUrl) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<a${attr("href", meta.videoUrl)} target="_blank" rel="noopener noreferrer" class="text-xs text-primary hover:underline flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Video link</a>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<span></span>`;
        }
        $$payload.out += `<!--]--> <button class="btn btn-xs btn-ghost gap-1 text-base-content/60 hover:text-primary">`;
        if (copiedSourceId === source.id) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-success" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="text-success">Copied!</span>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy`;
        }
        $$payload.out += `<!--]--></button></div>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<div class="text-xs text-base-content/50 line-clamp-2">${escape_html(meta.transcript.substring(0, 100).replace(/[\r\n]+/g, " ") + "...")}</div>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--> `;
    if (visibleSources.length === 0 && currentSources.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-center p-8 text-base-content/40 text-sm">No sources available yet.</div>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (visibleSources.length === 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="text-center p-8 text-base-content/40 text-sm">No sources match the current filter.</div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Meeting Assistant | Dougie's Tool Hub</title>`;
  });
  $$payload.out += `<div class="h-full">`;
  MeetingAssistant($$payload);
  $$payload.out += `<!----></div>`;
}
export {
  _page as default
};
