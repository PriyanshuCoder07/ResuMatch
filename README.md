# ResuMatch — AI-Powered Resume Analyzer

> Paste your resume and a job description. Get an honest ATS match score, missing keywords, and AI-generated rewrite suggestions in seconds.

🔗 **Live Demo:** [resumatch.vercel.app](https://resumatch.vercel.app) &nbsp;|&nbsp; 📽️ **Built by:** Priyanshu Raj

---

## What is ResuMatch?

Most job seekers apply without knowing why they get rejected. Applicant Tracking Systems (ATS) filter out resumes before a human ever reads them — purely based on keyword matching.

**ResuMatch solves this.** It analyzes your resume against any job description using AI, tells you exactly what's missing, and rewrites your weak lines to be stronger and more impactful.

---

## Screenshots

### Home Screen
![Home Screen](screenshots/home.png)

### Analysis Results
![Analysis Results](screenshots/results.png)

---

## Features

- **ATS Match Score** — Realistic 0–100% score showing how well your resume matches the job
- **Matched Keywords** — Skills and keywords already present in your resume
- **Missing Keywords** — Important JD keywords completely absent from your resume
- **AI Rewrite Suggestions** — 3 specific resume lines rewritten with better keywords and measurable impact
- **Honest AI Assessment** — A direct 2-sentence evaluation of your candidacy for the role

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Python, Flask |
| AI Model | LLaMA 3.3 70B via Groq API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## How It Works

```
User pastes resume + job description
        ↓
React frontend sends POST request to Flask backend
        ↓
Flask constructs a structured prompt with resume + JD
        ↓
Groq API runs LLaMA 3.3 70B and returns JSON
        ↓
Frontend parses and displays score, keywords, suggestions
```

---

## Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/resumatch.git
cd resumatch
```

### 2. Start the backend
```bash
cd backend
pip install flask flask-cors groq
set GROQ_API_KEY=your_key_here   # Windows
python app.py
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## Project Structure

```
resumatch/
├── frontend/
│   └── src/
│       └── App.jsx        # Full React UI
├── backend/
│   └── app.py             # Flask API + Groq integration
└── README.md
```

---

## Why I Built This

As a pre-final year CSE student, I kept seeing peers get filtered out before interviews — not because they weren't qualified, but because their resumes didn't speak ATS language. I built ResuMatch to solve that problem with AI, turning a black-box rejection into actionable feedback.

---

## Future Improvements

- [ ] PDF resume upload support
- [ ] Score history across multiple job descriptions
- [ ] Export improved resume as PDF
- [ ] LinkedIn job description auto-fetch

---

## Author

**Priyanshu Raj** — B.Tech CSE, Galgotias University  
[GitHub](https://github.com/PriyanshuCoder07) · [LinkedIn](https://www.linkedin.com/in/priyanshu-raj-424336334/)