import { useState, useRef, useEffect } from "react";

const API = "https://resumatch-backend-api.onrender.com";

const s = {
  wrap: { minHeight: "100vh", background: "#0f0f0f", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif" },
  header: { borderBottom: "1px solid #1e1e1e", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "10px" },
  logo: { fontSize: "22px", fontWeight: "700", color: "#fff" },
  logoSpan: { color: "#4ade80" },
  badge: { fontSize: "11px", background: "#1a1a1a", border: "1px solid #333", color: "#888", padding: "3px 10px", borderRadius: "20px" },
  main: { maxWidth: "920px", margin: "0 auto", padding: "2.5rem 2rem" },
  hero: { textAlign: "center", marginBottom: "2.5rem" },
  heroTitle: { fontSize: "32px", fontWeight: "700", marginBottom: "8px", lineHeight: 1.2 },
  heroSub: { color: "#888", fontSize: "15px" },
  inputGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "1.5rem" },
  inputBox: { background: "#161616", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1rem 1.2rem" },
  inputLabel: { fontSize: "11px", fontWeight: "600", color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" },
  textarea: { width: "100%", height: "180px", background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontSize: "13px", lineHeight: "1.7", resize: "none", fontFamily: "inherit" },
  uploadBtn: { marginTop: "8px", display: "inline-block", fontSize: "12px", color: "#4ade80", cursor: "pointer", border: "1px dashed #4ade80", padding: "6px 14px", borderRadius: "8px", background: "transparent" },
  uploadName: { fontSize: "11px", color: "#666", marginTop: "6px" },
  btnWrap: { display: "flex", justifyContent: "center", marginBottom: "2rem" },
  btn: (l) => ({ background: l ? "#1a1a1a" : "#4ade80", color: l ? "#666" : "#000", border: "none", padding: "14px 48px", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: l ? "not-allowed" : "pointer", transition: "all 0.2s" }),
  error: { color: "#f87171", textAlign: "center", marginBottom: "1rem", fontSize: "14px" },
  col: { display: "flex", flexDirection: "column", gap: "16px" },
  topRow: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "16px" },
  card: { background: "#161616", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1.2rem 1.4rem" },
  scoreCard: { background: "#161616", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  sectionTitle: { fontSize: "11px", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" },
  divider: { height: "1px", background: "#1e1e1e", margin: "12px 0" },
  chipsWrap: { display: "flex", flexWrap: "wrap", gap: "6px" },
  chip: (t) => ({ fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "20px", background: t === "matched" ? "#052e16" : "#2d0a0a", color: t === "matched" ? "#4ade80" : "#f87171", border: `1px solid ${t === "matched" ? "#166534" : "#7f1d1d"}` }),
  suggItem: { padding: "12px 0", borderBottom: "1px solid #1a1a1a" },
  suggBefore: { fontSize: "13px", color: "#444", textDecoration: "line-through", lineHeight: "1.6", marginBottom: "6px" },
  suggAfter: { fontSize: "13px", color: "#e0e0e0", lineHeight: "1.6", marginBottom: "6px" },
  suggReason: { fontSize: "11px", color: "#4ade80", background: "#052e16", border: "1px solid #166534", padding: "3px 10px", borderRadius: "20px", display: "inline-block" },
  gradeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  gradeItem: (g) => ({ background: "#0f0f0f", border: `1px solid ${g==="A"?"#166534":g==="B"?"#854d0e":g==="C"?"#1e3a5f":"#7f1d1d"}`, borderRadius: "10px", padding: "12px" }),
  gradeBadge: (g) => ({ fontSize: "20px", fontWeight: "700", color: g==="A"?"#4ade80":g==="B"?"#facc15":g==="C"?"#60a5fa":"#f87171" }),
  gradeLabel: { fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" },
  gradeComment: { fontSize: "12px", color: "#aaa", marginTop: "4px", lineHeight: "1.5" },
  roleItem: { display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderBottom: "1px solid #1a1a1a" },
  roleBar: { flex: 1, height: "6px", background: "#1e1e1e", borderRadius: "3px", overflow: "hidden" },
  roleBarFill: (m) => ({ height: "100%", width: m + "%", background: m >= 80 ? "#4ade80" : m >= 65 ? "#facc15" : "#60a5fa", borderRadius: "3px", transition: "width 1s ease" }),
  summaryText: { fontSize: "14px", color: "#ccc", lineHeight: "1.7" },
};

function ScoreRing({ score }) {
  const [display, setDisplay] = useState(0);
  const r = 42, circ = 2 * Math.PI * r;
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i = Math.min(i + 2, score); setDisplay(i); if (i >= score) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [score]);
  const color = score >= 70 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#1e1e1e" strokeWidth="8" />
      <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={circ - (display / 100) * circ}
        transform="rotate(-90 55 55)" style={{ transition: "stroke-dashoffset 0.05s" }} />
      <text x="55" y="55" textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize="20" fontWeight="700">{display}%</text>
    </svg>
  );
}

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const analyze = async () => {
    if ((!resume.trim() && !pdfFile) || !jd.trim()) { setError("Please fill in both fields."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      let res;
      if (pdfFile) {
        const fd = new FormData();
        fd.append("resume_pdf", pdfFile);
        fd.append("jd", jd);
        res = await fetch(`${API}/analyze`, { method: "POST", body: fd });
      } else {
        res = await fetch(`${API}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume, jd }),
        });
      }
      const data = await res.json();
      if (data.error) setError("AI error: " + data.error);
      else setResult(data);
    } catch { setError("Cannot reach backend. Make sure it is running."); }
    setLoading(false);
  };

  return (
    <div style={s.wrap}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } textarea::placeholder { color: #333; } body { background: #0f0f0f; }`}</style>
      <div style={s.header}>
        <div style={s.logo}>Resu<span style={s.logoSpan}>Match</span></div>
        <div style={s.badge}>AI-Powered</div>
      </div>
      <div style={s.main}>
        <div style={s.hero}>
          <div style={s.heroTitle}>Know your <span style={{ color: "#4ade80" }}>real match score</span><br />before you apply</div>
          <div style={s.heroSub}>Get your ATS score, missing keywords, section grades, and role fit — instantly</div>
        </div>

        <div style={s.inputGrid}>
          <div style={s.inputBox}>
            <div style={s.inputLabel}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", display: "inline-block" }}></span>Your resume</div>
            <textarea style={s.textarea} placeholder="Paste your resume text here..." value={resume} onChange={e => { setResume(e.target.value); setPdfFile(null); }} />
            <div>
              <input type="file" accept=".pdf" ref={fileRef} style={{ display: "none" }} onChange={e => { setPdfFile(e.target.files[0]); setResume(""); }} />
              <button style={s.uploadBtn} onClick={() => fileRef.current.click()}>Upload PDF instead</button>
              {pdfFile && <div style={s.uploadName}>📄 {pdfFile.name}</div>}
            </div>
          </div>
          <div style={s.inputBox}>
            <div style={s.inputLabel}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#facc15", display: "inline-block" }}></span>Job description</div>
            <textarea style={s.textarea} placeholder="Paste the job description here..." value={jd} onChange={e => setJd(e.target.value)} />
          </div>
        </div>

        {error && <div style={s.error}>{error}</div>}
        <div style={s.btnWrap}>
          <button style={s.btn(loading)} onClick={analyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Match →"}
          </button>
        </div>

        {result && (
          <div style={s.col}>
            <div style={s.topRow}>
              <div style={s.scoreCard}>
                <ScoreRing score={result.score} />
                <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>ATS Match Score</div>
                <div style={{ fontSize: "12px", fontWeight: "600", padding: "4px 14px", borderRadius: "20px", background: result.score>=70?"#052e16":result.score>=50?"#1c1a05":"#2d0a0a", color: result.score>=70?"#4ade80":result.score>=50?"#facc15":"#f87171", border: `1px solid ${result.score>=70?"#166534":result.score>=50?"#854d0e":"#7f1d1d"}` }}>
                  {result.score >= 70 ? "Strong Match" : result.score >= 50 ? "Moderate Match" : "Needs Work"}
                </div>
              </div>
              <div style={s.card}>
                <div style={s.sectionTitle}>AI Assessment</div>
                <div style={s.summaryText}>{result.summary}</div>
                <div style={s.divider} />
                <div style={s.sectionTitle}>Matched Keywords</div>
                <div style={s.chipsWrap}>{result.matched?.map(k => <span key={k} style={s.chip("matched")}>{k}</span>)}</div>
                <div style={s.divider} />
                <div style={s.sectionTitle}>Missing Keywords</div>
                <div style={s.chipsWrap}>{result.missing?.map(k => <span key={k} style={s.chip("missing")}>{k}</span>)}</div>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Resume Report Card</div>
              <div style={s.gradeGrid}>
                {result.report_card && Object.entries(result.report_card).map(([section, data]) => (
                  <div key={section} style={s.gradeItem(data.grade)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <div style={s.gradeBadge(data.grade)}>{data.grade}</div>
                      <div style={s.gradeLabel}>{section}</div>
                    </div>
                    <div style={s.gradeComment}>{data.comment}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Role Fit Predictor — best matches for your resume</div>
              {result.role_fits?.map((r, i) => (
                <div key={i} style={{ ...s.roleItem, ...(i === result.role_fits.length - 1 ? { borderBottom: "none" } : {}) }}>
                  <div style={{ width: "180px", fontSize: "13px", fontWeight: "500", color: "#e0e0e0" }}>{r.role}</div>
                  <div style={s.roleBar}><div style={s.roleBarFill(r.match)}></div></div>
                  <div style={{ width: "40px", fontSize: "13px", fontWeight: "600", color: "#4ade80", textAlign: "right" }}>{r.match}%</div>
                  <div style={{ fontSize: "12px", color: "#666", flex: 1.5 }}>{r.reason}</div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Rewrite Suggestions</div>
              {result.suggestions?.map((s, i) => (
                <div key={i} style={{ ...s.suggItem, ...(i === result.suggestions.length - 1 ? { borderBottom: "none" } : {}) }}>
                  <div style={s.suggBefore}>{s.before}</div>
                  <div style={s.suggAfter}>{s.after}</div>
                  <span style={s.suggReason}>{s.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}