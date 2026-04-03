from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import json, os

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    resume_text = data.get("resume", "")
    jd_text = data.get("jd", "")

    if not resume_text or not jd_text:
        return jsonify({"error": "Both fields are required."}), 400

    prompt = f"""
You are an expert ATS analyzer and senior career coach.

Analyze the resume against the job description below.
Return ONLY a valid JSON object. No markdown, no code fences, no explanation.

Resume:
{resume_text}

Job Description:
{jd_text}

Return exactly this JSON structure:
{{
  "score": <realistic integer 0-100 representing ATS match>,
  "summary": "<2 sentence honest assessment of this candidate for this role>",
  "matched": [<list of 6-10 specific skills/keywords found in both>],
  "missing": [<list of 6-10 important JD keywords completely absent from resume>],
  "suggestions": [
    {{
      "before": "<exact weak or vague line from the resume>",
      "after": "<rewritten version with keywords, metrics, and impact>",
      "reason": "<specific reason this change helps, max 10 words>"
    }},
    {{
      "before": "<another weak line>",
      "after": "<improved version>",
      "reason": "<reason>"
    }},
    {{
      "before": "<another weak line>",
      "after": "<improved version>",
      "reason": "<reason>"
    }}
  ]
}}

Rules:
- score must be honest and realistic
- suggestions must use actual lines from the provided resume
- after lines must naturally include missing keywords
- summary must be direct and useful
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
    app.run(debug=True, port=5000)