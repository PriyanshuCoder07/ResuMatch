import { useState } from "react";

const styles = {
  wrap: { minHeight: "100vh", background: "#0f0f0f", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", padding: "0" },
  header: { background: "#0f0f0f", borderBottom: "1px solid #1e1e1e", padding: "1.2rem 2rem", display: "flex", alignItems: "center", gap: "10px" },
  logo: { fontSize: "22px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" },
  logoSpan: { color: "#4ade80" },
  badge: { fontSize: "11px", background: "#1a1a1a", border: "1px solid #333", color: "#888", padding: "3px 10px", borderRadius: "20px" },
  main: { maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" },
  hero: { textAlign: "center", marginBottom: "2.5rem" },
  heroTitle: { fontSize: "32px", fontWeight: "700", marginBottom: "8px", lineHeight: 1.2 },
  heroSub: { color: "#888", fontSize: "15px" },
  inputGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "1.5rem" },
  inputBox: { background: "#161616", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1rem 1.2rem" },
  inputLabel: { fontSize: "11px", fontWeight: "600", color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" },
  dot: (color) => ({ width: "6px", height: "6px", borderRadius: "50%", background: color, display: "inline-block" }),
  textarea: { width: "100%", height: "200px", background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontSize: "13px", lineHeight: "1.7", resize: "none", fontFamily: "inherit" },
  btnWrap: { display: "flex", justifyContent: "center", marginBottom: "2.5rem" },
  btn: (loading) => ({ background: loading ? "#333" : "#4ade80", color: loading ? "#666" : "#000", border: "none", padding: "14px 48px", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", letterSpacing: "0.2px" }),
  error: { color: "#f87171", textAlign: "center", marginBottom: "1rem", fontSize: "14px" },
  resultsWrap: { display: "flex", flexDirection: "column", gap: "16px" },
  topRow: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "16px" },
  card: { background: "#161616", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1.2rem 1.4rem" },
  scoreCard: { background: "#161616", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  scoreNum: (score) => ({ fontSize: "48px", fontWeight: "700", color: score >= 70 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171", lineHeight: 1 }),
  scoreLabel: { fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" },
  scoreBadge: (score) => ({ fontSize: "12px", padding: "4px 14px", borderRadius: "20px", fontWeight: "600", background: score >= 70 ? "#052e16" : score >= 50 ? "#1c1a05" : "#2d0a0a", color: score >= 70 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171", border: `1px solid ${score >= 70 ? "#166534" : score >= 50 ? "#854d0e" : "#7f1d1d"}` }),
  summaryText: { fontSize: "14px", color: "#ccc", lineHeight: "1.7", marginTop: "4px" },
  sectionTitle: { fontSize: "11px", fontWeight: "600", color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" },
  chipsWrap: { display: "flex", flexWrap: "wrap", gap: "6px" },
  chip: (type) => ({ fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "20px", background: type === "matched" ? "#052e16" : "#2d0a0a", color: type === "matched" ? "#4ade80" : "#f87171", border: `1px solid ${type === "matched" ? "#166534" : "#7f1d1d"}` }),
  divider: { height: "1px", background: "#2a2a2a", margin: "12px 0" },
  suggItem: { padding: "12px 0", borderBottom: "1px solid #1e1e1e" },
  suggBefore: { fontSize: "13px", color: "#555", textDecoration: "line-through", lineHeight: "1.6", marginBottom: "6px" },
  suggAfter: { fontSize: "13px", color: "#e0e0e0", lineHeight: "1.6", marginBottom: "6px" },
  suggReason: { fontSize: "11px", color: "#4ade80", background: "#052e16", border: "1px solid #166534", padding: "3px 10px", borderRadius: "20px", display: "inline-block" },
  loadingWrap: { textAlign: "center", padding: "3rem", color: "#666" },
  loadingText: { fontSize: "14px", marginBottom: "16px" },
  loadingBar: { height: "2px", background: "#1e1e1e", borderRadius: "2px", overflow: "hidden", width: "200px", margin: "0 auto" },
  loadingFill: { height: "100%", background: "#4ade80", borderRadius: "2px", animation: "load 2s ease-in-out forwards" },
};

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!resume.trim() || !jd.trim()) { setError("Please fill in both fields before analyzing."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd }),
      });
      const data = await res.json();
      if (data.error) { setError("AI error: " + data.error); }
      else { setResult(data); }
    } catch {
      setError("Cannot reach backend. Make sure python app.py is running in the other terminal.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrap}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } textarea::placeholder { color: #444; } @keyframes load { from { width: 0% } to { width: 85% } }`}</style>

      <div style={styles.header}>
        <div style={styles.logo}>Resu<span style={styles.logoSpan}>Match</span></div>
        <div style={styles.badge}>AI-Powered</div>
      </div>

      <div style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.heroTitle}>Know your <span style={{ color: "#4ade80" }}>real match score</span><br />before you apply</div>
          <div style={styles.heroSub}>Paste your resume and the job description — get an honest ATS score, missing keywords, and rewrite suggestions</div>
        </div>

        <div style={styles.inputGrid}>
          <div style={styles.inputBox}>
            <div style={styles.inputLabel}><span style={styles.dot("#60a5fa")}></span>Your resume</div>
            <textarea style={styles.textarea} placeholder="Paste your full resume text here..." value={resume} onChange={e => setResume(e.target.value)} />
          </div>
          <div style={styles.inputBox}>
            <div style={styles.inputLabel}><span style={styles.dot("#facc15")}></span>Job description</div>
            <textarea style={styles.textarea} placeholder="Paste the job description here..." value={jd} onChange={e => setJd(e.target.value)} />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.btnWrap}>
          <button style={styles.btn(loading)} onClick={analyze} disabled={loading}>
            {loading ? "Analyzing your resume..." : "Analyze Match →"}
          </button>
        </div>

        {loading && (
          <div style={styles.loadingWrap}>
            <div style={styles.loadingText}>Running ATS analysis with Gemini AI...</div>
            <div style={styles.loadingBar}><div style={styles.loadingFill}></div></div>
          </div>
        )}

        {result && (
          <div style={styles.resultsWrap}>
            <div style={styles.topRow}>
              <div style={styles.scoreCard}>
                <div style={styles.scoreNum(result.score)}>{result.score}%</div>
                <div style={styles.scoreLabel}>ATS match score</div>
                <div style={styles.scoreBadge(result.score)}>
                  {result.score >= 70 ? "Strong Match" : result.score >= 50 ? "Moderate Match" : "Needs Work"}
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>AI Assessment</div>
                <div style={styles.summaryText}>{result.summary}</div>
                <div style={styles.divider}></div>
                <div style={styles.sectionTitle}>Matched Keywords</div>
                <div style={styles.chipsWrap}>
                  {result.matched?.map(k => <span key={k} style={styles.chip("matched")}>{k}</span>)}
                </div>
                <div style={{ ...styles.divider, marginTop: "12px" }}></div>
                <div style={styles.sectionTitle}>Missing Keywords</div>
                <div style={styles.chipsWrap}>
                  {result.missing?.map(k => <span key={k} style={styles.chip("missing")}>{k}</span>)}
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Rewrite Suggestions — add these to your resume</div>
              {result.suggestions?.map((s, i) => (
                <div key={i} style={{ ...styles.suggItem, ...(i === result.suggestions.length - 1 ? { borderBottom: "none" } : {}) }}>
                  <div style={styles.suggBefore}>{s.before}</div>
                  <div style={styles.suggAfter}>{s.after}</div>
                  <span style={styles.suggReason}>{s.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}