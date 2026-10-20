// Agent Lab backend: serves the website and runs a Claude agent loop at POST /api/agent.
// The loop is written by hand (no tool runner) so every step is visible and easy to change.
//
// The response is NDJSON: one JSON event per line, sent as soon as it happens, e.g.
//   {"type":"thought","text":"..."}   Claude's summarized reasoning
//   {"type":"text","text":"..."}      text Claude writes between tool calls
//   {"type":"tool_call","name":"calculator","input":{...}}
//   {"type":"tool_result","name":"calculator","result":60} or {..., "error":"..."}
//   {"type":"memory","items":[...]}
//   {"type":"answer","text":"..."}
//   {"type":"error","message":"..."}
//   {"type":"done","steps":2,"usage":{...}}

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { toolDefinitions, runTool, getMemory } from "./tools.js";

const PORT = Number(process.env.PORT) || 3000;
const MODEL = "claude-opus-5-5";
const MAX_STEPS = 8; // guardrail against endless loops

const SYSTEM_PROMPT = `You are the demo agent on Agent Lab, a site where someone learns how AI agents work.
Use the tools whenever they help: you cannot know the current date or do reliable arithmetic without them.
When the user tells you something about themselves, store it with remember.
Keep the final answer short and reply in the language the user writes in.`;

const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

// Reads ANTHROPIC_API_KEY (or an `ant auth login` profile) from the environment.
const client = new Anthropic();

async function runAgent(goal, send) {
  const messages = [{ role: "user", content: goal }];
  const usage = { input_tokens: 0, output_tokens: 0 };

  for (let step = 1; step <= MAX_STEPS; step++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      tools: toolDefinitions,
      thinking: { type: "adaptive", display: "summarized" }, // show readable reasoning in the trace
      output_config: { effort: "low" }, // the demo tasks are simple; raise for harder ones
      // If a safety classifier declines, the API retries on a suitable fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages,
    });

    usage.input_tokens += response.usage.input_tokens;
    usage.output_tokens += response.usage.output_tokens;

    for (const block of response.content) {
      if (block.type === "thinking" && block.thinking) send({ type: "thought", text: block.thinking });
      if (block.type === "text" && response.stop_reason === "tool_use") send({ type: "text", text: block.text });
    }

    // Always append the full content (including thinking blocks) unchanged.
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "refusal") {
      send({ type: "error", message: "Claude declined this request." });
      return send({ type: "done", steps: step, usage });
    }

    if (response.stop_reason !== "tool_use") {
      const answer = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
      send({ type: "answer", text: answer || "(no answer)" });
      return send({ type: "done", steps: step, usage });
    }

    // Run every tool call from this turn and send all results back in one user message.
    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      send({ type: "tool_call", name: block.name, input: block.input });

      const { result, error } = runTool(block.name, block.input);
      send({ type: "tool_result", name: block.name, ...(error ? { error } : { result }) });
      if (block.name === "remember") send({ type: "memory", items: getMemory() });

      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: error ?? JSON.stringify(result),
        ...(error && { is_error: true }),
      });
    }
    messages.push({ role: "user", content: toolResults });
  }

  send({ type: "error", message: `Stopped after the maximum of ${MAX_STEPS} steps.` });
  send({ type: "done", steps: MAX_STEPS, usage });
}

async function handleAgent(req, res) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 10_000) return sendJson(res, 413, { error: "Request too large" });
  }

  let goal;
  try {
    goal = String(JSON.parse(body).goal ?? "").trim();
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON" });
  }
  if (!goal || goal.length > 2000) return sendJson(res, 400, { error: "Goal must be 1-2000 characters" });

  res.writeHead(200, { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache" });
  const send = (event) => res.write(JSON.stringify(event) + "\n");

  try {
    await runAgent(goal, send);
  } catch (err) {
    console.error(err);
    let message = "Something went wrong while calling Claude.";
    if (err instanceof Anthropic.AuthenticationError) message = "No valid API key. Check agent/.env.";
    else if (err instanceof Anthropic.RateLimitError) message = "Rate limited. Try again in a moment.";
    else if (err instanceof Anthropic.APIError) message = `API error ${err.status}: ${err.message}`;
    else if (err instanceof Anthropic.AnthropicError) message = err.message;
    send({ type: "error", message });
  }
  res.end();
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const filePath = path.resolve(SITE_DIR, "." + (urlPath === "/" ? "/index.html" : urlPath));

  // Only serve files from the site folder, and never the agent folder itself.
  const relative = path.relative(SITE_DIR, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative) || relative.split(path.sep)[0] === "agent") {
    return sendJson(res, 404, { error: "Not found" });
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    sendJson(res, 404, { error: "Not found" });
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/agent") return handleAgent(req, res);
  if (req.method === "GET" && req.url === "/api/health") return sendJson(res, 200, { ok: true, model: MODEL });
  if (req.method === "GET") return serveStatic(req, res);
  sendJson(res, 405, { error: "Method not allowed" });
});

// Listen on localhost only, so nobody else on the network can use your API key.
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Agent Lab running at http://localhost:${PORT}`);
});
