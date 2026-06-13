import { PixelAvatar } from "./PixelAvatar";
import type { EvaluateResult } from "./LoadingScreen";
import type { UserCareerState } from "../store/userCareerStore";

interface ChallengeResultScreenProps {
  onBack: () => void;
  onViewScoreDetail?: () => void;
  result?: EvaluateResult | null;
  userCareerState?: UserCareerState | null;
}

const RESULT_DATA = {
  challengeName: "产品经理实习生 · 春招挑战",
  company: "字节跳动",
  date: "2026.03.15",
  overallScore: 85,
  grade: "A",
  capabilities: [
    { name: "产品思维", score: 92, feedback: "表现出色，能够系统性思考产品问题" },
    { name: "用户洞察", score: 78, feedback: "对用户需求有基本理解，可加强深度挖掘" },
    { name: "数据分析", score: 85, feedback: "能够运用数据支持决策，逻辑清晰" },
    { name: "沟通表达", score: 88, feedback: "表达清晰，结构化思维强" },
    { name: "创新思维", score: 82, feedback: "有一定创新意识，建议多关注行业前沿" },
  ],
  strengths: ["系统性思考能力强", "数据驱动决策意识好", "沟通表达清晰"],
  improvements: ["用户研究深度可加强", "创新思维需持续培养"],
  recommendation: "建议你继续深化用户研究方法，多关注行业创新案例，有望成为优秀的产品经理。",
};

export function ChallengeResultScreen({ onBack, onViewScoreDetail, result, userCareerState }: ChallengeResultScreenProps) {
  const us = userCareerState;
  const career = us?.primaryCareer || "product";
  const level = Math.max(1, (us?.totalChallenges || 0) * 2 + 1);
  const userId = us?.userId || "chen-mengqiu";
  const skillsForAvatar = Object.entries(us?.currentSkills || {}).map(([name, score]) => ({ name, score }));
  const gender = us?.gender || "female";
  const visualTraits = us?.visualTraits;
  const usedResult = result || RESULT_DATA;
  const getGradeColor = (score: number) => {
    if (score >= 90) return "#4CAF50";
    if (score >= 80) return "#FF4D00";
    if (score >= 70) return "#FF9800";
    return "#F44336";
  };

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
          挑战报告
        </span>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px" }}>
        {/* Avatar display with upgrade effect */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "16px",
          padding: "16px",
          background: "#1A1A1A",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #FF4D00",
        }}>
          <div style={{
            position: "relative",
            animation: "avatarGlowPulse 2s ease-in-out infinite",
          }}>
            <PixelAvatar
              userId={userId}
              career={career}
              level={level}
              gender={gender}
              visualTraits={visualTraits}
              cachedImageUrl={userCareerState?.avatarUrl}
              skills={skillsForAvatar.length ? skillsForAvatar : [
                { name: "用户研究", grade: "B+", score: 78 },
                { name: "产品设计", grade: "A+", score: 94 },
              ]}
              size={100}
              glow={true}
            />
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            color: "#FF4D00",
            marginTop: "8px",
            letterSpacing: "0.1em",
          }}>
            用户研究  B → B⁺  升级！
          </div>
          <div style={{
            fontFamily: "'PingFang SC', sans-serif",
            fontSize: "10px",
            color: "#FAF9F6",
            opacity: 0.5,
            marginTop: "2px",
          }}>
            能力维度已提升
          </div>
        </div>

        {/* Challenge info */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "14px",
        }}>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: "4px",
          }}>
            {usedResult.challengeName}
          </div>
          <div style={{
            fontFamily: "'PingFang SC', sans-serif",
            fontSize: "11px",
            color: "#8C8C8C",
            marginBottom: "12px",
          }}>
            {usedResult.company} · {usedResult.date}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#8C8C8C", marginBottom: "2px" }}>总分</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "32px", fontWeight: 700, color: "#FF4D00" }}>{usedResult.overallScore}</div>
            </div>
            <div style={{ width: "1px", height: "40px", background: "#E5E5E5" }} />
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#8C8C8C", marginBottom: "2px" }}>评级</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "32px", fontWeight: 700, color: "#1A1A1A" }}>{usedResult.grade}</div>
            </div>
            <div style={{ width: "1px", height: "40px", background: "#E5E5E5" }} />
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#8C8C8C", marginBottom: "2px" }}>排名</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", fontWeight: 700, color: "#FF4D00" }}>
                TOP 18%
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px", color: "#8C8C8C", letterSpacing: "0.04em" }}>
                超过 82% 同岗候选人
              </div>
            </div>
          </div>
        </div>

        {/* Capability breakdown */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "14px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "10px 14px",
            borderBottom: "2px solid #1A1A1A",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.45,
            letterSpacing: "0.15em",
          }}>
            能力维度分析
          </div>
          {usedResult.capabilities.map((cap, i) => (
            <button
              key={cap.name}
              onClick={onViewScoreDetail}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderBottom: i < usedResult.capabilities.length - 1 ? "1px solid #E5E5E5" : "none",
                background: "none",
                border: "none",
                borderLeft: "3px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FAF9F6"; (e.currentTarget as HTMLElement).style.borderLeft = "3px solid #FF4D00"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderLeft = "3px solid transparent"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "12px", fontWeight: 700, color: "#1A1A1A" }}>{cap.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", fontWeight: 700, color: getGradeColor(cap.score) }}>{cap.score}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", color: "#FF4D00", fontWeight: 700, letterSpacing: "0.06em" }}>→</span>
                </div>
              </div>
              <div style={{ height: "4px", background: "#E5E5E5", marginBottom: "6px" }}>
                <div style={{ height: "100%", width: `${cap.score}%`, background: getGradeColor(cap.score) }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "10px", color: "#8C8C8C", lineHeight: 1.4 }}>{cap.feedback}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px", color: "#8C8C8C", opacity: 0.6, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>点击查看评分标准</div>
              </div>
            </button>
          ))}
        </div>

        {/* Strengths & Improvements */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
          <div style={{
            flex: 1,
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "12px",
          }}>
            <div style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "11px", fontWeight: 700, color: "#4CAF50", marginBottom: "8px" }}>✓ 优势</div>
            {usedResult.strengths.map((s, i) => (
              <div key={i} style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "10px", color: "#1A1A1A", marginBottom: "4px", paddingLeft: "8px", borderLeft: "2px solid #4CAF50" }}>{s}</div>
            ))}
          </div>
          <div style={{
            flex: 1,
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "12px",
          }}>
            <div style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF9800", marginBottom: "8px" }}>△ 提升</div>
            {usedResult.improvements.map((s, i) => (
              <div key={i} style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "10px", color: "#1A1A1A", marginBottom: "4px", paddingLeft: "8px", borderLeft: "2px solid #FF9800" }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div style={{
          background: "#1A1A1A",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #FF4D00",
          padding: "14px",
          marginBottom: "20px",
        }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: 700, color: "#FF4D00", letterSpacing: "0.1em", marginBottom: "8px" }}>
            导师建议
          </div>
          <div style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "12px", color: "#FAF9F6", lineHeight: 1.6 }}>
            {usedResult.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
