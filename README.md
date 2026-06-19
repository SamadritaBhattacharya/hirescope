# HireScope

## 🚀 AI-Powered Recruiting Intelligence

HireScope is a modern end-to-end AI research assistant for hiring teams. It analyzes candidate profiles from LinkedIn, GitHub, resumes, and job descriptions, then delivers a polished hire recommendation report with scores, insights, and PDF export.

---

## 🌟 What makes HireScope stand out

- ✅ **Multi-source candidate intelligence**: combines LinkedIn, GitHub, resume text, and job description data.
- 🤖 **AI-driven scoring pipeline**: uses a multi-agent pipeline to compute hire fit, culture fit, and skill match.
- 📊 **Actionable report output**: rich visual report with breakdowns, flags, recommended interview questions, and hire verdict.
- 📄 **Downloadable PDF export**: generates a professional candidate report using WeasyPrint.
- ⚡ **Real-time progress feedback**: SSE streaming keeps users informed while the research job runs.

---

## 🧠 Key capabilities

- LinkedIn profile ingestion via URL or pasted text
- GitHub activity and repo review
- Resume parsing from PDF, DOCX, or plain text
- Job description and culture fit analysis
- Fit scorer that ranks core hiring signals
- Synthesized executive summary and interview prompts

---

## 🏗️ Architecture

- **Backend**: FastAPI, asynchronous job orchestration, Pydantic validation, and custom agents
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **AI / ML stack**: LangChain, LangGraph, Sentence Transformers, Groq LLM integration
- **Data tools**: PDF parsing, Selenium-powered LinkedIn scraping fallback, GitHub REST integration

---

## 📁 Why recruiters and hiring teams will love it

- Presents candidate fit in a **single automated report**
- Reduces manual research time with **AI-synthesized insights**
- Helps hiring teams make better decisions with **quantified score breakdowns**
- Supports both **structured (URLs/files)** and **unstructured (text)** candidate inputs
- Perfect for showcasing AI engineering impact in recruiting automation

---

## ⚙️ Setup Guide

### Backend

1. Create and activate a Python virtual environment in `backend/`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend

1. Install Node dependencies in `frontend/`
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the frontend at `http://localhost:5173`

---

## 💡 Notes for running locally

- The frontend proxies API requests to the backend at `http://localhost:8000`
- PDF export requires native WeasyPrint dependencies on Windows, including `gobject-2.0-0`, Cairo, and Pango

---

## 🛠️ Why this project is ideal for an AI Engineer role

- Demonstrates end-to-end AI product delivery from data ingestion to UI
- Shows experience with AI orchestration, agent-based workflows, and model integration
- Includes strong backend engineering with asynchronous pipelines and type-safe APIs
- Includes frontend product design with compelling report visualization and export
- Highlights practical deployment-ready skills for ML/AI-powered SaaS

---

## 📌 Recommended next steps

- Add a demo screenshot or video link
- Document environment variables and optional config
- Add deployment instructions for cloud or containerized hosting

---

## ❤️ Built with

- Python, FastAPI, Pydantic
- React, TypeScript, Vite, Tailwind CSS
- LangChain / LangGraph, Sentence Transformers
- WeasyPrint, Jinja2
- Selenium, PyGithub, pdfplumber

