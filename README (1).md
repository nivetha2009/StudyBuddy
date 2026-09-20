# StudyBuddy

An AI-powered study platform for school and college students. Upload a chapter, a slide deck or your own notes, and turn it into explanations, revision notes, MCQs, flashcards, timed quizzes and an exam pack.

StudyBuddy runs **without an AI API key** thanks to a built-in demo mode, so you can explore every screen before connecting a provider.

---

## What it does

| Tool | What a student gets |
| --- | --- |
| **AI Tutor** | A chat tutor with six answer styles: explain simply, explain in detail, give an example, exam answer, summarize, ask me questions. |
| **Study materials** | Upload PDF, PPTX, DOCX, TXT or MD. The text is extracted and used as the primary source for every other tool. |
| **Smart notes** | Structured notes (quick revision, detailed, beginner, exam) with definitions, examples, key terms and likely exam questions. Downloadable. |
| **MCQ generator** | Choose count, difficulty (Easy / Medium / Hard / HOTS) and type (conceptual, application-based, logical, case-based, assertion & reason). Answers stay hidden until submission. |
| **Flashcards** | Flip animation, previous/next, shuffle, mark easy or difficult, progress indicator, keyboard shortcuts. |
| **Quiz mode** | Timer, question counter, progress bar, question navigator, and a results dashboard with topic-wise performance. |
| **Exam prep** | Enter subject, module, topics, exam date, marks pattern and your university pattern to get 2 / 5 / 10-mark questions, definitions, HOTS questions and a revision checklist. |
| **Dashboard** | Questions asked, quizzes completed, average score, materials, flashcards, study streak, score chart, accuracy by topic and weak topics. |

### Grounding in your own material
When a material is selected, the prompt instructs the model to treat it as the primary source and to open its answer with one of:

- `Source: your material — <file name>`
- `Source: general knowledge (not found in your material)`

So a student can always tell whether an answer came from their syllabus.

---

## Technology

- **Frontend** — React 18, Vite 5, Tailwind CSS 3, React Router, Recharts, lucide-react, react-markdown
- **Backend** — Node.js 18+, Express 4, Multer, pdf-parse, mammoth, adm-zip, express-rate-limit
- **AI** — provider-agnostic service layer: OpenAI (and any OpenAI-compatible API), Anthropic, Google Gemini, or demo mode

The browser never talks to an AI provider and never sees an API key. It calls the Express API, and Express calls the provider.

---

## Folder structure

```
studybuddy/
├── package.json              # root scripts: run client + server together
├── vercel.json               # Vercel build, function and SPA-rewrite config
├── .vercelignore
├── .gitignore
├── README.md
├── api/
│   └── [...path].js          # Vercel serverless entry: mounts the Express app
├── client/                   # React + Vite frontend
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js        # dev proxy: /api -> localhost:5000
│   ├── vercel.json           # SPA rewrite for Vercel
│   ├── public/
│   │   ├── favicon.svg
│   │   └── _redirects        # SPA rewrite for Netlify
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           # routes
│       ├── index.css         # design tokens + Tailwind layers
│       ├── components/       # Navbar, Footer, cards, flashcard, quiz UI...
│       ├── context/          # ThemeContext, ToastContext, StudyContext
│       ├── data/             # landing page copy
│       ├── pages/            # Home, Tutor, Materials, Notes, McqGenerator,
│       │                     # Flashcards, Quiz, ExamPrep, Dashboard, Login, NotFound
│       ├── services/api.js   # every network call lives here
│       └── utils/            # storage, formatting, download helpers
└── server/                   # Express backend
    ├── .env.example
    ├── uploads/              # runtime upload folder (git-ignored)
    └── src/
        ├── index.js          # entry point
        ├── app.js            # express app, CORS, JSON, routes, error handling
        ├── config/env.js     # the only file that reads process.env
        ├── routes/           # health, ai, materials
        ├── controllers/      # request handling + validation
        ├── services/
        │   ├── aiService.js      # provider routing + response normalisation
        │   ├── documentService.js# PDF / DOCX / PPTX / TXT extraction
        │   ├── materialStore.js  # in-memory material store
        │   └── providers/        # demo, openai, anthropic, gemini, httpClient
        ├── prompts/          # tutor, notes, mcq, flashcards, exam prompts
        ├── middleware/       # upload, validation, rate limiting, errors
        └── utils/            # ApiError, JSON extraction, text, logger
```

---

## Installation

Requires **Node.js 18.17 or newer** (Node 20+ recommended) and npm.

```bash
git clone https://github.com/<your-username>/studybuddy.git
cd studybuddy

# install root, server and client dependencies
npm run install:all
```

Or install each part separately:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

### Environment files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env   # optional for local development
```

---

## Running locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

Vite proxies `/api` to the Express server, so no CORS setup is needed in development.

Run them separately if you prefer:

```bash
npm --prefix server run dev
npm --prefix client run dev
```

---

## Environment variables

### `server/.env`

| Variable | Required | Default | What it does |
| --- | --- | --- | --- |
| `PORT` | no | `5000` | Port for the Express API. |
| `NODE_ENV` | no | `development` | `production` disables request logging. |
| `CLIENT_ORIGIN` | no | `http://localhost:5173` | Comma-separated list of origins allowed by CORS. Set this to your deployed frontend URL. |
| `AI_PROVIDER` | no | `demo` | `demo`, `openai`, `anthropic` or `gemini`. |
| `AI_API_KEY` | for real AI | empty | Provider API key. Empty means demo mode. |
| `AI_MODEL` | no | `gpt-4o-mini` | Model name for the chosen provider. |
| `AI_BASE_URL` | no | `https://api.openai.com/v1` | Only for OpenAI-compatible providers. |
| `AI_MAX_TOKENS` | no | `2000` | Maximum length of a generated answer. |
| `AI_TEMPERATURE` | no | `0.4` | Higher is more varied, lower is more predictable. |
| `AI_TIMEOUT_MS` | no | `60000` | Request timeout. |
| `MAX_FILE_SIZE_MB` | no | `15` | Upload size limit. |
| `UPLOAD_DIR` | no | `uploads` | Where uploaded files are written. |
| `RATE_LIMIT_WINDOW_MINUTES` | no | `15` | Rate-limit window for `/api`. |
| `RATE_LIMIT_MAX_REQUESTS` | no | `120` | Requests allowed per window. AI routes are additionally capped at 20/minute. |

### `client/.env`

| Variable | Required | Default | What it does |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | only for Option B | empty | Base URL of the API, e.g. `https://studybuddy-api.onrender.com`. Leave empty for local development (Vite proxies `/api`) and for the single-project Vercel deployment (same origin). |
| `VITE_MAX_FILE_SIZE_MB` | no | `15` | Upload size the browser accepts. Set to `4` on Vercel, where function request bodies are capped at ~4.5 MB. |

**Never put an AI API key in the client.** Anything prefixed with `VITE_` is bundled into the browser build and is public.

---

## Connecting an AI API

1. Get a key from your provider.
2. Edit `server/.env`:

**OpenAI**
```env
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
AI_BASE_URL=https://api.openai.com/v1
```

**Groq or OpenRouter (same OpenAI-compatible interface)**
```env
AI_PROVIDER=openai
AI_API_KEY=gsk_...
AI_MODEL=llama-3.3-70b-versatile
AI_BASE_URL=https://api.groq.com/openai/v1
```

**Anthropic**
```env
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-...
AI_MODEL=claude-sonnet-4-5
```

**Google Gemini**
```env
AI_PROVIDER=gemini
AI_API_KEY=AIza...
AI_MODEL=gemini-2.0-flash
```

3. Restart the server. `GET /api/ai/status` reports the active provider and whether demo mode is on.

### Adding a different provider
Create `server/src/services/providers/yourProvider.js` exporting `{ name, generate({ system, messages, json }) }` that returns the model's text, then register it in the `providers` map in `server/src/services/aiService.js`. Nothing else has to change.

---

## Demo mode

If `AI_API_KEY` is empty or `AI_PROVIDER=demo`, StudyBuddy serves realistic sample content for every tool: tutor answers in all six modes, notes, summaries, MCQs, flashcards and a full exam pack.

Demo responses are labelled in two places so nobody mistakes them for real AI output:
- a banner under the navigation bar,
- a "Sample response" line at the top of generated text.

Uploading and text extraction are **real** in demo mode; only the AI generation is simulated.

---

## API reference

| Method | Endpoint | Body | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | — | Service status. |
| GET | `/api/ai/status` | — | Active provider, model, demo flag, tutor modes. |
| POST | `/api/ai/chat` | `{ message, history, mode, materialId }` | Tutor answer. |
| POST | `/api/ai/notes` | `{ materialId, topic, style }` | Structured notes. |
| POST | `/api/ai/summary` | `{ materialId, topic }` | Short summary. |
| POST | `/api/ai/mcqs` | `{ materialId, topic, count, difficulty, type }` | MCQs with answers and explanations. |
| POST | `/api/ai/flashcards` | `{ materialId, topic, count }` | Flashcards. |
| POST | `/api/ai/exam-pack` | `{ subject, module, topics, examDate, marksPattern, pattern, materialId }` | Exam pack. |
| POST | `/api/materials` | `multipart/form-data` field `file` | Upload and extract a document. |
| GET | `/api/materials` | — | List uploaded materials. |
| GET | `/api/materials/:id` | — | One material. |
| DELETE | `/api/materials/:id` | — | Remove a material and its file. |

Every response is `{ ok: true, data }` or `{ ok: false, error: { code, message } }`, and every error message is written for a student rather than a developer.

---

## Security notes

- API keys live only in `server/.env`, which is git-ignored. The client bundle never contains one.
- Uploads are validated by extension **and** MIME type, capped by size, and stored with generated file names.
- `/api` is rate limited, with a tighter limit on AI routes.
- JSON bodies are capped at 1 MB; all text inputs are length-checked and clamped server-side.
- CORS is restricted to `CLIENT_ORIGIN`.
- Internal errors are logged on the server and returned as a generic friendly message.
- AI output is rendered as Markdown with raw HTML disabled, so a response cannot inject markup.

---

## Production build

```bash
npm --prefix client run build     # outputs client/dist
npm --prefix client run preview   # preview the built frontend
npm --prefix server start         # run the API in production mode
```

---

## Pushing to GitHub

```bash
git init
git add .
git commit -m "StudyBuddy: AI study platform"
git branch -M main
git remote add origin https://github.com/<your-username>/studybuddy.git
git push -u origin main
```

Check before pushing that `git status` does not list `server/.env` or `client/.env`. Only the `.env.example` files belong in the repository.

---

## Deployment

### Option A — everything on Vercel (one project, recommended for getting online fast)

The repository is already configured for this. `vercel.json` at the root tells Vercel to:

- install root, `server` and `client` dependencies,
- build the Vite app into `client/dist` and serve it as the site,
- run the Express app as one serverless function through `api/[...path].js`, which handles every `/api/*` path,
- rewrite all non-`/api` paths to `index.html`, so refreshing `/quiz` or `/dashboard` does not 404,
- allow a function to run up to 60 seconds, since AI generation is slower than a normal request.

Because the frontend and API share one domain, `VITE_API_BASE_URL` can stay empty and CORS is a non-issue.

**Steps**

1. Push the repository to GitHub (see the section above).
2. On vercel.com: **Add New → Project → Import** your repository.
3. Leave **Root Directory** as the repository root. Do **not** set it to `client` — that would deploy the frontend without the API.
4. Framework preset: **Other**. Leave build and output settings alone; `vercel.json` supplies them.
5. Add environment variables (Settings → Environment Variables), for Production and Preview:

   | Name | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `CLIENT_ORIGIN` | `*` (the API is same-origin here) |
   | `AI_PROVIDER` | `demo`, or your provider |
   | `AI_API_KEY` | your key, or leave unset for demo mode |
   | `AI_MODEL` | model name for that provider |
   | `AI_BASE_URL` | only for OpenAI-compatible providers |
   | `AI_TIMEOUT_MS` | `50000` |
   | `MAX_FILE_SIZE_MB` | `4` |
   | `VITE_MAX_FILE_SIZE_MB` | `4` |

   `VITE_MAX_FILE_SIZE_MB` is read at build time, so changing it needs a redeploy.

6. Deploy, then check `https://<your-project>.vercel.app/api/health`. It should return JSON with `"status":"up"`.

**Known limits of this option**

- **Uploads are unreliable across requests.** Materials are kept in the memory of one function instance. A later request (generating notes from that upload) may land on a different instance that has never seen it, and the material disappears. It works often enough to demo, but it is not dependable. Fix it by moving `materialStore` to a database and the extracted text to that same store, or use Option B.
- **Uploads are capped at about 4.5 MB** by Vercel's request body limit, whatever `MAX_FILE_SIZE_MB` says. Set both size variables to `4`.
- **Rate limiting is per instance**, so the configured limits are looser in practice than the numbers suggest.
- **Cold starts** add a second or two to the first request after idle time.

### Option B — frontend on Vercel, backend on an always-on host (recommended for real use)

This removes every limitation above, because the API is a normal long-running Node process.

**Backend (Render, Railway, Fly.io):**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: everything in `server/.env.example`, with `NODE_ENV=production` and `CLIENT_ORIGIN=https://<your-project>.vercel.app`

**Frontend (Vercel):**
- **Root Directory:** `client` (this makes Vercel use `client/vercel.json`, which handles the SPA rewrite)
- Framework preset: **Vite**
- Environment variable: `VITE_API_BASE_URL=https://<your-api-host>`

Keep `CLIENT_ORIGIN` on the backend in sync with the Vercel URL, or CORS will block the browser.

## Limitations and possible next steps

- **No database.** Uploaded materials are held in server memory and cleared on restart; progress and flashcards live in the browser's local storage. Swap `server/src/services/materialStore.js` for Postgres, MongoDB or Supabase to persist them. On a serverless host this is not just a restart problem — see the Vercel limits above.
- **No real accounts.** The login page saves a name locally. Connect Supabase Auth, Clerk, Firebase or your own JWT routes for real sign-in.
- **No OCR.** Scanned PDFs without a text layer cannot be read. Add Tesseract or a cloud OCR step inside `documentService.js`.
- **Legacy `.doc` and `.ppt`** are rejected with a message asking for `.docx`, `.pptx` or PDF.
- **Whole-document context.** Long materials are truncated to roughly 18,000 characters per request. For a full textbook, add chunking and embeddings (pgvector, Pinecone, Chroma) and retrieve only the relevant sections.
- **Single-instance uploads.** If you run several server instances, move uploads to S3 or similar.
- **AI costs.** Every real generation is a paid API call on most providers. The rate limits included are a starting point, not a billing guard.
