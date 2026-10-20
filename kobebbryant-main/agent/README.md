# Agent Lab: Claude agent

A small Node.js server. It serves the website and runs a real Claude agent at `POST /api/agent`. The API key stays on the server and never reaches the browser.

## Setup

1. Install [Node.js](https://nodejs.org) 22.9 or newer (LTS).
2. Install the dependencies:
   ```sh
   cd agent
   npm install
   ```
3. Copy `.env.example` to `.env` and put your own Anthropic API key in it. `.env` is in `.gitignore`. Never commit it and never share it.
4. Start the server:
   ```sh
   npm start
   ```
5. Open http://localhost:3000, go to the demo and choose **Claude (real LLM)**.

## How it works

| File        | Contents |
|-------------|----------|
| `tools.js`  | The 5 tools: the definitions Claude sees (name, description, JSON schema) and the code that runs them |
| `server.js` | The agent loop in `runAgent()` and the web server |

This is the loop in `runAgent()`:

1. Send the goal, the system prompt and the tool definitions to Claude.
2. Claude replies with thinking, text and/or `tool_use` blocks.
3. If `stop_reason` is `tool_use`, run every tool, send the results back as `tool_result` blocks and go to step 1.
4. Otherwise Claude is done: its text is the answer.
5. Stop after `MAX_STEPS` model calls, whatever happens.

Every step is streamed to the browser as one JSON line, so you see the trace live.

## Settings in server.js

- **`MODEL`**: `claude-opus-5-5`.
- **`effort: "low"`**: the demo tasks are simple. Raise it for harder tasks; that costs more tokens.
- **`display: "summarized"`**: shows a readable summary of Claude's reasoning as "Thought" in the trace.
- **`fallbacks: "default"`**: if a safety classifier declines a request, the API retries it on a suitable fallback model.

## Ideas to try next

- Add a tool, for example `get_weather` or `search_notes`, in `tools.js`.
- Give Claude two tasks at once and see whether it calls tools in parallel.
- Add a tool that needs your approval before it runs (human in the loop).
- Save the memory to a file so it survives a restart.
