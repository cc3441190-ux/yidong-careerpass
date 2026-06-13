import { useCallback } from "react";

interface ChallengeRecordScreenProps {
  onBack: () => void;
  onViewResult: (id: string) => void;
}

const RECORDS = [
  {
    id: "challenge-001",
    title: "产品经理实习生 · 春招挑战",
    company: "字节跳动",
    date: "2026.03.15",
    status: "completed",
    score: 85,
    grade: "A",
  },
  {
    id: "challenge-002",
    title: "UI设计师 · 暑期实习挑战",
    company: "腾讯",
    date: "2026.03.10",
    status: "in-progress",
    score: null,
    grade: null,
  },
  {
    id: "challenge-003",
    title: "前端开发 · 秋招挑战",
    company: "阿里",
    date: "2026.02.28",
    status: "completed",
    score: 72,
    grade: "B+",
  },
  {
    id: "challenge-004",
    title: "数据分析师 · 春招挑战",
    company: "美团",
    date: "2026.02.20",
    status: "expired",
    score: null,
    grade: null,
  },
];

export function ChallengeRecordScreen({ onBack, onViewResult }: ChallengeRecordScreenProps) {
  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: 700, color: "#4CAF50", background: "rgba(76,175,80,0.1)", padding: "2px 6px" }}>已完成</span>;
      case "in-progress":
        return <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: 700, color: "#FF9800", background: "rgba(255,152,0,0.1)", padding: "2px 6px" }}>进行中</span>;
      case "expired":
        return <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: 700, color: "#8C8C8C", background: "rgba(140,140,140,0.1)", padding: "2px 6px" }}>已过期</span>;
      default:
        return null;
    }
  }, []);

  return (
    <div style={{ flex:1, display: "flex", flexDirection: "column", background: "#FAF9F6" }}>
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
          挑战记录
        </span>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {RECORDS.map((record) => (
            <div
              key={record.id}
              onClick={() => record.status === "completed" && onViewResult(record.id)}
              style={{
                background: "#FFFFFF",
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
                padding: "14px",
                cursor: record.status === "completed" ? "pointer" : "default",
                transition: "background-color 0.1s",
                opacity: record.status === "expired" ? 0.6 : 1,
              }}
              onMouseDown={(e) => {
                if (record.status === "completed") {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,77,0,0.06)";
                }
              }}
              onMouseUp={(e) => {
                if (record.status === "completed") {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (record.status === "completed") {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                }
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    marginBottom: "2px",
                  }}>
                    {record.title}
                  </div>
                  <div style={{
                    fontFamily: "'PingFang SC', sans-serif",
                    fontSize: "10px",
                    color: "#8C8C8C",
                  }}>
                    {record.company} · {record.date}
                  </div>
                </div>
                {getStatusBadge(record.status)}
              </div>
              {record.status === "completed" && record.score !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "8px", borderTop: "1px solid #E5E5E5" }}>
                  <div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#8C8C8C" }}>得分 </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", fontWeight: 700, color: "#FF4D00" }}>{record.score}</span>
                  </div>
                  <div style={{ width: "1px", height: "12px", background: "#E5E5E5" }} />
                  <div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#8C8C8C" }}>评级 </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>{record.grade}</span>
                  </div>
                  <div style={{ flex: 1 }} />
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#FF4D00",
                    letterSpacing: "0.06em",
                  }}>
                    查看报告 →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
