// Tools the Claude agent may call.
// Each tool has a definition (what the model sees) and a run function (what your code does).

const memory = [];

export function getMemory() {
  return memory.slice();
}

const handlers = {
  calculator({ expression }) {
    if (!/^[\d\s+\-*/().%]+$/.test(expression)) {
      throw new Error("Invalid characters in expression");
    }
    const value = Function(`"use strict"; return (${expression});`)();
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("Result is not a valid number");
    }
    return Math.round(value * 1e10) / 1e10;
  },

  clock() {
    return new Date().toLocaleString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  },

  remember({ fact }) {
    memory.push(fact);
    return `Saved (${memory.length} item${memory.length === 1 ? "" : "s"} in memory)`;
  },

  recall() {
    return memory.length ? memory.slice() : "Memory is empty.";
  },

  word_count({ text }) {
    return text.trim().split(/\s+/).filter(Boolean).length;
  },
};

// strict: true guarantees the model's input matches the schema exactly.
const schema = (properties = {}) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

export const toolDefinitions = [
  {
    name: "calculator",
    description: "Evaluate an arithmetic expression. Supports + - * / % and parentheses. Use this for any calculation instead of doing math yourself.",
    strict: true,
    input_schema: schema({ expression: { type: "string", description: "For example: (12 + 8) * 3" } }),
  },
  {
    name: "clock",
    description: "Get the current local date, weekday and time. You do not know the date yourself, so use this whenever it matters.",
    strict: true,
    input_schema: schema(),
  },
  {
    name: "remember",
    description: "Store one short fact about the user in long-term memory.",
    strict: true,
    input_schema: schema({ fact: { type: "string", description: "The fact to store, in the third person." } }),
  },
  {
    name: "recall",
    description: "Retrieve every fact stored in long-term memory.",
    strict: true,
    input_schema: schema(),
  },
  {
    name: "word_count",
    description: "Count the words in a piece of text.",
    strict: true,
    input_schema: schema({ text: { type: "string" } }),
  },
];

// Runs a tool and returns { result } or { error }. Never throws.
export function runTool(name, input) {
  const handler = handlers[name];
  if (!handler) return { error: `Unknown tool: ${name}` };
  try {
    return { result: handler(input) };
  } catch (err) {
    return { error: err.message };
  }
}
