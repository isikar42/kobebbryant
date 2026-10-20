# kobebbryant
Personal projects

## Agent Lab

A static website for learning about AI agents. You don't need a build step or any dependencies.

- **Explanation**: what an agent is and how the agent loop works.
- **Demo**: a rule-based agent that picks tools (calculator, clock, memory, word count). You see every step: thought, action, observation and answer.
- **Learning path**: seven stages, from the basics to multi-agent systems and evals. Your progress is saved in the browser.

### Running it

Double-click `index.html`, or start a local server in this folder:

```sh
npx serve .            # Node
python -m http.server  # Python
```

### Files

| File         | Contents                                         |
|--------------|--------------------------------------------------|
| `index.html` | Structure and text of the site                   |
| `styles.css` | Styling (light and dark theme)                   |
| `app.js`     | Demo agent (tools, `plan()`, loop) and learning path |

### Claude agent

The [`agent/`](agent/) folder has a Node.js backend that runs a real Claude agent with the same tools. Start it there (see [agent/README.md](agent/README.md)), open http://localhost:3000 and choose **Claude (real LLM)** in the demo. Opening `index.html` directly only gives you the simulated agent.
