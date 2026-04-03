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
You are an expert ATS analyzer and senior career coach.

Analyze the resume against the job description below.
Return ONLY a valid JSON object. No markdown, no code fences, no explanation.

Resume:
{resume_text}

Job Description:
{jd_text}

Return exactly this JSON:
{{
  "score": <realistic integer 0-100>,
  "summary": "<2 sentence honest assessment>",
  "matched": [<6-10 keywords found in both>],
  "missing": [<6-10 important JD keywords missing from resume>],
  "suggestions": [
    {{
      "before": "<exact weak line from resume>",
      "after": "<improved version with keywords and metrics>",
      "reason": "<why this helps, max 10 words>"
    }},
    {{
      "before": "<weak line>",
      "after": "<improved>",
      "reason": "<reason>"
    }},
    {{
      "before": "<weak line>",
      "after": "<improved>",
      "reason": "<reason>"
    }}
  ],
  "report_card": {{
    "skills": {{ "grade": "<A/B/C/D>", "comment": "<one sentence feedback>" }},
    "experience": {{ "grade": "<A/B/C/D>", "comment": "<one sentence feedback>" }},
    "education": {{ "grade": "<A/B/C/D>", "comment": "<one sentence feedback>" }},
    "impact": {{ "grade": "<A/B/C/D>", "comment": "<one sentence feedback on use of metrics/numbers>" }}
  }},
  "role_fits": [
    {{ "role": "<job title>", "match": <integer 60-95>, "reason": "<one sentence why>" }},
    {{ "role": "<job title>", "match": <integer 60-95>, "reason": "<one sentence why>" }},
    {{ "role": "<job title>", "match": <integer 60-95>, "reason": "<one sentence why>" }}
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