# PEACH_PULSE.AI — Premium AI Code Cockpit

PEACH_PULSE.AI is a high-speed, Flask-powered local coding studio and intelligence command deck. It is designed with a premium, high-luminance dark neon peach aesthetic and optimized with macOS-inspired typography, responsive page sections, and animated telemetry feeds. 

The application utilizes a powerful Python-LangChain agent that interfaces with Groq Cloud Llama models to generate clean code, deconstruct complex backend algorithms, and debug traces.

---

## ⚡ Technology Stack

### Backend Architecture
- **Language**: Python 3.11+
- **API Routing**: Flask micro-framework (Blueprints system, templates rendering)
- **AI Agentic Layer**: LangChain framework (structured prompt orchestration and API integration)
- **Environment**: python-dotenv (runtime secrets configuration)
- **Model Inference Gateway**: Groq Cloud API (Llama-3-70b-versatile / Llama-3-8b-instant)

### Frontend Cockpit
- **Structure**: Semantic HTML5 markup
- **Styling**: Vanilla CSS3 Custom properties
  - Dark neon peach color palette (`#080404`, `#ff6f59`, `#ffa07a`)
  - Typography: macOS System stacks (`SF Pro Display`, `SF Pro Text`, `Outfit`)
  - 3D Tilt surface effect (perspective rotate transforms)
  - Keyframes for grid scans, pulses, glowing shadows, and status rings
- **Logics & Dynamics**: Vanilla JavaScript
  - IntersectionObserver for scroll-triggered slide-ins
  - Simulated active diagnostics stats updates
  - Interactive simulated CLI terminal emulator
  - LocalStorage caching for session history retention (auto-restorable)
  - Prism.js customized syntax highlight skins
  - Marked.js parsing engine with raw text fallback toggles

---

## 📂 Project Directory Structure

```text
my llm/
├── app/                        # Main Flask Application
│   ├── routes/
│   │   └── code_routes.py      # Flask Blueprint routes (GET/POST)
│   ├── services/               # Core intelligence services (LangChain)
│   │   ├── code_generator.py   # Code generation API
│   │   ├── error_solver.py     # Bug debugging script
│   │   └── logic_explainer.py  # Code logic flow deconstructor
│   ├── static/                 # Static assets
│   │   ├── css/
│   │   │   └── style.css       # Neon Peach layout stylesheet
│   │   └── js/
│   │       └── main.js         # Interactive script and observer
│   └── templates/
│       └── index.html          # Main Jinja2 dashboard template
├── mihir/                      # Python virtual environment (venv)
├── .env                        # Secret keys (GROQ_API_KEY)
├── requirements.txt            # Python requirements manifest
├── run.py                      # Flask runner file
└── start.bat                   # Double-click Windows startup script
```

---

## 🚀 Getting Started & Local Operations

### Prerequisites
1. Ensure **Python 3.11+** is installed on your local machine.
2. An active **Groq API Key**. Get one from [Groq Console](https://console.groq.com/).

### Setup Configuration
1. Rename or open the `.env` file in the root workspace folder.
2. Insert your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_goes_here
   ```

### 🖱️ Single-Click Execution (Windows)
We have added a custom start script. Double-click the file in your explorer:

```text
start.bat
```

**What this batch script does:**
1. Starts the Flask backend in a separate terminal titled `PEACH_PULSE.AI Backend Server` running:
   ```powershell
   .\mihir\Scripts\python.exe run.py
   ```
2. Waits 3 seconds to ensure the server finishes spin-up.
3. Automatically opens the client cockpit in your default web browser at:
   ```text
   http://127.0.0.1:5000/
   ```
4. Exits the startup window, leaving the server process running cleanly.

*To close the application, simply close the open Python server console window.*

---

## 💎 Features Checklist

1. **Dashboard Sections (7 Pages)**:
   - **Command Deck (Hero Section)**: Dynamic floating orbits, animated code labels, and single-click focus triggers.
   - **Coding Cockpit**: Dual-panel workflow containing the code specification editor and response renderer.
   - **Core Spectrum**: Fast selector nodes for switching modes (Generate, Explain, Debug).
   - **Pulse Tech Engine**: Interactive spec nodes showcasing stack architectures.
   - **Real-time Diagnostics**: Animated telemetry bars showing token-rates, uptime metrics, and TLS connection indicators.
   - **Sandbox Terminal**: Clickable, typing simulated command CLI showing model operations logs.
   - **Partnership Plans**: Visual grids showcasing price structures.
   - **Lab Credits**: Styled developer credits and signature card for *Mihir Das*.
2. **Apple Typographies**: Fully integrated with high-end, rounded system typography stacks (`Outfit`, `-apple-system`, `SF Pro Display`).
3. **Responsive Adaptive View**: Flexible breakpoints that auto-wrap panels, collapse sidebars, and stack grids on tablet and mobile viewports.
4. **Session History Cache**: Sessions are compiled and cached in browser storage. Clicking a history item fully restores the prompts and generation answers.
5. **Solutions Export**: Clipboard copy controls and single-click file downloads with auto-detect file extensions.
