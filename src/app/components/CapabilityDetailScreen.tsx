import { PixelAvatar } from "./PixelAvatar";
import type { UserCareerState } from "../store/userCareerStore";

interface CapabilityDetailScreenProps {
  onBack: () => void;
  userCareerState?: UserCareerState | null;
}

// 成长路径数据 - 各维度随时间变化
const GROWTH_DATA = [
  { date: "2025.06", scores: { "创新性": 72, "逻辑性": 70, "完成度": 68, "表达力": 75 } },
  { date: "2025.09", scores: { "创新性": 78, "逻辑性": 76, "完成度": 74, "表达力": 80 } },
  { date: "2026.01", scores: { "创新性": 85, "逻辑性": 82, "完成度": 80, "表达力": 86 } },
  { date: "2026.04", scores: { "创新性": 88, "逻辑性": 86, "完成度": 84, "表达力": 88 } },
  { date: "2026.06", scores: { "创新性": 95, "逻辑性": 92, "完成度": 88, "表达力": 90 } },
];

const DIMENSIONS = [
  { label: "创新性", score: 95, desc: "方案创意与差异化程度" },
  { label: "逻辑性", score: 92, desc: "论证结构与推理完整性" },
  { label: "完成度", score: 88, desc: "交付物数量与质量" },
  { label: "表达力", score: 90, desc: "语言组织与沟通清晰度" },
];

const HISTORY = [
  { grade: "B+", date: "2025.06", company: "实习评估" },
  { grade: "A−", date: "2025.09", company: "Figma" },
  { grade: "A",  date: "2026.01", company: "阿里巴巴" },
  { grade: "A",  date: "2026.04", company: "阿里巴巴" },
  { grade: "A+", date: "2026.06", company: "字节跳动", current: true },
];

export function CapabilityDetailScreen({ onBack, userCareerState }: CapabilityDetailScreenProps) {
  const us = userCareerState;
  const career = us?.primaryCareer || "product";
  const level = Math.max(1, (us?.totalChallenges || 0) * 2 + 1);
  const userId = us?.userId || "chen-mengqiu";
  const gender = us?.gender || "female";
  const visualTraits = us?.visualTraits;
  const skills = Object.entries(us?.currentSkills || {}).map(([name, score]) => ({ name, score }));
  const capabilityIndex = Object.values(us?.currentSkills || {}).length
    ? Math.round(Object.values(us!.currentSkills).reduce((a,b)=>a+b,0) / Object.values(us!.currentSkills).length)
    : 78;
  const rank = us?.rank || "TOP 50%";
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#FAF9F6",
        overflow: "hidden",
      }}
    >
      {/* Nav bar */}
      <div
        style={{
          height: "44px",
          borderBottom: "2px solid #1A1A1A",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: "12px",
          flexShrink: 0,
          background: "#FAF9F6",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "opacity 0.1s",
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M15 6H1M5 1L1 6L5 11" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "8px",
              color: "#1A1A1A",
              opacity: 0.5,
              letterSpacing: "0.1em",
            }}
          >
            通行证
          </span>
        </button>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.35,
            letterSpacing: "0.15em",
          }}
        >
          能力详情
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          padding: "20px",
        }}
      >
        {/* Hero section */}
        <div
          style={{
            background: "#1A1A1A",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #FF4D00",
            padding: "20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                fontWeight: 700,
                color: "#FAF9F6",
                opacity: 0.4,
                letterSpacing: "0.2em",
                marginBottom: "8px",
              }}
            >
              CAPABILITY / 能力维度
            </div>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#FAF9F6",
                marginBottom: "6px",
              }}
            >
              产品设计
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                color: "#FF4D00",
                letterSpacing: "0.08em",
              }}
            >
              TOP 8% · 产品经理方向
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
          }}>
            <PixelAvatar
              userId={userId}
              career={career}
              level={level}
              gender={gender}
              visualTraits={visualTraits}
              skills={skills}
              cachedImageUrl={us?.avatarUrl}
              size={56}
              style={{ borderRadius: "2px", border: "1px solid rgba(255,77,0,0.3)" }}
            />
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "64px",
                fontWeight: 700,
                color: "#FF4D00",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              A+
            </div>
          </div>
        </div>

        {/* Scoring dimensions */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.35,
            letterSpacing: "0.2em",
            marginBottom: "12px",
          }}
        >
          评分维度
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #1A1A1A",
            marginBottom: "20px",
          }}
        >
          {DIMENSIONS.map((d, i) => (
            <div
              key={d.label}
              style={{
                padding: "14px 14px",
                borderBottom: i < DIMENSIONS.length - 1 ? "1px solid #E5E5E5" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginRight: "8px",
                    }}
                  >
                    {d.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "10px",
                      color: "#8C8C8C",
                    }}
                  >
                    {d.desc}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: d.score >= 90 ? "#FF4D00" : "#1A1A1A",
                  }}
                >
                  {d.score}
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  background: "#E5E5E5",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${d.score}%`,
                    background: d.score >= 90 ? "#FF4D00" : "#1A1A1A",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skill growth path chart */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.35,
            letterSpacing: "0.2em",
            marginBottom: "12px",
          }}
        >
          技能成长路径
        </div>

        {/* Line chart */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #1A1A1A",
            padding: "16px 14px",
            marginBottom: "20px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <svg width="320" height="180" viewBox="0 0 320 180" style={{ display: "block", margin: "0 auto" }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1="40" y1={20 + i * 32}
                x2="300" y2={20 + i * 32}
                stroke="#E5E5E5"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {["100", "75", "50", "25", "0"].map((label, i) => (
              <text
                key={`y-${i}`}
                x="35" y={24 + i * 32}
                textAnchor="end"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="7"
                fill="#8C8C8C"
              >
                {label}
              </text>
            ))}

            {/* Data lines */}
            {["创新性", "逻辑性", "完成度", "表达力"].map((dim, idx) => {
              const colors = ["#FF4D00", "#1A1A1A", "#4CAF50", "#2196F3"];
              const points = GROWTH_DATA.map((d, i) => {
                const x = 50 + i * 62.5;
                const score = d.scores[dim];
                const y = 140 - (score / 100) * 120;
                return `${x},${y}`;
              }).join(" ");

              return (
                <g key={dim}>
                  <polyline
                    points={points}
                    fill="none"
                    stroke={colors[idx]}
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                  {GROWTH_DATA.map((d, i) => {
                    const x = 50 + i * 62.5;
                    const score = d.scores[dim];
                    const y = 140 - (score / 100) * 120;
                    return (
                      <circle
                        key={`${dim}-${i}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill={colors[idx]}
                        stroke="#FFFFFF"
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* X-axis labels */}
            {GROWTH_DATA.map((d, i) => (
              <text
                key={d.date}
                x={50 + i * 62.5}
                y="162"
                textAnchor="middle"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="7"
                fill="#8C8C8C"
              >
                {d.date}
              </text>
            ))}

            {/* Legend */}
            {["创新性", "逻辑性", "完成度", "表达力"].map((dim, idx) => {
              const colors = ["#FF4D00", "#1A1A1A", "#4CAF50", "#2196F3"];
              return (
                <g key={`legend-${dim}`} transform={`translate(${120 + idx * 50}, 175)`}>
                  <line x1="0" y1="0" x2="12" y2="0" stroke={colors[idx]} strokeWidth="2" />
                  <text x="16" y="3" fontFamily="'IBM Plex Mono', monospace" fontSize="6" fill="#1A1A1A">{dim.slice(0, 2)}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Grade history timeline */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.35,
            letterSpacing: "0.2em",
            marginBottom: "12px",
          }}
        >
          评级历史
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #1A1A1A",
            padding: "16px 14px",
            marginBottom: "20px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "0",
              position: "relative",
              minWidth: "280px",
            }}
          >
            {/* Connecting line */}
            <div
              style={{
                position: "absolute",
                top: "22px",
                left: "16px",
                right: "16px",
                height: "2px",
                background: "#E5E5E5",
                zIndex: 0,
              }}
            />

            {HISTORY.map((h) => (
              <div
                key={h.date}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: h.current ? "#FF4D00" : "#1A1A1A",
                    border: "2px solid #1A1A1A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#FAF9F6",
                    }}
                  >
                    {h.grade}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "7px",
                    color: h.current ? "#FF4D00" : "#8C8C8C",
                    letterSpacing: "0.04em",
                    textAlign: "center",
                    fontWeight: h.current ? 700 : 400,
                  }}
                >
                  {h.date}
                </span>
                <span
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "9px",
                    color: "#8C8C8C",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {h.company}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Issuing companies */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.35,
            letterSpacing: "0.2em",
            marginBottom: "10px",
          }}
        >
          认证发布方
        </div>
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #1A1A1A",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          {[
            { name: "字节跳动", serial: "CP-047-PD", date: "2026.06", top: true },
            { name: "阿里巴巴", serial: "CP-031-PD", date: "2026.01", top: false },
          ].map((c, i) => (
            <div
              key={c.name}
              style={{
                padding: "12px 14px",
                borderBottom: i === 0 ? "1px solid #E5E5E5" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    background: c.top ? "#FF4D00" : "#1A1A1A",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "8px",
                      color: "#8C8C8C",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {c.serial}
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#8C8C8C",
                  letterSpacing: "0.06em",
                }}
              >
                {c.date}
              </span>
            </div>
          ))}
        </div>

        {/* How to improve */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.35,
            letterSpacing: "0.2em",
            marginBottom: "10px",
          }}
        >
          如何提升
        </div>
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #1A1A1A",
            marginBottom: "32px",
            overflow: "hidden",
          }}
        >
          {[
            { label: "参加数据分析专项挑战", gap: "C+ → B+", action: "去挑战 →" },
            { label: "完成SQL基础课", gap: "提升查询能力", action: "去学习 →" },
            { label: "距离 A 级还差 6 分", gap: "再完成 2 次挑战", action: "查看详情 →" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "12px 14px",
                borderBottom: i < 2 ? "1px solid #E5E5E5" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    marginBottom: "2px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "8px",
                    color: "#8C8C8C",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.gap}
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  color: "#FF4D00",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {item.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
