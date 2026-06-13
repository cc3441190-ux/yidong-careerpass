import { useState } from "react";

interface Application {
  id: string;
  company: string;
  title: string;
  appliedAt: string;
  status: "已投递" | "企业已查看" | "面试邀约" | "已结束";
  statusColor: string;
  interviewer: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewType?: string;
}

const APPLICATIONS: Application[] = [
  {
    id: "app-001",
    company: "字节跳动",
    title: "产品经理实习生",
    appliedAt: "2026.06.08",
    status: "面试邀约",
    statusColor: "#22C55E",
    interviewer: "张伟 · 高级产品经理",
    interviewTime: "2026.06.15 14:00",
    interviewLocation: "北京市海淀区知春路甲48号盈都大厦",
    interviewType: "现场面试 · 30分钟",
  },
  {
    id: "app-002",
    company: "阿里巴巴",
    title: "产品设计师 - 淘宝",
    appliedAt: "2026.06.05",
    status: "企业已查看",
    statusColor: "#FF4D00",
    interviewer: "李娜 · UX设计专家",
  },
  {
    id: "app-003",
    company: "腾讯",
    title: "UX研究员",
    appliedAt: "2026.06.01",
    status: "已投递",
    statusColor: "#3B82F6",
    interviewer: "王强 · 用户研究总监",
  },
  {
    id: "app-004",
    company: "美团",
    title: "产品经理（到店）",
    appliedAt: "2026.05.28",
    status: "已结束",
    statusColor: "#8C8C8C",
    interviewer: "赵明 · 高级产品经理",
  },
];

export function ApplicationRecordScreen({ onBack }: { onBack: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>("app-001");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF9F6" }}>
      {/* Header with back button */}
      <div style={{
        background: "#1A1A1A",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
        flexShrink: 0,
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
          APPLICATIONS
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 20px 0" }}>

        {/* Status summary */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {[
            { label: "全部", count: 4, color: "#1A1A1A" },
            { label: "面试邀约", count: 1, color: "#22C55E" },
            { label: "已查看", count: 1, color: "#FF4D00" },
            { label: "已投递", count: 1, color: "#3B82F6" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                background: "#FFFFFF",
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: s.color,
                  marginBottom: "2px",
                }}
              >
                {s.count}
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#8C8C8C",
                  letterSpacing: "0.08em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Application list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
          {APPLICATIONS.map((app) => {
            const expanded = expandedId === app.id;
            return (
              <div
                key={app.id}
                style={{
                  background: "#FFFFFF",
                  border: "2px solid #1A1A1A",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
                  padding: "14px",
                  cursor: app.status === "面试邀约" ? "pointer" : "default",
                }}
                onClick={() => {
                  if (app.status === "面试邀约") {
                    setExpandedId(expanded ? null : app.id);
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "#1A1A1A",
                      border: "1.5px solid #1A1A1A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#FAF9F6",
                      }}
                    >
                      {app.company[0]}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                        marginBottom: "2px",
                      }}
                    >
                      {app.company}
                    </div>
                    <div
                      style={{
                        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                        fontSize: "11px",
                        color: "#8C8C8C",
                      }}
                    >
                      {app.title}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      color: "#8C8C8C",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {app.appliedAt}
                  </div>
                </div>

                {/* Status */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    background: `${app.statusColor}08`,
                    border: `1px solid ${app.statusColor}`,
                    borderRadius: "2px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      background: app.statusColor,
                      borderRadius: "0",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: app.statusColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {app.status}
                  </span>
                  {app.status === "面试邀约" && (
                    <span style={{ marginLeft: "auto" }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        <path d="M1 3L5 7L9 3" stroke="#8C8C8C" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Interviewer */}
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "10px",
                    color: "#8C8C8C",
                  }}
                >
                  面试官: {app.interviewer}
                </div>

                {/* Expanded interview details */}
                {expanded && app.status === "面试邀约" && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      background: "#FAF9F6",
                      border: "1.5px solid #1A1A1A",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "8px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                        opacity: 0.4,
                        letterSpacing: "0.15em",
                        marginBottom: "8px",
                      }}
                    >
                      面试详情
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "12px", color: "#1A1A1A" }}>
                        <span style={{ color: "#8C8C8C" }}>时间: </span>
                        {app.interviewTime}
                      </div>
                      <div style={{ fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "12px", color: "#1A1A1A" }}>
                        <span style={{ color: "#8C8C8C" }}>地点: </span>
                        {app.interviewLocation}
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#FF4D00", fontWeight: 700, marginTop: "2px" }}>
                        {app.interviewType}
                      </div>
                    </div>
                    <button
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        height: "36px",
                        background: "#22C55E",
                        border: "2px solid #1A1A1A",
                        borderRadius: "4px",
                        color: "#FAF9F6",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      确认参加面试
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
