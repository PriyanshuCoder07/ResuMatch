from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import json, os, base64

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def extract_text_from_pdf(pdf_bytes):
    try:
        import pdfplumber, io
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    except:
        return ""

@app.route("/analyze", methods=["POST"])
def analyze():
    resume_text = ""
    jd_text = ""

    if request.content_type and "multipart" in request.content_type:
        jd_text = request.form.get("jd", "")
        file = request.files.get("resume_pdf")
        if file:
            resume_text = extract_text_from_pdf(file.read())
        else:
            resume_text = request.form.get("resume", "")
    else:
        data = request.json
        resume_text = data.get("resume", "")
        jd_text = data.get("jd", "")

    if not resume_text or not jd_text:
        return jsonify({"error": "Both resume and job description are required."}), 400

    prompt = f"""
You are a professional ATS system and experienced technical recruiter.

Analyze this resume against the job description carefully and realistically.
Be honest but fair — like a real recruiter, not an AI trying to be harsh.

Resume:
{resume_text}

Job Description:
{jd_text}

Scoring guide:
- 75-90: Resume clearly matches most JD requirements with relevant skills and experience
- 55-74: Resume partially matches — has some relevant skills but missing key requirements  
- 35-54: Resume has transferable skills but significant gaps for this specific role
- 20-34: Resume has very little relevance to this specific JD
- Give credit for transferable skills, related technologies, and relevant projects
- A CS student with programming skills applying for a tech role should score at least 45-65
- Do NOT penalize for being a student if the JD is entry level or accepts freshers
- Base the score on actual keyword overlap, skill relevance, and experience fit

Return ONLY this JSON, no explanation, no markdown:
{{
  "score": <balanced integer 0-100>,
  "summary": "<3 sentence recruiter-style assessment — mention specific strengths, gaps, and realistic hiring outlook for this exact role>",
  "matched": [<8-12 keywords/skills found in both resume and JD — include related technologies too>],
  "missing": [<5-8 important JD keywords genuinely absent from resume>],
  "suggestions": [
    {{
      "before": "<exact line from resume that could be stronger for THIS job>",
      "after": "<rewritten version with JD keywords, action verbs, and measurable impact>",
      "reason": "<specific reason tied to THIS JD, max 10 words>"
    }},
    {{
      "before": "<another line>",
      "after": "<improved version>",
      "reason": "<reason>"
    }},
    {{
      "before": "<another line>",
      "after": "<improved version>",
      "reason": "<reason>"
    }}
  ],
  "what_to_add": [<4-5 specific things to ADD to resume to improve chances for THIS role>],
  "what_to_remove": [<2-3 things in resume that are irrelevant for THIS specific role>],
  "report_card": {{
    "skills": {{ "grade": "<A/B/C/D>", "comment": "<specific feedback on skill match for THIS role>" }},
    "experience": {{ "grade": "<A/B/C/D>", "comment": "<honest comment — give credit for projects and internships>" }},
    "education": {{ "grade": "<A/B/C/D>", "comment": "<comment on education relevance>" }},
    "impact": {{ "grade": "<A/B/C/D>", "comment": "<comment on use of numbers and achievements>" }}
  }},
  "role_fits": [
    {{ "role": "<job title this resume is genuinely suited for>", "match": <integer 65-92>, "reason": "<specific reason from resume>" }},
    {{ "role": "<another suitable role>", "match": <integer 65-92>, "reason": "<reason>" }},
    {{ "role": "<another suitable role>", "match": <integer 65-92>, "reason": "<reason>" }}
  ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))