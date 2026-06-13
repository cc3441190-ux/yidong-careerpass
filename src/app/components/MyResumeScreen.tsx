interface MyResumeScreenProps {
  onBack: () => void;
}

const RESUME_SECTIONS = [
  { id: "basic", title: "基本信息", completed: true },
  { id: "education", title: "教育经历", completed: true },
  { id: "experience", title: "项目经历", completed: false, hint: "补充后可提升完整度至 90%" },
  { id: "skills", title: "技能标签", completed: true },
  { id: "portfolio", title: "作品集", completed: false, hint: "添加作品集链接" },
];

export function MyResumeScreen({ onBack }: MyResumeScreenProps) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF9F6" }}>
      {/* Header */}
      <div style={{
        background: "#1A1A1A",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "center", gap: "6px",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M1 7L7 1M1 7L7 13" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", fontWeight: 700, color: "#FAF9F6", letterSpacing: "0.1em" }}>
            返回
          </span>
        </button>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          fontWeight: 700,
          color: "#FAF9F6",
          opacity: 0.45,
          letterSpacing: "0.15em",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          我的简历
        </span>
        <button style={{
          position: "absolute",
          right: "14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          fontWeight: 700,
          color: "#FF4D00",
          letterSpacing: "0.06em",
        }}>
          编辑
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px" }}>
        {/* Completeness card */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "13px", fontWeight: 700, color: "#1A1A1A" }}>
              简历完整度
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "18px", fontWeight: 700, color: "#FF4D00" }}>
              75%
            </span>
          </div>
          <div style={{ height: "6px", background: "#E5E5E5", border: "1.5px solid #1A1A1A", position: "relative", marginBottom: "8px" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "75%", background: "#FF4D00" }} />
          </div>
          <div style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "10px", color: "#8C8C8C" }}>
            补充"项目经历"可提升至 90% · 更多机会曝光
          </div>
        </div>

        {/* Sections */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          overflow: "hidden",
        }}>
          {RESUME_SECTIONS.map((section, i) => (
            <div
              key={section.id}
              style={{
                padding: "14px",
                borderBottom: i < RESUME_SECTIONS.length - 1 ? "1px solid #E5E5E5" : "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                transition: "background-color 0.1s",
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,77,0,0.06)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              <div style={{
                width: "20px",
                height: "20px",
                border: "2px solid #1A1A1A",
                background: section.completed ? "#FF4D00" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {section.completed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}>
                  {section.title}
                </div>
                {section.hint && (
                  <div style={{
                    fontFamily: "'PingFang SC', sans-serif",
                    fontSize: "10px",
                    color: "#FF4D00",
                    marginTop: "2px",
                  }}>
                    {section.hint}
                  </div>
                )}
              </div>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                <path d="M1 1L7 6L1 11" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
