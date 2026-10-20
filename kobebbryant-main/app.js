// Agent Lab: a rule-based demo agent and a learning path with progress tracking.
// No real LLM runs here. The plan() function plays the role of the model.

(() => {
  "use strict";

  const MAX_STEPS = 6;
  const STEP_DELAY_MS = 550;

  // ---------- Tools ----------
  // Each tool has a name, a description and a run function,
  // just like the tools you define for a real LLM.
  const memory = [];

  const tools = {
    calculator: {
      description: "Evaluates a math expression (+ - * / % and parentheses).",
      run({ expression }) {
        if (!/^[\d\s+\-*/().%]+$/.test(expression)) {
          throw new Error("Invalid characters in expression");
        }
        const value = Function(`"use strict"; return (${expression});`)();
        if (typeof value !== "number" || !Number.isFinite(value)) {
          throw new Error("Result is not a valid number");
        }
        return Math.round(value * 1e10) / 1e10;
      },
    },
    clock: {
      description: "Returns the current date, day and time.",
      run() {
        return new Date().toLocaleString("en-GB", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
      },
    },
    remember: {
      description: "Stores a fact in the agent's memory.",
      run({ fact }) {
        memory.push(fact);
        renderMemory();
        return `Saved (${memory.length} item${memory.length === 1 ? "" : "s"} in memory)`;
      },
    },
    recall: {
      description: "Retrieves everything stored in memory.",
      run() {
        return memory.slice();
      },
    },
    word_count: {
      description: "Counts the words in a piece of text.",
      run({ text }) {
        return text.trim().split(/\s+/).filter(Boolean).length;
      },
    },
  };

  // ---------- "Model": picks the next step ----------
  // Returns { thought, tool, input }, or { thought, final } when the agent is done.
  function plan(goal, history) {
    const done = new Set(history.map((h) => h.tool));
    const lower = goal.toLowerCase();

    const mathMatch = goal.match(/[\d(][\d\s+\-*/().%]*[\d)]/g)
      ?.find((m) => /[+\-*/%]/.test(m));
    if (mathMatch && !done.has("calculator")) {
      return {
        thought: `I see a calculation: "${mathMatch.trim()}". I'll work it out with the calculator.`,
        tool: "calculator",
        input: { expression: mathMatch.trim() },
      };
    }

    if (/\b(time|date|day|today)\b/.test(lower) && !done.has("clock")) {
      return {
        thought: "The question is about the date or time. I don't know that by myself, so I'll use the clock.",
        tool: "clock",
        input: {},
      };
    }

    const rememberMatch = goal.match(/remember(?: that)?\s+(.+)/i);
    if (rememberMatch && !done.has("remember")) {
      return {
        thought: "The user wants me to remember something. I'll store it in my memory.",
        tool: "remember",
        input: { fact: rememberMatch[1].replace(/[.!]+$/, "") },
      };
    }

    if (/(what do you know|recall|memory|about me)/.test(lower) && !rememberMatch && !done.has("recall")) {
      return {
        thought: "The user asks what I know. I'll look in my memory.",
        tool: "recall",
        input: {},
      };
    }

    const quoted = goal.match(/["“](.+?)["”]/);
    if (/words/.test(lower) && quoted && !done.has("word_count")) {
      return {
        thought: "I need to count the words in the quoted text.",
        tool: "word_count",
        input: { text: quoted[1] },
      };
    }

    return { thought: history.length
      ? "I have all the information I need. Time to answer."
      : "None of my tools fit this goal. I'll be honest about what I can't do.",
      final: composeAnswer(history) };
  }

  function composeAnswer(history) {
    if (!history.length) {
      return "I can't do that. My tools are: math, date/time, remember, recall and word count. A real LLM would handle this much more flexibly.";
    }
    const parts = history.map(({ tool, result, error }) => {
      if (error) return `The ${tool} tool returned an error: ${error}.`;
      switch (tool) {
        case "calculator": return `The result is ${result}.`;
        case "clock": return `It is now ${result}.`;
        case "remember": return "Got it, I'll remember that.";
        case "recall": return result.length
          ? `Here is what I know about you: ${result.join("; ")}.`
          : "I don't know anything about you yet. Try: \"Remember that ...\"";
        case "word_count": return `The text contains ${result} words.`;
        default: return String(result);
      }
    });
    return parts.join(" ");
  }

  // ---------- Agent loop ----------
  async function runAgent(goal) {
    const history = [];
    for (let step = 1; step <= MAX_STEPS; step++) {
      const decision = plan(goal, history);
      await addTrace("think", `Thought (step ${step})`, decision.thought);

      if (decision.final) {
        await addTrace("answer", "Answer", decision.final);
        return;
      }

      await addTrace("act", "Action", `<code>${decision.tool}(${escapeHtml(JSON.stringify(decision.input))})</code>`, true);

      const entry = { tool: decision.tool, input: decision.input };
      try {
        entry.result = tools[decision.tool].run(decision.input);
        await addTrace("observe", "Observation", JSON.stringify(entry.result));
      } catch (err) {
        entry.error = err.message;
        await addTrace("observe", "Observation", `Error: ${err.message}`);
      }
      history.push(entry);
    }
    await addTrace("answer", "Stopped", `Reached the maximum of ${MAX_STEPS} steps. This is a guardrail against endless loops.`);
  }

  // ---------- UI ----------
  const $ = (sel) => document.querySelector(sel);
  const form = $("#agent-form");
  const input = $("#goal");
  const trace = $("#trace");
  const status = $("#status");
  const submitBtn = form.querySelector('button[type="submit"]');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function wait(ms) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  }

  async function addTrace(kind, label, content, isHtml = false, delay = STEP_DELAY_MS) {
    if (delay) await wait(delay);
    const li = document.createElement("li");
    li.className = kind;
    li.innerHTML = `<span class="tag">${label}</span>${isHtml ? content : escapeHtml(content)}`;
    trace.appendChild(li);
  }

  function renderTools() {
    $("#tool-list").innerHTML = Object.entries(tools)
      .map(([name, t]) => `<li><code>${name}</code><span>${escapeHtml(t.description)}</span></li>`)
      .join("");
  }

  function renderMemory(items = currentMode() === "claude" ? claudeMemory : memory) {
    $("#memory").innerHTML = items.length
      ? items.map((m) => `<li>• ${escapeHtml(m)}</li>`).join("")
      : '<li class="muted">Empty</li>';
  }

  // ---------- Claude mode ----------
  // The real agent runs in agent/server.js. It streams one JSON event per line,
  // and we show each event in the trace as soon as it arrives.
  let claudeMemory = [];
  const claudeRadio = document.querySelector('input[name="mode"][value="claude"]');
  const modeNote = $("#mode-note");

  const currentMode = () => document.querySelector('input[name="mode"]:checked').value;

  async function runClaudeAgent(goal) {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });
    if (!res.ok || !res.body) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error || `Server returned ${res.status}`);
    }

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    let summary = "Done";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (line.trim()) summary = showClaudeEvent(JSON.parse(line)) ?? summary;
      }
    }
    return summary;
  }

  // Returns a status summary for the "done" event, otherwise nothing.
  function showClaudeEvent(ev) {
    switch (ev.type) {
      case "thought": addTrace("think", "Thought", ev.text, false, 0); break;
      case "text": addTrace("think", "Claude says", ev.text, false, 0); break;
      case "tool_call":
        addTrace("act", "Action", `<code>${escapeHtml(ev.name)}(${escapeHtml(JSON.stringify(ev.input))})</code>`, true, 0);
        break;
      case "tool_result":
        addTrace("observe", "Observation", ev.error ? `Error: ${ev.error}` : JSON.stringify(ev.result), false, 0);
        break;
      case "memory": claudeMemory = ev.items; renderMemory(); break;
      case "answer": addTrace("answer", "Answer", ev.text, false, 0); break;
      case "error": addTrace("answer", "Error", ev.message, false, 0); break;
      case "done":
        return `Done: ${ev.steps} model call${ev.steps === 1 ? "" : "s"}, ` +
          `${ev.usage.input_tokens} in / ${ev.usage.output_tokens} out tokens`;
    }
  }

  async function checkServer() {
    if (location.protocol === "file:") {
      claudeRadio.disabled = true;
      modeNote.textContent = "Start the server in agent/ and open http://localhost:3000 to use Claude.";
      return;
    }
    try {
      const res = await fetch("/api/health");
      const { model } = await res.json();
      modeNote.textContent = `Server connected, model: ${model}`;
    } catch {
      claudeRadio.disabled = true;
      modeNote.textContent = "Agent server not reachable.";
    }
  }

  document.querySelectorAll('input[name="mode"]').forEach((radio) => {
    radio.addEventListener("change", () => renderMemory());
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const goal = input.value.trim();
    if (!goal) return input.focus();

    trace.innerHTML = "";
    submitBtn.disabled = true;
    status.textContent = "Running…";
    status.classList.add("running");
    let summary = "Done";
    try {
      if (currentMode() === "claude") summary = await runClaudeAgent(goal);
      else await runAgent(goal);
    } catch (err) {
      await addTrace("answer", "Error", err.message, false, 0);
      summary = "Failed";
    } finally {
      submitBtn.disabled = false;
      status.textContent = summary;
      status.classList.remove("running");
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.textContent;
      form.requestSubmit();
    });
  });

  renderTools();
  checkServer();

  // ---------- Learning path ----------
  const ROADMAP = [
    { title: "Basics: LLMs and prompts", level: "Beginner",
      intro: "Understand what a language model does and how to steer it.",
      items: [
        "What are tokens, the context window and temperature?",
        "Writing a system prompt",
        "Your first API call to an LLM, for example the Claude API",
      ] },
    { title: "Tool use (function calling)", level: "Beginner",
      intro: "Let the model call functions that you define.",
      items: [
        "Define a tool with a JSON schema",
        "Handle a tool call and send the result back",
        "Connect the demo on this site to a real LLM",
      ] },
    { title: "The agent loop (ReAct)", level: "Intermediate",
      intro: "Build a loop that keeps thinking and acting until the goal is reached.",
      items: [
        "Build your own agent loop with a step limit",
        "Error handling: what does the agent do when a tool fails?",
        "Explore a framework, such as the Claude Agent SDK",
      ] },
    { title: "Memory and RAG", level: "Intermediate",
      intro: "Give your agent knowledge and long-term memory.",
      items: [
        "Understand embeddings and vector search",
        "Build a small RAG pipeline over your own notes",
        "Separate short-term and long-term memory",
      ] },
    { title: "MCP and integrations", level: "Intermediate",
      intro: "Connect tools and data sources through a standard protocol.",
      items: [
        "Understand what the Model Context Protocol is",
        "Build your own MCP server with one tool",
      ] },
    { title: "Multi-agent systems", level: "Advanced",
      intro: "Have several agents with their own roles work together.",
      items: [
        "The orchestrator-worker pattern",
        "Build a planner agent and an executor agent",
      ] },
    { title: "Evaluation and safety", level: "Advanced",
      intro: "Make your agent measurable, reliable and safe.",
      items: [
        "Write a small set of evals for your agent",
        "Understand prompt injection and how to defend against it",
        "Add human approval for risky actions",
      ] },
  ];

  const STORAGE_KEY = "agentlab-progress-v1";

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
  }

  const progress = loadProgress();

  function renderRoadmap() {
    $("#roadmap").innerHTML = ROADMAP.map((stage, si) => `
      <article class="stage">
        <h3>${si + 1}. ${escapeHtml(stage.title)} <small>${stage.level}</small></h3>
        <p>${escapeHtml(stage.intro)}</p>
        <ul>
          ${stage.items.map((item, ii) => {
            const id = `${si}-${ii}`;
            return `<li><label><input type="checkbox" data-id="${id}" ${progress[id] ? "checked" : ""}><span>${escapeHtml(item)}</span></label></li>`;
          }).join("")}
        </ul>
      </article>`).join("");
    updateProgressBar();
  }

  function updateProgressBar() {
    const total = ROADMAP.reduce((n, s) => n + s.items.length, 0);
    const done = Object.values(progress).filter(Boolean).length;
    const pct = Math.round((done / total) * 100);
    $("#progress-bar").style.width = `${pct}%`;
    $("#progress-label").textContent = `${pct}%`;
  }

  $("#roadmap").addEventListener("change", (e) => {
    if (!e.target.matches("input[type=checkbox]")) return;
    progress[e.target.dataset.id] = e.target.checked;
    saveProgress(progress);
    updateProgressBar();
  });

  renderRoadmap();
})();
